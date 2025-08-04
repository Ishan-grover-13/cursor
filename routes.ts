import express from 'express';
import { SMSService } from './sms-service';
import { authenticateRequest } from './webhook-handler';
import { IRequest } from './types';

const router = express.Router();
const smsService = new SMSService();

// SMS sending route with authentication
router.get('/api/zapier/v1/trigger/sms/send', 
  authenticateRequest,  // Middleware adds IAuth to request
  async (req, res) => {
    // Now req has both query and auth properties as IRequest
    await smsService.sendSms(req as IRequest, res);
  }
);

// SMS history route  
router.get('/api/sms/history',
  authenticateRequest,
  async (req, res) => {
    await smsService.getSMSHistory(req as IRequest, res);
  }
);

// Alternative: If you prefer direct function instead of class
export const sendSmsHandler = async (req: IRequest, res: express.Response) => {
  const smsService = new SMSService();
  await smsService.sendSms(req, res);
};

export default router;