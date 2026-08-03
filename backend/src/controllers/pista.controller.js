import Pista from "../models/Pista.js";
import Reserva from "../models/Reserva.js";
import { validationResult } from "express-validator";

const runPistaQueryWithSafePopulate = async (queryFactory, context) => {
  try {
    return await queryFactory().populate("club", "name email").lean();
  } catch (err) {
    console.warn(
      `[WARN] ${context}: fallo al poblar club. Se devuelve respuesta sin populate.`,
      err.message,
    );
    return await queryFactory().lean();
  }
};

export const getPistas = async (req, res) => {
  try {
    const shouldReturnAll = req.query.all === "true";

    if (shouldReturnAll) {
      const pistas = await runPistaQueryWithSafePopulate(
        () => Pista.find(),
        "getPistas(all=true)",
      );

      return res.json({
        pistas,
        pagination: {
          page: 1,
          limit: pistas.length,
          total: pistas.length,
          pages: 1,
        },
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [pistas, total] = await Promise.all([
      runPistaQueryWithSafePopulate(
        () => Pista.find().skip(skip).limit(limit),
        "getPistas(paginado)",
      ),
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
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener pistas" });
  }
};

export const getPistaById = async (req, res) => {
  try {
    const [pista] = await runPistaQueryWithSafePopulate(
      () => Pista.find({ _id: req.params.id }),
      "getPistaById",
    );
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

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const fechaStr = fecha.toISOString().split("T")[0];
      if (fechaStr === todayStr) {
        const now = new Date();
        horariosDisponibles = horariosDisponibles.filter((h) => {
          const slotTime = new Date(`${fechaStr}T${h}:00`);
          return slotTime > now;
        });
      }
    }

    res.json({ ...pista, horariosDisponibles });
  } catch (err) {
    res.status(500).json({ msg: "Error al buscar pista" });
  }
};

export const getPistasByClub = async (req, res) => {
  try {
    const clubId = req.params.clubId;

    const pistas = await runPistaQueryWithSafePopulate(
      () => Pista.find({ club: clubId }),
      "getPistasByClub",
    );

    res.json(pistas);
  } catch (err) {
    console.error("[ERROR] Get pistas by club:", err.message);
    res.status(500).json({ msg: "Error al obtener pistas del club" });
  }
};

export const getEstadisticasClub = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener estadísticas" });
  }
};

export const createPista = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
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
  } catch (err) {
    console.error("[ERROR] Creating pista:", err.message);
    res.status(400).json({ msg: "Error al crear pista", error: err.message });
  }
};

export const updatePista = async (req, res) => {
  try {
    const pista = await Pista.findById(req.params.id);

    if (!pista) return res.status(404).json({ msg: "Pista no encontrada" });

    if (
      req.user.role !== "admin" &&
      pista.club.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ msg: "No tienes permiso para actualizar esta pista" });
    }

    const updated = await Pista.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("club", "name email");

    res.json(updated);
  } catch (err) {
    console.error("[ERROR] Updating pista:", err.message);
    res
      .status(400)
      .json({ msg: "Error actualizando pista", error: err.message });
  }
};

export const deletePista = async (req, res) => {
  try {
    const pista = await Pista.findById(req.params.id);
    if (!pista) return res.status(404).json({ msg: "Pista no encontrada" });

    if (
      req.user.role !== "admin" &&
      pista.club.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ msg: "No tienes permiso para eliminar esta pista" });
    }

    await Pista.findByIdAndDelete(req.params.id);
    res.json({ msg: "Pista eliminada correctamente" });
  } catch (err) {
    console.error("[ERROR] Deleting pista:", err.message);
    res
      .status(500)
      .json({ msg: "Error al eliminar pista", error: err.message });
  }
};

export const addRating = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("[ERROR] Adding rating:", err.message);
    res.status(500).json({
      msg: "Error al agregar rating",
      error: err.message,
    });
  }
};

export const getRatings = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("[ERROR] Getting ratings:", err.message);
    res.status(500).json({ msg: "Error al obtener ratings" });
  }
};

export const updatePistaImage = async (req, res) => {
  try {
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
  } catch (err) {
    console.error("[ERROR] Updating image:", err.message);
    res.status(500).json({ msg: "Error al actualizar imagen" });
  }
};
