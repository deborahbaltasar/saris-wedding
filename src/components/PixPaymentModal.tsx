// src/components/PixPaymentModal.tsx
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check, Clock, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { fetchPixStatus } from '../lib/payment'; // 👈 novo

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: {
    payment_id: string;
    pix_code: string;
    qr_code: string;
    qr_code_text: string;
    expires_at: string;
  } | null;
  onPaymentConfirmed: () => void;
}

export function PixPaymentModal({ isOpen, onClose, paymentData, onPaymentConfirmed }: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [status, setStatus] = useState<string>('pending'); // 👈 novo

  // timer da contagem regressiva (já existia)
  useEffect(() => {
    if (!paymentData?.expires_at) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(paymentData.expires_at).getTime();
      const difference = expiryTime - now;

      if (difference > 0) {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('Expired');
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [paymentData?.expires_at]);

  // 🔁 polling de status a cada 4s
  useEffect(() => {
    if (!isOpen || !paymentData?.payment_id) return;
    let active = true;

    const tick = async () => {
      try {
        const s = await fetchPixStatus(paymentData.payment_id);
        if (!active) return;
        if (s?.status) setStatus(s.status);

        if (s?.status === 'paid') {
          onPaymentConfirmed();
        } else if (s?.status === 'expired' || s?.status === 'failed') {
          // para de checar se expirou/falhou
          clearInterval(interval);
        }
      } catch (e) {
        // silencioso; tenta no próximo ciclo
      }
    };

    const interval = setInterval(tick, 4000);
    // primeira checada imediata
    tick();

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isOpen, paymentData?.payment_id]);

  const copyPixCode = async () => {
    if (!paymentData?.pix_code) return;
    try {
      await navigator.clipboard.writeText(paymentData.pix_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy PIX code:', err);
    }
  };

  if (!isOpen || !paymentData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-romantic text-2xl text-sage-dark">PIX Payment</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 text-sage-dark hover:bg-sage-light/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Timer + status */}
        <div className="flex items-center justify-between mb-6 p-3 bg-sage-light/10 rounded-xl">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-sage-medium mr-2" />
            <span className="text-sage-dark font-medium">Time remaining: {timeLeft}</span>
          </div>
          <span className="text-xs px-2 py-1 rounded bg-sage-light/30 text-sage-dark">
            {status || 'pending'}
          </span>
        </div>

        {/* QR Code */}
        <div className="text-center mb-6">
          <div className="bg-white p-4 rounded-xl inline-block mb-4">
            {paymentData.qr_code ? (
              <img
                src={paymentData.qr_code}
                alt="PIX QR Code"
                className="w-48 h-48 mx-auto"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <p className="text-sm text-foreground/70">Loading QR…</p>
            )}
          </div>
          <p className="text-sm text-foreground/70">
            Scan this QR code with your banking app to pay
          </p>
        </div>

        {/* PIX Code */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-sage-dark mb-2">
            Or copy the PIX code:
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-input-background border border-sage-light rounded-lg text-sm font-mono break-all">
              {paymentData.pix_code}
            </div>
            <Button
              onClick={copyPixCode}
              variant="outline"
              size="sm"
              className="shrink-0 border-sage-light text-sage-dark hover:bg-sage-light/10"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-sage-light/10 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Smartphone className="h-5 w-5 text-sage-medium mt-0.5 shrink-0" />
            <div className="text-sm text-foreground/80">
              <p className="font-medium text-sage-dark mb-2">How to pay with PIX:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open your banking app</li>
                <li>Go to PIX section</li>
                <li>Scan the QR code or paste the PIX code</li>
                <li>Confirm the payment</li>
                <li>Your payment will be processed instantly</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-sage-light text-sage-medium hover:bg-sage-light/10"
          >
            Cancel
          </Button>
          <Button
            onClick={onPaymentConfirmed}
            className="flex-1 bg-sage-dark hover:bg-sage-medium"
          >
            I've Made the Payment
          </Button>
        </div>

        <p className="text-xs text-center text-foreground/60 mt-4">
          Payment ID: {paymentData.payment_id}
        </p>
      </motion.div>
    </motion.div>
  );
}
