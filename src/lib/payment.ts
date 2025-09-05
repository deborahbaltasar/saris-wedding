// src/lib/payments.ts
export function validatePaymentForm(
  data: { name: string; email: string; phone?: string; taxId?: string },
  _method: 'pix' | 'debit' | 'credit'
) {
  const errors: Record<string, string> = {}
  if (!data.name?.trim()) errors.name = 'Full name is required.'
  if (!data.email?.trim()) errors.email = 'Email is required.'
  if (!data.phone?.trim()) errors.phone = 'Phone is required.'
  if (!data.taxId?.trim()) errors.taxId = 'CPF is required.'
  return { isValid: Object.keys(errors).length === 0, errors }
}

function toCents(v: number) {
  return Math.round(Number(v) * 100)
}

type OrderItem = { id: string; name: string; price: number; quantity: number; store?: string }

export async function createPixPayment(
  totalPrice: number,
  customer: { name: string; email: string; phone: string; taxId: string },
  items?: OrderItem[]
) {
  const expiresIn = 3500

  const body = {
    amount: toCents(totalPrice),
    description: items?.length ? `Compra de ${items.length} item(ns)` : 'Compra',
    expiresIn,
    customer: {
      name: customer.name,
      email: customer.email,
      cellphone: customer.phone.replace(/\D+/g, ''),
      taxId: customer.taxId.replace(/\D+/g, ''),
    },
    metadata: items ? { items: items.map(i => ({ id: i.id, q: i.quantity, p: i.price })) } : undefined
  }

  const res = await fetch('/api/payments/pix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())

  // alguns backends respondem { data: {...} }
  const payload = await res.json()
  const d = payload?.data ?? payload

  // mapeia para o formato da sua PixPaymentModal
  return {
    payment_id: d.id,
    pix_code: d.brCode ?? '',
    qr_code: d.brCodeBase64 ?? '',     // data:image/png;base64,...
    qr_code_text: d.brCode ?? '',
    expires_at: d.expiresAt ?? new Date(Date.now() + expiresIn * 1000).toISOString(),
    _raw: d
  }
}

// usado pelo polling
export async function fetchPixStatus(id: string) {
  const r = await fetch(`/api/payments/status?id=${encodeURIComponent(id)}`)
  if (!r.ok) throw new Error(await r.text())
  return r.json() as Promise<{ id: string; status: string }>
}