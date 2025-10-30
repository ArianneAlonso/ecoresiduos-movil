import { Schema, model, Document } from 'mongoose';

export interface IContainer extends Document {
  title: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitud, latitud]
  };
  acceptedMaterials: string[];
  createdBy: Schema.Types.ObjectId;
}

const ContainerSchema = new Schema<IContainer>({
  title: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  acceptedMaterials: [{ type: String }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

ContainerSchema.index({ location: '2dsphere' });

export default model<IContainer>('Container', ContainerSchema);