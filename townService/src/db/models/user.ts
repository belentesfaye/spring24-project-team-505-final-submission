import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface for the user document
export interface IUser extends Document {
  username: string;
  password: string;
  // needed function to check if the password is correct
  isCorrectPassword(password: string): Promise<boolean>;
  playerstats: {
    items: number[];
    coins: number;
    winstreak: number;
  };
}

// User schema definition
const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playerstats: {
    items: { type: [Number], default: [] },
    coins: { type: Number, default: 0 },
    winstreak: { type: Number, default: 0 },
  },
});

// Password hashing middleware before saving a user
userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
  next();
});

// Method to check if the entered password is correct
userSchema.methods.isCorrectPassword = async function checkPassword(
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Creating the model from the schema
const user = mongoose.model<IUser>('User', userSchema);

export default user;
