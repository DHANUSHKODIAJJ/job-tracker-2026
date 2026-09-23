import {Schema ,model ,Document, Types} from "mongoose";

export interface IJobCheck extends Document {

    user : Types.ObjectId;
    companyName?:string;
    hrEmail?:string;
    jobText:string;
    salaryText?:string;
    verdict:'looks_ok'|'caution'|'danger'
    category: 'legit' | 'consultancy' | 'institute' | 'scam';
    score:number;
    flags:{code:string;severity:string;message:string}[]
}

const flagSchema = new Schema(
    {
        code:{type:String,required:true},
        severity:{type:String,enum:["low","medium","high"],required:true},
        message:{type :String,required:true},
    },{_id:false},
);

const jobCheckSchema = new Schema<IJobCheck>(
      {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyName: { type: String, trim: true, maxlength: 120 },
    hrEmail: { type: String, trim: true, lowercase: true, maxlength: 120 },
    jobText: { type: String, required: true, maxlength: 10000 },
    salaryText: { type: String, trim: true, maxlength: 80 },
    verdict: { type: String, enum: ['looks_ok', 'caution', 'danger'], required: true },
    category: { type: String, enum: ['legit', 'consultancy', 'institute', 'scam'], required: true },
    score: { type: Number, required: true },
    flags: { type: [flagSchema], default: [] },
  },
    { timestamps: { createdAt: true, updatedAt: false } },

);


jobCheckSchema.index({user:1,createdAt:-1});

export const JobCheck = model<IJobCheck>('JobCheck', jobCheckSchema);