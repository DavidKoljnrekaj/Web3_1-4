import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const dbURI = process.env.MONGO_URI || "mongodb+srv://admin:admin@web3-cluster.kre8q.mongodb.net/?retryWrites=true&w=majority&appName=Web3-Cluster";

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions); // Type assertion for `ConnectOptions`

    console.log('MongoDB connected');
  } catch (err: any) {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
