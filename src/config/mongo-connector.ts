import mongoose from "mongoose";
import config from "./config";

const dbNameMap: Record<string, string> = {
  development: 'test',
  production: 'prod',
};

const dbName = dbNameMap[config.nodeEnv];

mongoose.connection.once('open', () => {
    console.log('MongoDB connection established!');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected.');
});

export async function mongoConnect() {
    if (mongoose.connection.readyState === 1) {
        // If connection already exists, reuse it.
        console.log("MongoDB connection already exists, reusing it.");
        return;
    }

    await mongoose.connect(process.env.MONGO_URI!, {
        dbName: dbName,
        maxPoolSize: 5
    });
    console.log(`Connected to MongoDB with database name: ${dbName}`);
}

export async function mongoDisconnect() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
}

// Handling app termination and closing connection gracefully
process.on('SIGINT', async () => {
    await mongoDisconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await mongoDisconnect();
    process.exit(0);
});
