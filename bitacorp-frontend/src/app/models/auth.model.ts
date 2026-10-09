export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoggedUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: LoggedUser;
}

export interface RegisterWhistleblowerPayload {
  gender: string;
  department: string;
  first_name: string;
  last_name: string;
  email: string;
  password_user: string;
  dpi: string;
  phone: string;
}