import { createContext, useContext, useState, ReactNode } from 'react';
import { giftItems as List } from '../data/giftItems';

interface GiftItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  store: string;
  url: string;
  purchased: boolean;
}

interface CartContextType {
  selectedItems: {[key: string]: number};
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  totalItems: number;
  totalPrice: number;
  giftItems: GiftItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const giftItems: GiftItem[] = List;

export function CartProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({});

  const totalItems = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(selectedItems).reduce((sum, [id, qty]) => {
    const item = giftItems.find(item => item.id === id);
    return sum + (item?.price || 0) * qty;
  }, 0);

  const addToCart = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (newItems[itemId] > 1) {
        newItems[itemId] -= 1;
      } else {
        delete newItems[itemId];
      }
      return newItems;
    });
  };

  const clearCart = () => {
    setSelectedItems({});
  };

  const getItemQuantity = (itemId: string) => selectedItems[itemId] || 0;

  return (
    <CartContext.Provider value={{
      selectedItems,
      addToCart,
      removeFromCart,
      clearCart,
      getItemQuantity,
      totalItems,
      totalPrice,
      giftItems
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}