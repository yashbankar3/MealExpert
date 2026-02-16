import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

type MongooseGlobal = typeof globalThis & {
  mongooseConn?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

const g = globalThis as MongooseGlobal;

if (!g.mongooseConn) {
  g.mongooseConn = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (g.mongooseConn?.conn) return g.mongooseConn.conn;

  if (!g.mongooseConn?.promise) {
    g.mongooseConn!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10
    });
  }

  g.mongooseConn!.conn = await g.mongooseConn!.promise;
  return g.mongooseConn!.conn;
}
