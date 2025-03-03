import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUserRight extends Document {
  userId: ObjectId;
  routeId: ObjectId;
  canAdd: boolean;
  canEdit: boolean;
  canSave: boolean;
  canDelete: boolean;
  canPrint: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserRightSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'Please provide a route ID'],
    },
    canAdd: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
    canSave: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
    canPrint: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only have one permission set per route
UserRightSchema.index({ userId: 1, routeId: 1 }, { unique: true });

// Use mongoose.models to check if the model exists already to prevent overwriting
const UserRight = mongoose.models.UserRight || mongoose.model<IUserRight>('UserRight', UserRightSchema);

export default UserRight;