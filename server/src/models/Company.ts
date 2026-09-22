import { Schema, model, Document, Types } from 'mongoose';

export interface ICompany extends Document {
  user: Types.ObjectId;
  name: string;
  website?: string;
  careersUrl?: string;
  location?: string;
  notes?: string;
}

const companySchema = new Schema<ICompany>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    website: { type: String, trim: true },
    careersUrl: { type: String, trim: true },
    location: { type: String, trim: true },
    notes: { type: String, maxlength: 2000 },
  },
  { timestamps: true },
);

companySchema.index({ user: 1, name: 1 }, { unique: true });

export const Company = model<ICompany>('Company', companySchema);
