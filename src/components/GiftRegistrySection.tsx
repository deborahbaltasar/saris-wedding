import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Plus, Minus, X, ExternalLink, Gift, Filter, Check } from 'lucide-react';
import { Button } from './ui/button';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './ui/pagination';
import { useCart } from './CartContext';

type PriceRange = 'all' | 'under100' | '100-300' | '300-500' | 'over500';

export function GiftRegistrySection() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { 
    giftItems, 
    selectedItems, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    getItemQuantity, 
    totalItems, 
    totalPrice 
  } = useCart();

  const filterItemsByPrice = (items: typeof giftItems, range: PriceRange) => {
    switch (range) {
      case 'under100':
        return items.filter(item => item.price < 100);
      case '100-300':
        return items.filter(item => item.price >= 100 && item.price < 300);
      case '300-500':
        return items.filter(item => item.price >= 300 && item.price < 500);
      case 'over500':
        return items.filter(item => item.price >= 500);
      default:
        return items;
    }
  };

  const availableItems = giftItems.filter(item => !item.purchased);
  const filteredItems = filterItemsByPrice(availableItems, selectedPriceRange);
  
  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);
  
  // Reset to page 1 when filter changes
  const handlePriceRangeChange = (range: PriceRange) => {
    setSelectedPriceRange(range);
    setCurrentPage(1);
  };

  const priceRanges = [
    { id: 'all', label: 'All Gifts', count: availableItems.length },
    { id: 'under100', label: 'Under $100', count: filterItemsByPrice(availableItems, 'under100').length },
    { id: '100-300', label: '$100 - $300', count: filterItemsByPrice(availableItems, '100-300').length },
    { id: '300-500', label: '$300 - $500', count: filterItemsByPrice(availableItems, '300-500').length },
    { id: 'over500', label: '$500+', count: filterItemsByPrice(availableItems, 'over500').length }
  ];

  return (
    <section id="gifts" className="py-12 bg-gradient-to-b from-sage-light/10 to-cream/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-romantic text-4xl md:text-5xl text-sage-dark mb-6">
            Lista de presentes
          </h2>
          <div className="w-24 h-1 bg-sage-dark mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            Your presence is the greatest gift, but if you'd like to help us start our new life together, 
            we've curated a selection of items that would mean the world to us.
          </p>
          
          {/* Cart Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="inline-flex items-center px-6 py-3 bg-sage-dark text-background rounded-full hover:bg-sage-medium transition-colors relative"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>View Selected ({totalItems})</span>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </motion.button>
        </motion.div>

        {/* Price Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Filter className="h-5 w-5 text-sage-medium mr-2" />
            <span className="text-sage-dark font-medium">Filter by Price Range</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {priceRanges.map((range) => (
              <motion.button
                key={range.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePriceRangeChange(range.id as PriceRange)}
                className={`
                  relative px-4 py-3 rounded-xl border-2 transition-all duration-300 flex items-center space-x-2 min-w-[120px] justify-center
                  ${selectedPriceRange === range.id 
                    ? 'bg-sage-dark text-background border-sage-dark shadow-lg' 
                    : 'bg-background/80 text-sage-dark border-sage-light hover:border-sage-medium hover:bg-sage-light/10 hover:shadow-md'
                  }
                `}
              >
                {selectedPriceRange === range.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4"
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
                <div className="flex flex-col items-center">
                  <span className="font-medium text-sm">{range.label}</span>
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full mt-1
                    ${selectedPriceRange === range.id 
                      ? 'bg-background/20 text-background' 
                      : 'bg-sage-light/30 text-sage-medium'
                    }
                  `}>
                    {range.count} {range.count === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
          
          {/* Clear Filter Quick Action */}
          {selectedPriceRange !== 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePriceRangeChange('all')}
                className="text-sage-medium hover:text-sage-dark transition-colors text-sm underline underline-offset-4"
              >
                Clear filter and show all gifts
              </motion.button>
            </motion.div>
          )}
          
          {filteredItems.length === 0 && selectedPriceRange !== 'all' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-8 p-6 bg-sage-light/10 rounded-xl"
            >
              <Gift className="h-12 w-12 text-sage-light mx-auto mb-3" />
              <h3 className="font-medium text-sage-dark mb-2">No gifts in this price range</h3>
              <p className="text-foreground/70">Try selecting a different price range to see more options</p>
            </motion.div>
          )}
        </motion.div>

        {/* Results Summary */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p className="text-sage-medium">
              {selectedPriceRange !== 'all' ? (
                <>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} {filteredItems.length === 1 ? 'gift' : 'gifts'} in the{' '}
                  <span className="font-medium text-sage-dark">
                    {priceRanges.find(r => r.id === selectedPriceRange)?.label}
                  </span> range
                </>
              ) : (
                <>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} gifts
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* Gift Items Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <AnimatePresence mode="popLayout">
            {currentItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sage-light/30 group"
              >
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Heart className="h-5 w-5 text-sage-light/80" />
                </div>
              </div>
              
              <h3 className="font-medium text-sage-dark mb-2">{item.name}</h3>
              <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-sage-dark">R${item.price}</span>
                <span className="text-sm text-sage-medium">{item.store}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 text-sm text-sage-dark border border-sage-light rounded-lg hover:bg-sage-light/10 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </motion.a>
                
                {getItemQuantity(item.id) === 0 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(item.id)}
                    className="flex items-center px-4 py-2 bg-sage-dark text-background rounded-lg hover:bg-sage-medium transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </motion.button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 bg-sage-light rounded-full flex items-center justify-center text-sage-dark hover:bg-sage-medium hover:text-background transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </motion.button>
                    <span className="w-8 text-center font-medium text-sage-dark">
                      {getItemQuantity(item.id)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(item.id)}
                      className="w-8 h-8 bg-sage-dark rounded-full flex items-center justify-center text-background hover:bg-sage-medium transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-12"
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-sage-light/10'} transition-colors`}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className={`cursor-pointer transition-colors ${
                        currentPage === page 
                          ? 'bg-sage-dark text-background hover:bg-sage-medium' 
                          : 'hover:bg-sage-light/10 text-sage-dark'
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-sage-light/10'} transition-colors`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}

        {/* Shopping Cart Modal */}
        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsCartOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-romantic text-2xl text-sage-dark">Selected Gifts</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-sage-dark hover:bg-sage-light/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                {Object.keys(selectedItems).length === 0 ? (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 text-sage-light mx-auto mb-4" />
                    <p className="text-foreground/70">No gifts selected yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(selectedItems).map(([itemId, quantity]) => {
                      const item = giftItems.find(i => i.id === itemId);
                      if (!item) return null;
                      
                      return (
                        <div key={itemId} className="flex items-center space-x-4 p-3 bg-sage-light/10 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sage-dark">{item.name}</h4>
                            <p className="text-sm text-foreground/70">R${item.price} × {quantity}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(itemId)}
                              className="w-6 h-6 bg-sage-light rounded-full flex items-center justify-center text-sage-dark hover:bg-sage-medium hover:text-background transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </motion.button>
                            <span className="w-6 text-center text-sm">{quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => addToCart(itemId)}
                              className="w-6 h-6 bg-sage-dark rounded-full flex items-center justify-center text-background hover:bg-sage-medium transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </motion.button>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="pt-4 border-t border-sage-light">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-sage-dark">Total: R${totalPrice}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={clearCart}
                          className="text-sm text-sage-medium hover:text-sage-dark transition-colors"
                        >
                          Clear All
                        </motion.button>
                      </div>
                      
                      <Button 
                        onClick={() => setIsCartOpen(false)}
                        className="w-full bg-sage-dark hover:bg-sage-medium"
                      >
                        Go to Full Cart
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional Registry Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-sage-light/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-romantic text-2xl text-sage-dark mb-4">
              Thank You for Your Generosity
            </h3>
            <p className="text-foreground/80 leading-relaxed">
              We are so grateful for your love and support as we begin this new chapter together. 
              If you prefer to give a monetary gift, we also have a cash fund set up for our honeymoon adventures.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}