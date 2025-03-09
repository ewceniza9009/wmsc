import mongoose, { Schema, Document } from 'mongoose';

export interface IRoute extends Document {
  path: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RouteSchema: Schema = new Schema(
  {
    path: {
      type: String,
      required: [true, 'Please provide a route path'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a route name'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
  },
  { timestamps: true }
);

// Use mongoose.models to check if the model exists already to prevent overwriting
const Route = mongoose.models.Route || mongoose.model<IRoute>('Route', RouteSchema);

export default Route;