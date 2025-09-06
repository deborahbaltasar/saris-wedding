import type { VercelRequest, VercelResponse } from '@vercel/node'
import AbacatePay from 'abacatepay-nodejs-sdk'

function requireEnv(key: string): string {
  const v = process.env[key]
  if (!v) throw new Error(`Missing env var: ${key}`)
  return v
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { id } = req.body as { id: string }
  if (!id) return res.status(400).json({ error: 'missing payment id' })

  try {
    const client = AbacatePay(requireEnv('ABACATE_PAY_API_KEY'))

    // Verifica o status atual para validar se pode ser "cancelado" localmente
    const currentStatus = await (client as any).pixQrCode.check({ id })
    console.log('[cancel] current status:', currentStatus)

    const statusData = currentStatus?.data || currentStatus
    const status = statusData?.status?.toUpperCase()

    // Se já foi pago, não pode ser cancelado
    if (status === 'PAID') {
      return res.status(400).json({ 
        error: 'Cannot cancel paid transaction',
        status: 'PAID',
        cancelled: false,
        cancellable: false
      })
    }

    // Se falhou, considera como já "cancelado"
    if (status === 'FAILED') {
      return res.status(200).json({
        id,
        status: 'FAILED',
        cancelled: true,
        message: 'Transaction already failed'
      })
    }

    // Para PENDING, permite cancelamento local
    if (status === 'PENDING') {
      return res.status(200).json({
        id,
        status: 'CANCELLED',
        cancelled: true,
        message: 'Transaction cancelled locally (was pending)'
      })
    }

    // Status desconhecido
    return res.status(400).json({
      id,
      status: status || 'UNKNOWN',
      cancelled: false,
      error: 'Unknown transaction status',
      cancellable: false
    })

  } catch (e: any) {
    console.error('[cancel] error:', e?.message || e)
    
    return res.status(500).json({ 
      ok: false, 
      error: e?.message || 'Failed to check payment status',
      cancellable: true // Permite retry para erros de rede
    })
  }
}
