import { Response } from 'express';
import { IRequest, IAuth, ISMSPayload } from './types';

export class SMSService {
  
  /**
   * Send SMS with authentication and full request context
   * @param req - Request object containing query data and auth information
   * @param res - Express response object
   */
  public async sendSms(req: IRequest, res: Response): Promise<void> {
    try {
      // Extract auth and query data from request
      const { auth, query } = req;
      
      // Validate authentication
      if (!auth.isAuthenticated) {
        res.status(401).json({ 
          success: false, 
          error: 'Unauthorized: Invalid authentication' 
        });
        return;
      }

      // Check SMS permissions
      if (!auth.permissions?.includes('sms:send')) {
        res.status(403).json({ 
          success: false, 
          error: 'Forbidden: Insufficient permissions for SMS sending' 
        });
        return;
      }

      // Extract SMS data with full type safety
      const smsData: ISMSPayload = {
        api_key: query.api_key,
        message_type: query.message_type,
        from_number: query.from_number,
        to_number: query.to_number,
        firstName: query.firstName,
        lastName: query.lastName,
        message: query.message
      };

      // Validate required SMS fields
      if (!smsData.to_number || !smsData.message) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: to_number and message are required'
        });
        return;
      }

      // Log SMS attempt with auth context
      console.log(`SMS Send Request:`, {
        userId: auth.userId,
        from: smsData.from_number,
        to: smsData.to_number,
        messageLength: smsData.message.length,
        timestamp: new Date().toISOString()
      });

      // Process SMS sending
      const smsResult = await this.processSMSSending(smsData, auth);
      
      // Save to database with auth context
      await this.saveSMSRecord(smsData, auth, smsResult);

      // Return success response
      res.status(200).json({
        success: true,
        data: {
          messageId: smsResult.messageId,
          status: smsResult.status,
          sentAt: smsResult.sentAt,
          userId: auth.userId
        },
        message: 'SMS sent successfully'
      });

    } catch (error) {
      console.error('SMS sending failed:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while sending SMS'
      });
    }
  }

  /**
   * Process the actual SMS sending logic
   * @param smsData - SMS payload data
   * @param auth - Authentication context
   */
  private async processSMSSending(smsData: ISMSPayload, auth: IAuth) {
    // Implement your SMS provider logic here (Twilio, AWS SNS, etc.)
    // This is a mock implementation
    
    const messageId = `sms_${Date.now()}_${auth.userId}`;
    
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      messageId,
      status: 'sent',
      sentAt: new Date().toISOString(),
      provider: 'your-sms-provider'
    };
  }

  /**
   * Save SMS record to database with auth context
   * @param smsData - SMS payload data  
   * @param auth - Authentication context
   * @param smsResult - Result from SMS sending
   */
  private async saveSMSRecord(smsData: ISMSPayload, auth: IAuth, smsResult: any) {
    // Implement your database save logic
    const record = {
      messageId: smsResult.messageId,
      userId: auth.userId,
      fromNumber: smsData.from_number,
      toNumber: smsData.to_number,
      message: smsData.message,
      firstName: smsData.firstName,
      lastName: smsData.lastName,
      status: smsResult.status,
      sentAt: smsResult.sentAt,
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving SMS record:', record);
    // Your database save logic here
    // await this.databaseService.saveSMS(record);
  }

  /**
   * Get SMS history for authenticated user
   * @param req - Request with auth context
   * @param res - Express response
   */
  public async getSMSHistory(req: IRequest, res: Response): Promise<void> {
    const { auth } = req;
    
    if (!auth.isAuthenticated) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Implement SMS history retrieval
    // const history = await this.databaseService.getSMSHistory(auth.userId);
    
    res.json({
      success: true,
      data: [], // Your SMS history data
      userId: auth.userId
    });
  }
}