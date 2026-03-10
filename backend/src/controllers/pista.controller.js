import Pista from "../models/Pista.js";
import Reserva from "../models/Reserva.js";
import { validationResult } from "express-validator";

export const getPistas = async (req, res) => {
  try {
    const pistas = await Pista.find().populate("club", "name email").lean();
    res.json(pistas);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener pistas" });
  }
};

export const getPistaById = async (req, res) => {
  try {
    const pista = await Pista.findById(req.params.id)
      .populate("club", "name")
      .lean();
    if (!pista) return res.status(404).json({ msg: "Pista no encontrada" });
    res.json(pista);
  } catch (err) {
    res.status(500).json({ msg: "Error al buscar pista" });
  }
};

export const getPistasByClub = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const pistas = await Pista.find({ club: clubId })
      .populate("club", "name email")
      .lean();
    res.json(pistas);
  } catch (err) {
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
      59
    );

    const reservasMes = await Reserva.find({
      pista: { $in: pistasIds },
      fecha: { $gte: inicioMes, $lte: finMes },
      estado: { $ne: "cancelada" },
    }).select("total");

    const ingresosMes = reservasMes.reduce((sum, r) => sum + (r.total || 0), 0);
    
    // Calcular valoración promedio (por ahora 4.8 como default, puede mejorarse con rating real)
    // TODO: Implementar sistema de ratings en modelo Pista
    const valoracion = 4.8;

    res.json({
      pistasActivas,
      reservasHoy,
      ingresosMes: ingresosMes.toFixed(2),
      valoracion: valoracion.toFixed(1),
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
    const populated = await Pista.findById(saved._id).populate("club", "name email");
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

    // Verificar que el usuario es el dueño de la pista (club)
    if (pista.club.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "No tienes permiso para actualizar esta pista" });
    }

    const updated = await Pista.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("club", "name email");

    res.json(updated);
  } catch (err) {
    console.error("[ERROR] Updating pista:", err.message);
    res.status(400).json({ msg: "Error actualizando pista", error: err.message });
  }
};

export const deletePista = async (req, res) => {
  try {
    const pista = await Pista.findById(req.params.id);
    if (!pista) return res.status(404).json({ msg: "Pista no encontrada" });

    // Verificar que el usuario es el dueño de la pista (club)
    if (pista.club.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "No tienes permiso para eliminar esta pista" });
    }

    await Pista.findByIdAndDelete(req.params.id);
    res.json({ msg: "Pista eliminada correctamente" });
  } catch (err) {
    console.error("[ERROR] Deleting pista:", err.message);
    res.status(500).json({ msg: "Error al eliminar pista", error: err.message });
  }
};
