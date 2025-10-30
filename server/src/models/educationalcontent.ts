import { Schema, model, Document } from 'mongoose';

export interface IEducationalContent extends Document {
  title: string;
  body: string;
  category: string;
  author: Schema.Types.ObjectId;
}

const EducationalContentSchema = new Schema<IEducationalContent>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default model<IEducationalContent>('EducationalContent', EducationalContentSchema);