import { api } from './api';
import { Medication, DoseSchedule } from './medications';

export interface DoseLog {
  id: number | string; // 'pending_<scheduleId>' quando ainda não registrado
  dose_schedule_id: number;
  medication_id: number;
  profile_id: number;
  scheduled_at: string;
  taken_at: string | null;
  status: 'taken' | 'skipped' | 'missed' | 'pending';
  notes: string | null;
  medication: Medication;
  dose_schedule: DoseSchedule;
}

export async function getTodayDoses(profileId: number): Promise<DoseLog[]> {
  const { data } = await api.get(`/profiles/${profileId}/doses/today`);
  return data;
}

export interface HistoryFilters {
  status?: 'taken' | 'skipped' | 'missed';
  medication_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
}

export async function getDoseHistory(profileId: number, filters: HistoryFilters = {}) {
  const { data } = await api.get(`/profiles/${profileId}/doses/history`, {
    params: { page: 1, ...filters },
  });
  return data;
}

export async function logDose(payload: {
  dose_schedule_id: number;
  medication_id: number;
  profile_id: number;
  scheduled_at: string;
  taken_at?: string;
  status: 'taken' | 'skipped' | 'missed';
  notes?: string;
}): Promise<DoseLog> {
  const { data } = await api.post('/dose-logs', payload);
  return data;
}
