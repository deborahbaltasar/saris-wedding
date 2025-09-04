import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookSecret = process.env.ABACTE_PAY_WEBHOOK_SECRET;
    
    // Verify webhook signature (implementation depends on AbactePay's signature method)
    const signature = req.headers['x-abacte-signature'] || req.headers['signature'];
    
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.error('AbactePay webhook signature verification failed');
        return res.status(400).json({ error: 'Invalid signature' });
      }
    }

    const { event, data } = req.body;

    console.log('AbactePay webhook received:', event, data);

    // Handle different AbactePay events
    switch (event) {
      case 'payment.completed':
      case 'payment.approved':
        console.log('PIX payment completed:', data.payment_id);
        
        // Here you can:
        // - Update your database
        // - Mark gifts as purchased
        // - Send confirmation emails
        // - Update order status
        
        break;

      case 'payment.failed':
      case 'payment.cancelled':
        console.log('PIX payment failed/cancelled:', data.payment_id);
        
        // Handle failed/cancelled payment
        // - Update order status
        // - Send notification
        
        break;

      case 'payment.pending':
        console.log('PIX payment pending:', data.payment_id);
        
        // Handle pending payment
        // - Update status to pending
        // - Set timeout for expiration
        
        break;

      case 'payment.expired':
        console.log('PIX payment expired:', data.payment_id);
        
        // Handle expired payment
        // - Clean up pending orders
        // - Release reserved items
        
        break;

      default:
        console.log(`Unhandled AbactePay event: ${event}`);
    }

    // Always respond with success to acknowledge receipt
    res.status(200).json({ 
      success: true,
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    console.error('Error processing AbactePay webhook:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}