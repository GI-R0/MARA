import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [8, "Mínimo 8 caracteres"],
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "club", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (typeof this.password === "string" && this.password.startsWith("$2")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  if (!candidate || !this.password) return false;

  if (typeof this.password === "string" && this.password.startsWith("$2")) {
    const normalizedHash = this.password.startsWith("$2y$")
      ? this.password.replace("$2y$", "$2b$")
      : this.password;
    return await bcrypt.compare(candidate, normalizedHash);
  }

  if (this.password === candidate) {
    try {
      const hashedPassword = await bcrypt.hash(candidate, 10);
      await this.constructor.updateOne({ _id: this._id }, { password: hashedPassword });
    } catch (error) {
      console.warn("No se pudo migrar la contraseña antigua:", error.message);
    }
    return true;
  }

  return false;
};

export default mongoose.model("User", userSchema);
