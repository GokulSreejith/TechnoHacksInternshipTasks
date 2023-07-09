import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRoles, IUser, IAccountStatus } from '../../interfaces';
import { config } from '../../config';

const { USERS } = config.MONGO_COLLECTIONS;

interface IUserDocument extends IUser {
  matchPasswords: (password: string) => boolean;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 15,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
      maxlength: 10,
      unique: true,
    },
    role: {
      type: String,
      enum: UserRoles,
      default: UserRoles.USER,
    },
    status: {
      type: String,
      required: true,
      enum: IAccountStatus,
      default: IAccountStatus.ACTIVE,
    },
    lastSync: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPasswords = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = model(USERS, userSchema);

export default User;
