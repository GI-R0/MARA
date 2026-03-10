import Reserva from "../models/Reserva.js";
import Pista from "../models/Pista.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

export const createReserva = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { pista: pistaId, fecha, hora, duracion = 1 } = req.body;
    const usuarioId = req.user._id;

    const fechaDate = new Date(fecha);
    if (isNaN(fechaDate)) {
      await session.abortTransaction();
      return res.status(400).json({ msg: "Fecha inválida" });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaDate < hoy) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ msg: "No se pueden hacer reservas en fechas pasadas" });
    }

    const pista = await Pista.findById(pistaId).session(session);
    if (!pista) {
      await session.abortTransaction();
      return res.status(404).json({ msg: "Pista no encontrada" });
    }

    if (!pista.horariosDisponibles?.includes(hora)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ msg: "Hora no disponible para esta pista" });
    }

    const existe = await Reserva.findOne({
      pista: pistaId,
      fecha: fechaDate,
      hora,
      estado: { $ne: "cancelada" },
    }).session(session);

    if (existe) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ msg: "Ya existe una reserva en este horario" });
    }

    const total = pista.precioHora * duracion;

    const reserva = await Reserva.create(
      [
        {
          usuario: usuarioId,
          pista: pistaId,
          fecha: fechaDate,
          hora,
          duracion,
          total,
        },
      ],
      { session }
    );

    await Pista.findByIdAndUpdate(
      pistaId,
      {
        $pull: { horariosDisponibles: hora },
      },
      { session }
    );

    await session.commitTransaction();

    const populated = await Reserva.findById(reserva[0]._id)
      .populate("pista", "nombre ubicacion precioHora")
      .populate("usuario", "name email");

    res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    console.error("[ERROR] Creating reserva:", err.message);
    res.status(500).json({ msg: "Error creando reserva", error: err.message });
  } finally {
    session.endSession();
  }
};

export const getReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find()
      .populate({ path: "pista", select: "nombre ubicacion precioHora" })
      .populate({ path: "usuario", select: "name email" })
      .lean();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener reservas" });
  }
};

export const getReservaById = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id)
      .populate({ path: "pista", select: "nombre ubicacion precioHora" })
      .populate({ path: "usuario", select: "name email" });
    if (!reserva) return res.status(404).json({ msg: "Reserva no encontrada" });

    const isOwner = reserva.usuario._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ msg: "Acceso denegado" });

    res.json(reserva);
  } catch (err) {
    res.status(500).json({ msg: "Error buscando reserva" });
  }
};

export const getMisReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find({ usuario: req.user._id })
      .populate({ path: "pista", select: "nombre ubicacion precioHora" })
      .lean();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener tus reservas" });
  }
};

export const updateReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id).populate("pista");
    if (!reserva) return res.status(404).json({ msg: "Reserva no encontrada" });

    const isOwner = reserva.usuario.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ msg: "Acceso denegado" });

    const { estado, duracion } = req.body;
    if (estado) reserva.estado = estado;

    if (duracion) {
      reserva.duracion = Number(duracion);
      reserva.total = reserva.pista.precioHora * reserva.duracion;
    }

    await reserva.save();
    const populated = await reserva.populate([
      { path: "pista", select: "nombre ubicacion precioHora" },
      { path: "usuario", select: "name email" },
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: "Error actualizando reserva" });
  }
};

export const deleteReserva = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reserva = await Reserva.findById(req.params.id).session(session);
    if (!reserva) {
      await session.abortTransaction();
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    const isOwner = reserva.usuario.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      await session.abortTransaction();
      return res.status(403).json({ msg: "Acceso denegado" });
    }

    const pistaId = reserva.pista;
    const hora = reserva.hora;

    await Reserva.findByIdAndDelete(req.params.id).session(session);

    await Pista.findByIdAndUpdate(
      pistaId,
      {
        $addToSet: { horariosDisponibles: hora },
      },
      { session }
    );

    await session.commitTransaction();

    res.json({ msg: "Reserva eliminada correctamente" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ msg: "Error al eliminar reserva" });
  } finally {
    session.endSession();
  }
};
