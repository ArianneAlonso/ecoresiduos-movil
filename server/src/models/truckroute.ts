import { Schema, model, Document } from 'mongoose';

export interface ITruckRoute extends Document {
  zone: string;
  schedule: Date;
  driver: Schema.Types.ObjectId;
  status: 'pending' | 'in_progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
}

const TruckRouteSchema = new Schema<ITruckRoute>({
  zone: { type: String, required: true },
  schedule: { type: Date, required: true },
  driver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

export default model<ITruckRoute>('TruckRoute', TruckRouteSchema);