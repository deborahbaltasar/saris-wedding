// api/payments/status.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import AbacatePay from 'abacatepay-nodejs-sdk'

function requireEnv(key: string): string {
  const v = process.env[key]
  if (!v) throw new Error(`Missing env var: ${key}`)
  return v
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const id = (req.query.id as string) || ''
  if (!id) return res.status(400).json({ error: 'missing id' })

  try {
    const client = AbacatePay(requireEnv('ABACATE_PAY_API_KEY'))

    // ✅ usa o método do tutorial
    const resp = await (client as any).pixQrCode.check({ id })

    // algumas libs retornam envelope { data: {...} }
    const d = (resp && (resp.data ?? resp)) || {}

    // normaliza campos úteis
    return res.status(200).json({
      id: d.id ?? id,
      status: (d.status || 'pending').toLowerCase(), // 'paid' | 'pending' | ...
      amount: d.amount,
      brCode: d.brCode ?? d.pixCopiaECola,
      brCodeBase64: d.brCodeBase64 ?? d.qrCodeBase64 ?? d.qrCodeUrl,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      expiresAt: d.expiresAt,
      _raw: resp
    })
  } catch (e: any) {
    console.error('[status] error:', e?.message || e)
    return res.status(500).json({ ok: false, error: e?.message || 'status check error' })
  }
}
