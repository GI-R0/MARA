import Pista from "../models/Pista.js";
import Reserva from "../models/Reserva.js";
import { validationResult } from "express-validator";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const getPistas = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [pistas, total] = await Promise.all([
    Pista.find()
      .populate("club", "name email")
      .skip(skip)
      .limit(limit)
      .lean(),
    Pista.countDocuments(),
  ]);

  res.json({
    pistas,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getPistaById = asyncHandler(async (req, res) => {
  const pista = await Pista.findById(req.params.id)
    .populate("club", "name")
    .lean();
  if (!pista) return res.status(404).json({ msg: "Pista no encontrada" });

  let horariosDisponibles = pista.horariosDisponibles;

  if (req.query.fecha) {
    const fecha = new Date(req.query.fecha);
    if (isNaN(fecha)) {
      return res.status(400).json({ msg: "Fecha inválida" });
    }

    const reservas = await Reserva.find({
      pista: req.params.id,
      fecha: fecha,
      estado: { $ne: "cancelada" },
    })
      .select("hora duracion")
      .lean();

    const ocupados = new Set();
    reservas.forEach((reserva) => {
      const startHour = parseInt(reserva.hora.split(":")[0]);
      for (let i = 0; i < reserva.duracion; i++) {
        const hourStr = `${String(startHour + i).padStart(2, "0")}:00`;
        ocupados.add(hourStr);
      }
    });

    horariosDisponibles = pista.horariosDisponibles.filter(
      (h) => !ocupados.has(h),
    );
  }

  res.json({ ...pista, horariosDisponibles });
});

export const getPistasByClub = asyncHandler(async (req, res) => {
  const clubId = req.params.clubId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [pistas, total] = await Promise.all([
    Pista.find({ club: clubId })
      .populate("club", "name email")
      .skip(skip)
      .limit(limit)
      .lean(),
    Pista.countDocuments({ club: clubId }),
  ]);

  res.json({
    pistas,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getEstadisticasClub = asyncHandler(async (req, res) => {
  const clubId = req.user._id;

  const pistasActivas = await Pista.countDocuments({ club: clubId });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  const pistasList = await Pista.find({ club: clubId }).select("_id");
  const pistasIds = pistasList.map((p) => p._id);

  const reservasHoy = await Reserva.countDocuments({
    pista: { $in: pistasIds },
    fecha: { $gte: hoy, $lt: manana },
  });

  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const finMes = new Date(
    hoy.getFullYear(),
    hoy.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  const reservasMes = await Reserva.find({
    pista: { $in: pistasIds },
    fecha: { $gte: inicioMes, $lte: finMes },
    estado: { $ne: "cancelada" },
  }).select("total");

  const ingresosMes = reservasMes.reduce((sum, r) => sum + (r.total || 0), 0);

  const pistasConRatings = await Pista.find({ club: clubId }).select(
    "ratings ratingPromedio",
  );

  let valoracionPromedio = 0;
  if (pistasConRatings.length > 0) {
    const sumaRatings = pistasConRatings.reduce(
      (acc, p) => acc + (p.ratingPromedio || 0),
      0,
    );
    valoracionPromedio = (sumaRatings / pistasConRatings.length).toFixed(1);
  }

  res.json({
    pistasActivas,
    reservasHoy,
    ingresosMes: ingresosMes.toFixed(2),
    valoracion: parseFloat(valoracionPromedio),
  });
});

export const createPista = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const pista = new Pista({
    ...req.body,
    club: req.user._id,
  });
  const saved = await pista.save();
  const populated = await Pista.findById(saved._id).populate(
    "club",
    "name email",
  );
  res.status(201).json(populated);
});

export const updatePista = asyncHandler(async (req, res) => {
  const pista = await Pista.findById(req.params.id);

  if (!pista) return res.status(404).json({ msg: "Pista no encontrada" });

  if (pista.club.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ msg: "No tienes permiso para actualizar esta pista" });
  }

  const updated = await Pista.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("club", "name email");

  res.json(updated);
});

export const deletePista = asyncHandler(async (req, res) => {
  const pista = await Pista.findById(req.params.id);
  if (!pista) return res.status(404).json({ msg: "Pista no encontrada" });

  if (pista.club.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ msg: "No tienes permiso para eliminar esta pista" });
  }

  await Pista.findByIdAndDelete(req.params.id);
  res.json({ msg: "Pista eliminada correctamente" });
});

export const addRating = asyncHandler(async (req, res) => {
  const { puntuacion, comentario } = req.body;
  const pistaId = req.params.id;

  if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
    return res.status(400).json({
      msg: "La puntuación debe estar entre 1 y 5",
    });
  }

  const pista = await Pista.findById(pistaId);
  if (!pista) return res.status(404).json({ msg: "Pista no encontrada" });

  const yaCalifico = pista.ratings.some(
    (r) => r.usuario.toString() === req.user._id.toString(),
  );

  if (yaCalifico) {
    return res.status(400).json({
      msg: "Ya has calificado esta pista. Puedes actualizar tu calificación más tarde.",
    });
  }

  pista.ratings.push({
    usuario: req.user._id,
    puntuacion,
    comentario: comentario || "",
  });

  pista.calcularRatingPromedio();

  const saved = await pista.save();
  const populated = await Pista.findById(saved._id)
    .populate({
      path: "ratings.usuario",
      select: "name email",
    })
    .populate("club", "name email");

  res.status(201).json({
    msg: "Rating agregado correctamente",
    pista: populated,
  });
});

export const getRatings = asyncHandler(async (req, res) => {
  const pista = await Pista.findById(req.params.id)
    .select("ratings ratingPromedio")
    .populate({
      path: "ratings.usuario",
      select: "name email",
    });

  if (!pista) return res.status(404).json({ msg: "Pista no encontrada" });

  res.json({
    ratingPromedio: pista.ratingPromedio,
    totalRatings: pista.ratings.length,
    ratings: pista.ratings,
  });
});

export const updatePistaImage = asyncHandler(async (req, res) => {
  const { imagen } = req.body;

  if (!imagen) {
    return res.status(400).json({ msg: "URL de imagen es requerida" });
  }

  const pista = await Pista.findByIdAndUpdate(
    req.params.id,
    { imagen },
    { new: true, runValidators: true },
  );

  if (!pista) {
    return res.status(404).json({ msg: "Pista no encontrada" });
  }

  res.json({
    msg: "Imagen actualizada correctamente",
    pista,
  });
});
