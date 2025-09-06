// src/components/PaymentSuccessModal.tsx
import { motion } from 'motion/react';
import { Check, Heart, X } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from './CartContext';

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
}

export function PaymentSuccessModal({ isOpen, onClose, totalAmount }: PaymentSuccessModalProps) {
    const { clearCart } = useCart();

    const closeModal = () => {
        clearCart();
        onClose()
    };

    if (!isOpen) return null;

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
                className="bg-background rounded-2xl p-8 max-w-md w-full text-center"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1" />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 text-sage-dark hover:bg-sage-light/20 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </motion.button>
                </div>

                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-16 h-16 bg-sage-dark rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Check className="h-8 w-8 text-background" />
                </motion.div>
                {/* Success Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="font-romantic text-3xl text-sage-dark mb-4">
                        Pagamento Confirmado!
                    </h3>

                    <div className="text-2xl font-bold text-green-600 mb-4">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)}
                    </div>

                    <p className="text-foreground/80 mb-6 leading-relaxed">
                        Seu pagamento PIX foi processado com sucesso!
                        <br />
                        Obrigado por contribuir para nosso sonho.
                    </p>

                    <div className="flex items-center justify-center text-sage-medium mb-6">
                        <Heart className="h-5 w-5 mr-2 fill-current" />
                        <span className="text-sm">Com amor, Sarah & Rommel</span>
                    </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Button
                        onClick={closeModal}
                        className="w-full bg-sage-dark hover:bg-sage-medium text-white py-3"
                    >
                        Continuar
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
