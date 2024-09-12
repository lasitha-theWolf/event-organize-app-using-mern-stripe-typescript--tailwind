import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cache connection
const globalWithMongoose = global as typeof globalThis & { mongoose: MongooseCache };

globalWithMongoose.mongoose = globalWithMongoose.mongoose || { conn: null, promise: null };
const cached = globalWithMongoose.mongoose;

export const connectToDatabase = async () => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!MONGODB_URL) {
        throw new Error('MONGODB_URI is not provided');
    }

    // Connect to our database
    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
        dbName: 'evently',
        bufferCommands: false,
    });

    // Store connection
    cached.conn = await cached.promise;

    return cached.conn;
};
