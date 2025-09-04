export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentIntentId, paymentMethod } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment ID required' });
    }

    if (paymentMethod !== 'abacte_pix') {
      return res.status(400).json({ error: 'Only PIX payments are supported' });
    }

    // Check AbactePay payment status
    const abactePayConfig = {
      apiUrl: process.env.ABACTE_PAY_API_URL || 'https://api.abactepay.com/v1',
      apiKey: process.env.ABACTE_PAY_API_KEY,
    };

    if (!abactePayConfig.apiKey) {
      return res.status(500).json({ error: 'Payment provider configuration missing' });
    }

    const response = await fetch(`${abactePayConfig.apiUrl}/payments/${paymentIntentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${abactePayConfig.apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`AbactePay API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const abactePayment = await response.json();
    
    const paymentData = {
      id: abactePayment.id,
      status: abactePayment.status,
      amount: abactePayment.amount,
      currency: abactePayment.currency || 'BRL',
      pix_paid_at: abactePayment.paid_at,
      created_at: abactePayment.created_at,
    };

    // Here you could save the payment confirmation to a database
    // or send confirmation emails

    res.status(200).json({
      success: true,
      payment: paymentData,
    });

  } catch (error) {
    console.error('Error confirming PIX payment:', error);
    res.status(500).json({ 
      error: 'Failed to confirm payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}