import { Schema, model, Document } from 'mongoose';

export interface IResidueReport extends Document {
  user: Schema.Types.ObjectId;
  residueType: string;
  size: string;
  zone: string;
  status: 'reported' | 'collected';
}

const ResidueReportSchema = new Schema<IResidueReport>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  residueType: { type: String, required: true },
  size: { type: String, required: true },
  zone: { type: String, required: true },
  status: { type: String, enum: ['reported', 'collected'], default: 'reported' }
}, { timestamps: true });

export default model<IResidueReport>('ResidueReport', ResidueReportSchema);