export interface UserResponse {
  id_users: number;
  email: string;
  roles_id: number;
  role_name?: string;
  roles?: string;
  phone_number?: string;
  phone?: string;
  dpi?: string;
  department_id?: number;
  department?: string;
  gender?: string;
  State?: string;
  agent_state?: string;
  first_name?: string;
  last_name?: string;
}

export interface WhistleblowerProfile {
  id_users: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dpi: string;
  gender: string;
  department: string;
}

export interface ManagerRegisterPayload {
  first_name?: string;
  last_name?: string;
  email: string;
  passwords: string;
  phone_number?: string;
  dpi?: string;
  department?: string;
  department_id?: number;
  State?: string;
}

export interface AdminRegisterPayload {
  first_name?: string;
  last_name?: string;
  email: string;
  passwords: string;
  dpi?: string;
  department?: string;
  department_id?: number;
  State?: string;
}
