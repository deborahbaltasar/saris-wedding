import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';

interface FloatingCartButtonProps {
  onOpenCart: () => void;
}

export function FloatingCartButton({ onOpenCart }: FloatingCartButtonProps) {
  const { totalItems } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenCart}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-sage-dark text-background rounded-full p-3 sm:p-4 shadow-lg hover:bg-sage-medium transition-all duration-300 group"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-primary text-primary-foreground text-xs sm:text-sm rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center"
          >
            {totalItems}
          </motion.span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-sage-dark text-background text-sm px-3 py-1 rounded-lg whitespace-nowrap">
              View Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </div>
            <div className="w-2 h-2 bg-sage-dark rotate-45 mx-auto -mt-1"></div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}