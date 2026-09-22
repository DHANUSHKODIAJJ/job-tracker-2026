import { Schema, model, Document, Types } from 'mongoose';

export const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'assessment',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface IStatusChange {
  status: ApplicationStatus;
  changedAt: Date;
  note?: string;
}

export interface IApplication extends Document {
  user: Types.ObjectId;
  company: Types.ObjectId;
  role: string;
  jobUrl?: string;
  source?: string;
  status: ApplicationStatus;
  statusHistory: IStatusChange[];
  appliedAt?: Date;
  followUpAt?: Date;
  salary?: string;
  location?: string;
  notes?: string;
}

const statusChangeSchema = new Schema<IStatusChange>(
  {
    status: { type: String, enum: APPLICATION_STATUSES, required: true },
    changedAt: { type: Date, default: Date.now },
    note: { type: String, maxlength: 500 },
  },
  { _id: false },
);

const applicationSchema = new Schema<IApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    jobUrl: { type: String, trim: true },
    source: { type: String, trim: true }, // e.g. Naukri, LinkedIn, referral
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'saved',
      index: true,
    },
    statusHistory: { type: [statusChangeSchema], default: [] },
    appliedAt: { type: Date },
    followUpAt: { type: Date, index: true },
    salary: { type: String, trim: true },
    location: { type: String, trim: true },
    notes: { type: String, maxlength: 5000 },
  },
  { timestamps: true },
);

applicationSchema.index({ user: 1, status: 1, updatedAt: -1 });

export const Application = model<IApplication>('Application', applicationSchema);
