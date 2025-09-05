// api/payments/pix.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import AbacatePay, {
} from "abacatepay-nodejs-sdk"
import { CreateCustomerData, CreatePixQrCodeData } from "abacatepay-nodejs-sdk/dist/types"


// Helper para garantir env obrigatória (evita string | undefined)
function requireEnv(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required env var: ${key}`)
  return val
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const { amount, description, expiresIn = 3500, customer } = req.body as {
      amount: number
      description?: string
      expiresIn?: number
      customer: CreateCustomerData
    }

    if (!amount || !customer?.email) {
      return res.status(400).json({ error: 'amount e customer.email são obrigatórios' })
    }

    const client = AbacatePay(requireEnv('ABACATE_PAY_API_KEY'))

    const data: CreatePixQrCodeData = {
      amount,            // em centavos (ex.: 990 => R$ 9,90)
      description: 'teste',
      expiresIn,         // segundos
      customer           // { name, email, ... }
    }

    const result = await client.pixQrCode.create(data)
    // result deve conter: id, status, pixCopiaECola, qrCodeUrl, etc.
    return res.status(200).json(result)
  } catch (e: any) {
    console.error('PIX error:', e?.message || e)
    return res.status(400).json({ error: e?.message || 'PIX create error' })
  }
}

