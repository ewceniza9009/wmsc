import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { AppError } from '@/types/error';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'worker';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'worker'],
      default: 'worker',
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (this: IUser, next) {
    if (!this.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      // Now TypeScript knows that this.password is a string.
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error as AppError);
    }
  });

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Use mongoose.models to check if the model exists already to prevent overwriting
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;