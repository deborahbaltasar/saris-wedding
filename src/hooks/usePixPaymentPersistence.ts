// src/hooks/usePixPaymentPersistence.ts
import { useState, useEffect } from 'react';

interface PixPaymentData {
  payment_id: string;
  pix_code: string;
  qr_code: string;
  qr_code_text: string;
  expires_at: string;
}

interface PersistedPixPayment {
  isOpen: boolean;
  paymentData: PixPaymentData;
  totalAmount: number;
  timestamp: number;
}

export function usePixPaymentPersistence() {
  const [pixPaymentData, setPixPaymentData] = useState<PixPaymentData | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);

  // Verifica localStorage ao carregar a aplicação
  useEffect(() => {
    const checkPersistedPayment = () => {
      // Tenta múltiplas chaves para recuperar os dados
      let savedPixPayment = localStorage.getItem('pixPaymentModal');
      
      // Se não encontrou na chave principal, tenta o backup
      if (!savedPixPayment) {
        savedPixPayment = localStorage.getItem('pixPaymentModal_backup');
      }
      
      // Verifica se há indicação de pagamento ativo
      const isActive = localStorage.getItem('pix_payment_active');
      
      if (savedPixPayment) {
        try {
          const parsed: PersistedPixPayment = JSON.parse(savedPixPayment);
          
          // Simplifica a verificação - apenas verifica se tem payment_id válido
          if (parsed.paymentData?.payment_id) {
            // Restaura na chave principal se veio do backup
            if (!localStorage.getItem('pixPaymentModal')) {
              localStorage.setItem('pixPaymentModal', savedPixPayment);
            }
            
            setPixPaymentData(parsed.paymentData);
            setTotalAmount(parsed.totalAmount);
            setIsPixModalOpen(true);
            return;
          }
          
          // Remove se não tem dados válidos
          localStorage.removeItem('pixPaymentModal');
          localStorage.removeItem('pixPaymentModal_backup');
          localStorage.removeItem('pix_payment_active');
        } catch (e) {
          localStorage.removeItem('pixPaymentModal');
          localStorage.removeItem('pixPaymentModal_backup');
          localStorage.removeItem('pix_payment_active');
        }
      } else {
        // Se há flag ativa mas não há dados, algo deu errado
        if (isActive) {
          localStorage.removeItem('pix_payment_active');
        }
      }
    };

    // Verifica imediatamente
    checkPersistedPayment();

    // Verifica periodicamente (a cada 3 segundos) caso outro tab tenha criado um pagamento
    const interval = setInterval(checkPersistedPayment, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const closePixModal = () => {
    setIsPixModalOpen(false);
    setPixPaymentData(null);
    setTotalAmount(0);
    
    // Remove todas as chaves relacionadas
    localStorage.removeItem('pixPaymentModal');
    localStorage.removeItem('pixPaymentModal_backup');
    localStorage.removeItem('pix_payment_active');
  };

  const openPixModal = (paymentData: PixPaymentData, amount: number) => {
    const persistedData: PersistedPixPayment = {
      isOpen: true,
      paymentData,
      totalAmount: amount,
      timestamp: Date.now()
    };
    
    try {
      // Salva com múltiplas chaves para garantir persistência
      const dataString = JSON.stringify(persistedData);
      localStorage.setItem('pixPaymentModal', dataString);
      localStorage.setItem('pixPaymentModal_backup', dataString);
      localStorage.setItem('pix_payment_active', 'true');
      
      // Força o navegador a sincronizar
      localStorage.setItem('pix_last_save', Date.now().toString());
      
    } catch (error) {
      console.error(error);
      
    }
    
    setPixPaymentData(paymentData);
    setTotalAmount(amount);
    setIsPixModalOpen(true);
  };

  return {
    pixPaymentData,
    totalAmount,
    isPixModalOpen,
    closePixModal,
    openPixModal
  };
}
