import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('Error: MONGO_URI no está definido en el archivo .env');
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB conectado exitosamente. ');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;