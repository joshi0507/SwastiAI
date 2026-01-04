
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
  password?: string; // Added password for staff/admin logins
  role: UserRole;
  avatar?: string;
  specialization?: string;
  licenseNumber?: string;
}

export interface AmbulanceStatus {
  village: string;
  arrivalTime: string;
  status: 'ON_ROUTE' | 'STATIONED' | 'MAINTENANCE';
  location: string;
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
  // Added 'URINE_TEST' to satisfy dashboard requirements for lab report uploads
  type: 'LAB_REPORT' | 'PRESCRIPTION' | 'SCAN' | 'BLOOD_TEST' | 'BP_TEST' | 'URINE_TEST';
  url: string;
  uploadedBy: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
