import { Request, Response } from 'express';
import { IRequest, IAuth, ISMSPayload } from './types';

// Example middleware to add auth to request
export const authenticateRequest = (req: Request, res: Response, next: Function) => {
  // Extract auth information (example implementation)
  const authHeader = req.headers.authorization;
  const apiKey = req.query.api_key as string;
  
  const auth: IAuth = {
    userId: undefined, // Will be populated after validation
    sessionId: undefined,
    token: authHeader?.replace('Bearer ', ''),
    isAuthenticated: false,
    permissions: []
  };

  // Add auth validation logic here
  if (apiKey && isValidApiKey(apiKey)) {
    auth.isAuthenticated = true;
    auth.userId = getUserIdFromApiKey(apiKey);
    auth.permissions = getPermissionsForUser(auth.userId);
  }

  // Attach auth to request
  (req as any).auth = auth;
  next();
};

// Your webhook handler with typed request
export const handleSMSWebhook = (req: IRequest, res: Response) => {
  const { query, auth } = req;
  
  // Validate authentication
  if (!auth.isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Access your webhook data with full type safety
  const smsData: ISMSPayload = {
    api_key: query.api_key,
    message_type: query.message_type,
    from_number: query.from_number,
    to_number: query.to_number,
    firstName: query.firstName,
    lastName: query.lastName,
    message: query.message
  };

  // Process the SMS webhook
  console.log('Processing SMS from:', smsData.from_number);
  console.log('Message:', smsData.message);
  console.log('Authenticated user:', auth.userId);

  // Save to database with auth context
  saveSMSData(smsData, auth);

  res.json({ success: true, message: 'SMS webhook processed' });
};

// Helper functions (implement these based on your auth system)
function isValidApiKey(apiKey: string): boolean {
  // Implement your API key validation logic
  return apiKey === 'a0a71dd0-190b-43e6-9629-d33ac50041e3';
}

function getUserIdFromApiKey(apiKey: string): string | undefined {
  // Implement user lookup by API key
  return 'user-123';
}

function getPermissionsForUser(userId: string | undefined): string[] {
  // Implement permission lookup
  return ['sms:read', 'sms:write'];
}

function saveSMSData(smsData: ISMSPayload, auth: IAuth): void {
  // Implement your database save logic with auth context
  console.log('Saving SMS data for user:', auth.userId);
}