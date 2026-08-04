import mongoose from "mongoose";

export const isMongoConnected = () => mongoose.connection.readyState === 1;
