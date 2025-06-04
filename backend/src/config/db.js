import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            autoIndex: true,
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, options);

        mongoose.connection.on('connected', () => {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};