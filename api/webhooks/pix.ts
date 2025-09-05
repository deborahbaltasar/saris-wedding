// api/webhooks/pix.ts

import type { VercelRequest, VercelResponse } from '@vercel/node'

function requireEnv(key: string): string {
  const v = process.env[key]
  if (!v) throw new Error(`Missing env var: ${key}`)
  return v
}

const ABACATE_BASE = process.env.ABACATEPAY_BASE_URL || 'https://api.abacatepay.com'

type Customer = {
  name: string
  email: string
  cellphone: string
  taxId: string
}

type AbacateEvent = {
  type: string
  data: {
    id: string
    status: 'paid' | 'pending' | 'expired' | 'failed'
    amount?: number
    customer?: Partial<Customer>
    metadata?: Record<string, any>
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const event = req.body as AbacateEvent
    if (!event?.data?.id) {
      return res.status(400).json({ error: 'invalid event payload (missing data.id)' })
    }

    // ✅ Verificação do pagamento na API oficial
    const verifyRes = await fetch(`${ABACATE_BASE}/pix/check?id=${event.data.id}`, {
      headers: {
        'Authorization': `Bearer ${requireEnv('ABACATE_PAY_API_KEY')}`,
        'Content-Type': 'application/json',
      },
    })

    if (!verifyRes.ok) {
      const txt = await verifyRes.text()
      console.error('Erro ao verificar pagamento:', txt)
      return res.status(400).json({ error: 'could not verify payment' })
    }

    const verified = await verifyRes.json() as {
      id: string
      status: 'paid' | 'pending' | 'expired' | 'failed'
      amount: number
      customer?: Partial<Customer>
      metadata?: Record<string, any>
    }

    console.log('Webhook recebido:', event)
    console.log('Pagamento verificado:', verified)

    // 👉 aqui você pode liberar acesso, enviar e-mail, etc.
    return res.status(200).json({
      ok: true,
      provider_ref: verified.id,
      status: verified.status,
      amount: verified.amount,
      customer: verified.customer ?? null
    })
  } catch (e: any) {
    console.error('AbacatePay webhook error:', e?.message || e)
    return res.status(500).json({ error: e?.message || 'webhook error' })
  }
}
