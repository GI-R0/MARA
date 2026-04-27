import mongoose from "mongoose";
import { addHours } from "date-fns";

const reservaSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"],
    },
    pista: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pista",
      required: [true, "La pista es obligatoria"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },
    hora: {
      type: String,
      required: [true, "La hora es obligatoria"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida (HH:MM)"],
    },
    duracion: {
      type: Number,
      default: 1,
      min: [1, "Duración mínima: 1 hora"],
      max: [3, "Duración máxima: 3 horas"],
    },
    total: {
      type: Number,
      required: [true, "El total es obligatorio"],
    },
    estado: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada"],
      default: "pendiente",
    },
  },
  { timestamps: true },
);

// Virtuales para startTime y endTime
reservaSchema.virtual("startTime").get(function () {
  const fechaStr = this.fecha.toISOString().split("T")[0]; // YYYY-MM-DD
  const dateTimeStr = `${fechaStr}T${this.hora}:00`;
  return new Date(dateTimeStr);
});

reservaSchema.virtual("endTime").get(function () {
  return addHours(this.startTime, this.duracion);
});

// Asegurar que los virtuales se incluyan en JSON
reservaSchema.set("toJSON", { virtuals: true });
reservaSchema.set("toObject", { virtuals: true });

reservaSchema.index(
  { pista: 1, fecha: 1, hora: 1 },
  { unique: false, partialFilterExpression: { estado: { $ne: "cancelada" } } },
);

reservaSchema.index({ usuario: 1, fecha: -1 });

reservaSchema.index({ pista: 1, fecha: 1 });

export default mongoose.model("Reserva", reservaSchema);
