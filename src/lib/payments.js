// Payment utility functions

/**
 * Create a PIX payment with AbactePay
 */
export async function createPixPayment(amount, customerInfo, orderItems = []) {
  try {
    const response = await fetch('/api/payments/abacte-pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        customerInfo,
        orderItems,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create PIX payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating PIX payment:', error);
    throw error;
  }
}

/**
 * Confirm PIX payment status
 */
export async function confirmPixPayment(paymentId) {
  try {
    const response = await fetch('/api/payments/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId: paymentId,
        paymentMethod: 'abacte_pix',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to confirm payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error confirming PIX payment:', error);
    throw error;
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Validate payment form data
 */
export function validatePaymentForm(formData, paymentMethod) {
  const errors = {};

  // Only validate for PIX payments (card payments redirect externally)
  if (paymentMethod === 'pix') {
    if (!formData.name?.trim()) {
      errors.name = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone is optional for PIX but if provided should be valid
    if (formData.phone?.trim() && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}