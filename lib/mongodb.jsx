import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = globalThis.mongoose || { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME,
        bufferCommands: false,
      })
      .then((mongoose) => {
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  globalThis.mongoose = cached;

  return cached.conn;
}
