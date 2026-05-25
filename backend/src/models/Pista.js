import mongoose from "mongoose";

const pistaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    deporte: {
      type: String,
      enum: ["Pádel", "Tenis", "Fútbol", "Fútbol 5", "Baloncesto", "Voleibol"],
      default: "Pádel",
    },
    precioHora: {
      type: Number,
      required: [true, "El precio por hora es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
      default: 10,
    },
    ubicacion: {
      type: String,
      trim: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La pista debe pertenecer a un club"],
      index: true,
    },
    horariosDisponibles: {
      type: [String],
      required: [true, "Debe haber al menos un horario"],
      validate: {
        validator: (arr) =>
          arr.every((h) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(h)),
        message: "Formato de hora inválido (HH:MM)",
      },
      default: [],
    },
    imagen: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
    },
    iluminacion: {
      type: Boolean,
      default: false,
    },
    superficie: {
      type: String,
      enum: [
        "Césped",
        "Arcilla",
        "Cemento",
        "Hierba artificial",
        "Madera",
        "Moqueta",
        "Tierra batida",
      ],
    },

    ratings: [
      {
        usuario: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        puntuacion: {
          type: Number,
          min: [1, "Puntuación mínima: 1"],
          max: [5, "Puntuación máxima: 5"],
          required: true,
        },
        comentario: {
          type: String,
          maxlength: [500, "El comentario no puede exceder 500 caracteres"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    ratingPromedio: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true },
);

pistaSchema.methods.calcularRatingPromedio = function () {
  if (this.ratings.length === 0) {
    this.ratingPromedio = 0;
  } else {
    const suma = this.ratings.reduce((acc, r) => acc + r.puntuacion, 0);
    this.ratingPromedio = Number((suma / this.ratings.length).toFixed(1));
  }
  return this.ratingPromedio;
};

export default mongoose.model("Pista", pistaSchema);
