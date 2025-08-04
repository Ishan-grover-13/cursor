// Authentication interface
export interface IAuth {
  userId?: string;
  sessionId?: string;
  token?: string;
  isAuthenticated?: boolean;
  permissions?: string[];
  // Add other auth fields as needed
}

// SMS webhook payload interface
export interface ISMSPayload {
  api_key: string;
  message_type: string;
  from_number: string;
  to_number: string;
  firstName: string;
  lastName: string;
  message: string;
}

// Extended request interface with authentication
export interface IRequest {
  query: ISMSPayload;
  auth: IAuth;
  // Add other request properties as needed
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

// Alternative: If you want to extend Express Request
import { Request } from 'express';

export interface IAuthenticatedRequest extends Request {
  auth: IAuth;
}