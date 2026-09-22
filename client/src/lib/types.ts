export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Company {
  _id: string;
  name: string;
  website?: string;
  careersUrl?: string;
  location?: string;
}

export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface JobApplication {
  _id: string;
  role: string;
  company: Company;
  jobUrl?: string;
  source?: string;
  status: ApplicationStatus;
  appliedAt?: string;
  followUpAt?: string;
  salary?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
