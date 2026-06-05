import Reserva from "../models/Reserva.js";
import Pista from "../models/Pista.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { parse, addHours } from "date-fns";
import { sendMail } from "../config/mailer.js";

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

    // Calcular startTime y endTime de la nueva reserva
    const fechaStr = fechaDate.toISOString().split("T")[0];
    const startTime = new Date(`${fechaStr}T${hora}:00`);
    const endTime = addHours(startTime, duracion);

    // Verificar que todos los intervalos de la reserva estén disponibles
    const requestedHours = Array.from({ length: duracion }, (_, index) => {
      const hour = startTime.getHours() + index;
      return `${String(hour).padStart(2, "0")}:00`;
    });

    const unavailableHours = requestedHours.filter(
      (h) => !pista.horariosDisponibles?.includes(h),
    );

    if (unavailableHours.length) {
      await session.abortTransaction();
      return res.status(400).json({
        msg: "La reserva no se puede crear porque algunos horarios no están disponibles",
        horariosNoDisponibles: unavailableHours,
      });
    }

    // Verificar conflictos: si hay alguna reserva que se solape
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

    try {
      await sendMail({
        to: populated.usuario.email,
        subject: "Reserva confirmada en SportifyClub",
        html: `<p>Hola ${populated.usuario.name},</p>
          <p>Tu reserva ha sido registrada correctamente.</p>
          <ul>
            <li><strong>Pista:</strong> ${populated.pista.nombre}</li>
            <li><strong>Fecha:</strong> ${fechaStr}</li>
            <li><strong>Hora:</strong> ${hora}</li>
            <li><strong>Duración:</strong> ${duracion} hora(s)</li>
            <li><strong>Total:</strong> ${populated.total}€</li>
          </ul>
          <p>Gracias por reservar con SportifyClub.</p>`,
        text: `Hola ${populated.usuario.name},\n\nTu reserva ha sido registrada correctamente.\nPista: ${populated.pista.nombre}\nFecha: ${fechaStr}\nHora: ${hora}\nDuración: ${duracion} hora(s)\nTotal: ${populated.total}€\n\nGracias por reservar con SportifyClub.`,
      });
    } catch (emailError) {
      console.error(
        "[WARN] No se pudo enviar correo de reserva:",
        emailError.message,
      );
    }

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reservas, total] = await Promise.all([
      Reserva.find()
        .populate({ path: "pista", select: "nombre ubicacion precioHora imagen deporte" })
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
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener reservas" });
  }
};

export const getReservaById = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id)
      .populate({ path: "pista", select: "nombre ubicacion precioHora imagen deporte" })
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reservas, total] = await Promise.all([
      Reserva.find({ usuario: req.user._id })
        .populate({ path: "pista", select: "nombre ubicacion precioHora imagen deporte" })
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
      { path: "pista", select: "nombre ubicacion precioHora imagen deporte" },
      { path: "usuario", select: "name email" },
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: "Error actualizando reserva" });
  }
};

export const deleteReserva = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ msg: "Error al eliminar reserva" });
  }
};
