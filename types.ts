
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  COMPOUNDER = 'COMPOUNDER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  specialization?: string;
  licenseNumber?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  type: 'VIDEO' | 'IN_PERSON';
}

export interface HealthRecord {
  id: string;
  patientId: string;
  title: string;
  date: string;
  type: 'LAB_REPORT' | 'PRESCRIPTION' | 'SCAN';
  url: string;
  uploadedBy: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
