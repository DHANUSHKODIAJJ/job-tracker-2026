import { api } from './client';
import type { JobApplication, ApplicationStatus } from '../lib/types';

interface ListResponse {
  items: JobApplication[];
  total: number;
  page: number;
  pages: number;
}

export function listApplications(params?: {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  const suffix = query.size ? `?${query.toString()}` : '';
  return api<ListResponse>(`/applications${suffix}`);
}

export function getApplication(id: string) {
  return api<{ application: JobApplication }>(`/applications/${id}`);
}

export function createApplication(input: Partial<JobApplication>) {
  return api<{ application: JobApplication }>('/applications', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateApplication(id: string, input: Partial<JobApplication>) {
  return api<{ application: JobApplication }>(`/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteApplication(id: string) {
  return api<void>(`/applications/${id}`, { method: 'DELETE' });
}
