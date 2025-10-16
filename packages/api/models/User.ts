import mongoose, { Document } from "mongoose";

export interface IKycDocument {
  documentNumber: string;
  fileUrl: string;
  status: string;
}

export interface IUserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  kycStatus?: string;
  kycDocuments?: IKycDocument[];
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  permissions: string[];
  profile: IUserProfile;
  status: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    permissions: { type: [String], default: [] },
    profile: {
      firstName: String,
      lastName: String,
      phone: String,
      kycDocuments: [
        {
          documentNumber: String,
          fileUrl: String,
          status: String,
        },
      ],
    },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
