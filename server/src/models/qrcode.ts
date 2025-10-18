import { Schema, model, Document } from 'mongoose';

export interface IQRCode extends Document {
  code: string;
  generatedBy: Schema.Types.ObjectId; // conductor
  scannedBy?: Schema.Types.ObjectId; // usuario
  points: number;
  isScanned: boolean;
  scannedAt?: Date;
}

const QRCodeSchema = new Schema<IQRCode>({
  code: { type: String, required: true, unique: true },
  generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scannedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  points: { type: Number, required: true, default: 0 },
  isScanned: { type: Boolean, default: false },
  scannedAt: { type: Date }
}, { timestamps: true });

export default model<IQRCode>('QRCode', QRCodeSchema);