export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}


export interface AuthCredentials {
  email: string;
  password?: string;
}