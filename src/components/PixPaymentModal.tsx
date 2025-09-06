// src/components/PixPaymentModal.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Clock, Smartphone, AlertCircle, Wifi, WifiOff, Download, Share2, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { fetchPixStatus, cancelPixPayment } from '../lib/payment';

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
  totalAmount: number;
}

type PaymentStatus = 'loading' | 'pending' | 'paid' | 'expired' | 'failed' | 'cancelled' | 'error';

// Status reais do AbacatePay: PENDING, PAID, FAILED
// Status locais adicionais: expired (tempo esgotado), cancelled (cancelado pelo usuário), error (erro de conexão)

interface ErrorState {
  type: 'network' | 'server' | 'expired' | 'cancelled' | 'unknown';
  message: string;
  canRetry: boolean;
}

export function PixPaymentModal({ 
  isOpen, 
  onClose, 
  paymentData, 
  onPaymentConfirmed, 
  totalAmount 
}: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [error, setError] = useState<ErrorState | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);
  const [qrCodeError, setQrCodeError] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Inicializa áudio de notificação
  useEffect(() => {
    // Cria um som simples usando Web Audio API
    const createNotificationSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    audioRef.current = { play: createNotificationSound } as any;
  }, []);

  // Persiste estado no localStorage para sobreviver a reloads
  useEffect(() => {
    if (isOpen && paymentData?.payment_id) {
      localStorage.setItem('pixPaymentModal', JSON.stringify({
        isOpen: true,
        paymentData,
        totalAmount,
        timestamp: Date.now()
      }));
    } else if (!isOpen) {
      localStorage.removeItem('pixPaymentModal');
    }
  }, [isOpen, paymentData, totalAmount]);

  // A recuperação de estado é feita no componente pai (CartPage)

  // Timer da contagem regressiva
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
        setTimeLeft('Expirado');
        setStatus('expired');
        setError({
          type: 'expired',
          message: 'O tempo para pagamento expirou. Inicie uma nova transação.',
          canRetry: false
        });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [paymentData?.expires_at]);

  // Polling inteligente de status
  useEffect(() => {
    if (!isOpen || !paymentData?.payment_id || status === 'paid' || status === 'cancelled' || status === 'expired') {
      return;
    }

    let active = true;
    let pollInterval = 4000; // Começa com 4s
    const maxInterval = 15000; // Máximo 15s
    const maxRetries = 10;

    const checkStatus = async () => {
      if (!active) return;

      try {
        // Cancela request anterior se ainda estiver pendente
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        
        setIsConnected(true);
        setError(null);
        
        const result = await fetchPixStatus(paymentData.payment_id);
        
        if (!active) return;

        // Mapeia status do AbacatePay para status locais
        const abacateStatus = result.status.toUpperCase();
        let localStatus: PaymentStatus;
        
        switch (abacateStatus) {
          case 'PAID':
            localStatus = 'paid';
            break;
          case 'FAILED':
            localStatus = 'failed';
            break;
          case 'PENDING':
          default:
            localStatus = 'pending';
            break;
        }

        setStatus(localStatus);
        setRetryCount(0); // Reset retry count on success

        if (localStatus === 'paid') {
          // Toca som de notificação
          if (soundEnabled && audioRef.current) {
            try {
              audioRef.current.play();
            } catch (e) {
              console.log('Could not play notification sound:', e);
            }
          }
          
          // Remove do localStorage
          localStorage.removeItem('pixPaymentModal');
          onPaymentConfirmed();
          return;
        }

        if (localStatus === 'failed') {
          setError({
            type: 'server',
            message: 'Falha no processamento do pagamento. Tente novamente.',
            canRetry: true
          });
          return;
        }

        // Para PENDING, continua o polling normalmente

        // Aumenta gradualmente o intervalo se não houver mudança de status
        pollInterval = Math.min(pollInterval + 1000, maxInterval);

      } catch (error: any) {
        if (!active) return;
        
        setRetryCount(prev => prev + 1);
        
        if (error.name === 'AbortError') return;
        
        setIsConnected(false);
        
        if (retryCount >= maxRetries) {
          setStatus('error');
          setError({
            type: 'network',
            message: 'Falha na conexão com o servidor. Verifique sua internet e tente novamente.',
            canRetry: true
          });
          return;
        }

        // Retry com backoff exponencial
        pollInterval = Math.min(pollInterval * 1.5, maxInterval);
      }

      // Agenda próxima verificação
      pollingIntervalRef.current = setTimeout(checkStatus, pollInterval);
    };

    // Primeira verificação imediata
    setStatus('pending');
    checkStatus();

    return () => {
      active = false;
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isOpen, paymentData?.payment_id, retryCount, soundEnabled]);

  // Detecta mudanças na conectividade
  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const copyPixCode = async () => {
    if (!paymentData?.pix_code) return;
    try {
      await navigator.clipboard.writeText(paymentData.pix_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy PIX code:', err);
      // Fallback para dispositivos que não suportam clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = paymentData.pix_code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareQRCode = async () => {
    if (!paymentData?.pix_code) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Código PIX para Pagamento',
          text: `Código PIX: ${paymentData.pix_code}`,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copia para clipboard
      copyPixCode();
    }
  };

  const handleCancel = async () => {
    if (!paymentData?.payment_id || isCancelling) return;

    setIsCancelling(true);
    try {
      const result = await cancelPixPayment(paymentData.payment_id);
      
      if (result.cancelled) {
        setStatus('cancelled');
        localStorage.removeItem('pixPaymentModal');
        
        // Mostra mensagem de confirmação antes de fechar
        setError({
          type: 'server',
          message: result.message || 'Transação cancelada com sucesso.',
          canRetry: false
        });
        
        // Fecha o modal após 2 segundos
        setTimeout(() => {
          onClose();
        }, 2000);
      } else if (result.status === 'expired') {
        setStatus('expired');
        setError({
          type: 'expired',
          message: 'A transação já expirou automaticamente.',
          canRetry: false
        });
        // Fecha o modal após 3 segundos
        setTimeout(() => {
          localStorage.removeItem('pixPaymentModal');
          onClose();
        }, 3000);
      } else {
        setError({
          type: 'server',
          message: result.message || result.error || 'Não foi possível cancelar a transação.',
          canRetry: result.cancellable !== false
        });
      }
    } catch (error: any) {
      console.error('Failed to cancel payment:', error);
      
      const errorMessage = error.message || 'Falha ao cancelar o pagamento.';
      
      // Se a transação não pode ser cancelada (já paga, etc.)
      if (errorMessage.includes('cannot be cancelled') || 
          errorMessage.includes('Cannot cancel paid') ||
          errorMessage.includes('already processed')) {
        setError({
          type: 'server',
          message: 'Esta transação não pode mais ser cancelada. Verifique se o pagamento já foi processado.',
          canRetry: false
        });
      } else {
        setError({
          type: 'server',
          message: `${errorMessage} Tente novamente.`,
          canRetry: true
        });
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const retryConnection = () => {
    setError(null);
    setRetryCount(0);
    setStatus('loading');
  };

  const getStatusColor = () => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'expired': case 'failed': case 'error': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-sage-medium';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading': return 'Carregando...';
      case 'pending': return 'Aguardando pagamento';
      case 'paid': return 'Pago ✓';
      case 'expired': return 'Expirado';
      case 'failed': return 'Falhou';
      case 'cancelled': return 'Cancelado';
      case 'error': return 'Erro de conexão';
      default: return 'Processando...';
    }
  };

  if (!isOpen || !paymentData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      // Remove onClick={onClose} para impedir fechamento manual
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header Fixo */}
        <div className="flex-shrink-0 p-6 border-b border-sage-light/30">
          <div className="text-center">
            <h3 className="font-romantic text-2xl text-sage-dark mb-2">Pagamento PIX</h3>
            <div className="text-3xl font-bold text-sage-dark mb-2">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}
            </div>
            
            {/* Timer */}
            <div className="flex items-center justify-center p-3 bg-sage-light/10 rounded-xl">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-sage-medium mr-2" />
                <span className="text-sage-dark font-medium">
                  {timeLeft === 'Expirado' ? 'Expirado' : `Tempo: ${timeLeft}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Mensagem de Erro */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 mb-2">{error.message}</p>
                    {error.canRetry && (
                      <Button
                        onClick={retryConnection}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Tentar Novamente
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-xl inline-block mb-4 relative">
              {!qrCodeError && paymentData.qr_code ? (
                <img
                  src={paymentData.qr_code}
                  alt="PIX QR Code"
                  className="w-48 h-48 mx-auto"
                  onError={() => setQrCodeError(true)}
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">QR Code indisponível</p>
                    <p className="text-xs text-gray-500">Use o código PIX abaixo</p>
                  </div>
                </div>
              )}
              
              {/* Botões de ação do QR Code */}
              {!qrCodeError && paymentData.qr_code && (
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={shareQRCode}
                    className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                    title="Compartilhar"
                  >
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-sm text-foreground/70">
              {qrCodeError 
                ? 'Use o código PIX abaixo para efetuar o pagamento'
                : 'Escaneie este QR code com seu app bancário'
              }
            </p>
          </div>

          {/* Código PIX */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-sage-dark mb-2">
              {qrCodeError ? 'Código PIX:' : 'Ou copie o código PIX:'}
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
            {copied && (
              <p className="text-xs text-green-600 mt-1">Código copiado!</p>
            )}
          </div>

          {/* Instruções */}
          <div className="bg-sage-light/10 rounded-xl p-4 mb-4">
            <div className="flex items-start space-x-3">
              <Smartphone className="h-5 w-5 text-sage-medium mt-0.5 shrink-0" />
              <div className="text-sm text-foreground/80">
                <p className="font-medium text-sage-dark mb-2">Como pagar com PIX:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Abra seu app bancário</li>
                  <li>Vá para a seção PIX</li>
                  <li>Escaneie o QR code ou cole o código PIX</li>
                  <li>Confirme o pagamento</li>
                  <li>O pagamento será processado instantaneamente</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Fixo */}
        <div className="flex-shrink-0 border-t border-sage-light/30 p-6 bg-background">
          <div className="flex space-x-3">
            <Button
              onClick={handleCancel}
              disabled={isCancelling || status === 'paid'}
              variant="outline"
              className="flex-1 border-sage-light text-sage-medium hover:bg-sage-light/10 disabled:opacity-50"
            >
              {isCancelling ? 'Cancelando...' : 'Cancelar Transação'}
            </Button>
            
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
