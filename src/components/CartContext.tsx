import { createContext, useContext, useState, ReactNode } from 'react';

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

export const giftItems: GiftItem[] = [
  // Under $100
  {
    id: '1',
    name: 'Herb Garden Starter Kit',
    price: 89,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    description: 'Everything we need to start our kitchen herb garden',
    store: 'Terrain',
    url: 'https://shopterrain.com',
    purchased: false
  },
  {
    id: '2',
    name: 'Luxury Silk Throw Pillows',
    price: 79,
    image: 'https://images.unsplash.com/photo-1619043518725-bc74b9d02c52?w=400&h=400&fit=crop',
    description: 'Elegant silk throw pillows to accent our living room',
    store: 'West Elm',
    url: 'https://westelm.com',
    purchased: false
  },
  {
    id: '3',
    name: 'Artisan Candle Collection',
    price: 65,
    image: 'https://images.unsplash.com/photo-1737091862932-35b489b8fe8d?w=400&h=400&fit=crop',
    description: 'Hand-poured soy candles with natural scents',
    store: 'Anthropologie',
    url: 'https://anthropologie.com',
    purchased: false
  },
  {
    id: '4',
    name: 'Wooden Serving Board Set',
    price: 95,
    image: 'https://images.unsplash.com/photo-1593872570467-f7491ce2a52e?w=400&h=400&fit=crop',
    description: 'Beautiful walnut serving boards for entertaining',
    store: 'Williams Sonoma',
    url: 'https://williamssonoma.com',
    purchased: false
  },
  {
    id: '5',
    name: 'Premium Essential Oil Diffuser',
    price: 85,
    image: 'https://images.unsplash.com/photo-1510048126839-229279473365?w=400&h=400&fit=crop',
    description: 'Ultrasonic aromatherapy diffuser for relaxation',
    store: 'Pottery Barn',
    url: 'https://potterybarn.com',
    purchased: false
  },
  {
    id: '6',
    name: 'Elegant Picture Frame Set',
    price: 55,
    image: 'https://images.unsplash.com/photo-1672679136563-7a7b5dae2e39?w=400&h=400&fit=crop',
    description: 'Gold-finished frames for our favorite memories',
    store: 'Target',
    url: 'https://target.com',
    purchased: false
  },

  // $100-$300
  {
    id: '7',
    name: 'Wine Decanter Set',
    price: 129,
    image: 'https://images.unsplash.com/photo-1569275830766-d9293134dabc?w=400&h=400&fit=crop',
    description: 'Elegant crystal decanter and glasses for special occasions',
    store: 'Crate & Barrel',
    url: 'https://crateandbarrel.com',
    purchased: false
  },
  {
    id: '8',
    name: 'Cast Iron Dutch Oven',
    price: 149,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    description: 'Perfect for Sunday dinners and slow-cooked meals',
    store: 'Le Creuset',
    url: 'https://lecreuset.com',
    purchased: false
  },
  {
    id: '9',
    name: 'Organic Cotton Bedding Set',
    price: 189,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop',
    description: 'Luxurious organic cotton sheets for our new bedroom',
    store: 'West Elm',
    url: 'https://westelm.com',
    purchased: true
  },
  {
    id: '10',
    name: 'Artisan Ceramic Dinnerware Set',
    price: 245,
    image: 'https://images.unsplash.com/photo-1727354484577-d3adaca753fd?w=400&h=400&fit=crop',
    description: 'Handcrafted stoneware plates and bowls for 8',
    store: 'Heath Ceramics',
    url: 'https://heathceramics.com',
    purchased: false
  },
  {
    id: '11',
    name: 'Kitchen Stand Mixer',
    price: 299,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e74c?w=400&h=400&fit=crop',
    description: 'Professional-grade stand mixer for all our baking adventures',
    store: 'Williams Sonoma',
    url: 'https://williamssonoma.com',
    purchased: false
  },
  {
    id: '12',
    name: 'Copper Cocktail Shaker Set',
    price: 165,
    image: 'https://images.unsplash.com/photo-1519933036284-ec91386e93f0?w=400&h=400&fit=crop',
    description: 'Professional bartending set for home cocktails',
    store: 'Williams Sonoma',
    url: 'https://williamssonoma.com',
    purchased: false
  },
  {
    id: '13',
    name: 'Luxury Bath Towel Set',
    price: 175,
    image: 'https://images.unsplash.com/photo-1625931046289-e51edea3e176?w=400&h=400&fit=crop',
    description: 'Ultra-soft Egyptian cotton towels in sage green',
    store: 'Brooklinen',
    url: 'https://brooklinen.com',
    purchased: false
  },
  {
    id: '14',
    name: 'Wicker Picnic Basket',
    price: 125,
    image: 'https://images.unsplash.com/photo-1632836985028-02dc0fa8b6f0?w=400&h=400&fit=crop',
    description: 'Vintage-style basket perfect for outdoor adventures',
    store: 'Terrain',
    url: 'https://shopterrain.com',
    purchased: false
  },

  // $300-$500
  {
    id: '15',
    name: 'Vanity Mirror with LED Lighting',
    price: 349,
    image: 'https://images.unsplash.com/photo-1621215065447-28744f6b9e87?w=400&h=400&fit=crop',
    description: 'Hollywood-style illuminated mirror for the bedroom',
    store: 'CB2',
    url: 'https://cb2.com',
    purchased: false
  },
  {
    id: '16',
    name: 'Silk Window Treatments',
    price: 425,
    image: 'https://images.unsplash.com/photo-1739272135664-0c6342ffd470?w=400&h=400&fit=crop',
    description: 'Custom silk curtains for the living room windows',
    store: 'Pottery Barn',
    url: 'https://potterybarn.com',
    purchased: false
  },
  {
    id: '17',
    name: 'Premium Espresso Machine',
    price: 399,
    image: 'https://images.unsplash.com/photo-1634709170162-23a76022e9c9?w=400&h=400&fit=crop',
    description: 'Professional espresso machine for daily coffee rituals',
    store: 'Sur La Table',
    url: 'https://surlatable.com',
    purchased: false
  },

  // $500+
  {
    id: '18',
    name: 'Artisan Coffee Table',
    price: 599,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: 'Handcrafted walnut coffee table for our living room',
    store: 'Room & Board',
    url: 'https://roomandboard.com',
    purchased: false
  },
  {
    id: '19',
    name: 'Designer Dining Chairs Set',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: 'Set of 6 mid-century modern dining chairs',
    store: 'Design Within Reach',
    url: 'https://dwr.com',
    purchased: false
  },
  {
    id: '20',
    name: 'Smart Home Security System',
    price: 799,
    image: 'https://images.unsplash.com/photo-1558618047-f0e4e5d7e77f?w=400&h=400&fit=crop',
    description: 'Complete home security system with smart monitoring',
    store: 'Best Buy',
    url: 'https://bestbuy.com',
    purchased: false
  }
];

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