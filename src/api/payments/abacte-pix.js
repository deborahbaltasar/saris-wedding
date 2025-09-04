// AbactePay PIX Integration
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, customerInfo, orderItems } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return res.status(400).json({ error: 'Customer information required' });
    }

    // AbactePay API configuration
    const abactePayConfig = {
      apiUrl: process.env.ABACTE_PAY_API_URL || 'https://api.abactepay.com/v1',
      apiKey: process.env.ABACTE_PAY_API_KEY,
      merchantId: process.env.ABACTE_PAY_MERCHANT_ID,
    };

    if (!abactePayConfig.apiKey || !abactePayConfig.merchantId) {
      return res.status(500).json({ error: 'Payment provider configuration missing' });
    }

    // Create PIX payment request
    const pixPaymentData = {
      merchant_id: abactePayConfig.merchantId,
      amount: amount,
      currency: 'BRL',
      payment_method: 'pix',
      customer: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone || '',
      },
      order: {
        id: `wedding-gift-${Date.now()}`,
        description: 'Wedding Gift Registry Purchase',
        items: orderItems || [],
      },
      notification_url: `${process.env.VERCEL_URL || req.headers.host}/api/webhooks/abacte-pay`,
      return_url: `${process.env.VERCEL_URL || req.headers.host}/payment-success`,
    };

    // Make request to AbactePay API
    const response = await fetch(`${abactePayConfig.apiUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${abactePayConfig.apiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(pixPaymentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`AbactePay API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const paymentData = await response.json();

    // Return PIX payment information
    res.status(200).json({
      success: true,
      payment_id: paymentData.id,
      pix_code: paymentData.pix_code,
      qr_code: paymentData.qr_code_image,
      qr_code_text: paymentData.qr_code_text,
      expires_at: paymentData.expires_at,
      status: paymentData.status,
    });

  } catch (error) {
    console.error('AbactePay PIX error:', error);
    res.status(500).json({ 
      error: 'Failed to create PIX payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}