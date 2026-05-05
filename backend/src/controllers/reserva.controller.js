import Reserva from "../models/Reserva.js";
import Pista from "../models/Pista.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { addHours } from "date-fns";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const createReserva = asyncHandler(async (req, res) => {
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

    const fechaStr = fechaDate.toISOString().split("T")[0];
    const startTime = new Date(`${fechaStr}T${hora}:00`);
    const endTime = addHours(startTime, duracion);

    if (!pista.horariosDisponibles?.includes(hora)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ msg: "Hora no disponible para esta pista" });
    }

    const conflicto = await Reserva.findOne({
      pista: pistaId,
      estado: { $ne: "cancelada" },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $gte: startTime, $lt: endTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
      ],
    }).session(session);

    if (conflicto) {
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
      { session },
    );

    await session.commitTransaction();

    const populated = await Reserva.findById(reserva[0]._id)
      .populate("pista", "nombre ubicacion precioHora")
      .populate("usuario", "name email");

    res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

export const getReservas = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reservas, total] = await Promise.all([
    Reserva.find()
      .populate({ path: "pista", select: "nombre ubicacion precioHora" })
      .populate({ path: "usuario", select: "name email" })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Reserva.countDocuments(),
  ]);

  res.json({
    reservas,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getReservaById = asyncHandler(async (req, res) => {
  const reserva = await Reserva.findById(req.params.id)
    .populate({ path: "pista", select: "nombre ubicacion precioHora" })
    .populate({ path: "usuario", select: "name email" });
  if (!reserva) return res.status(404).json({ msg: "Reserva no encontrada" });

  const isOwner = reserva.usuario._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin)
    return res.status(403).json({ msg: "Acceso denegado" });

  res.json(reserva);
});

export const getMisReservas = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reservas, total] = await Promise.all([
    Reserva.find({ usuario: req.user._id })
      .populate({ path: "pista", select: "nombre ubicacion precioHora" })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Reserva.countDocuments({ usuario: req.user._id }),
  ]);

  res.json({
    reservas,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const updateReserva = asyncHandler(async (req, res) => {
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
});

export const deleteReserva = asyncHandler(async (req, res) => {
  const reserva = await Reserva.findById(req.params.id);
  if (!reserva) {
    return res.status(404).json({ msg: "Reserva no encontrada" });
  }

  const isOwner = reserva.usuario.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ msg: "Acceso denegado" });
  }

  await Reserva.findByIdAndDelete(req.params.id);

  res.json({ msg: "Reserva eliminada correctamente" });
});
