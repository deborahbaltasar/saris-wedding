import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Gift, CreditCard, Smartphone, ArrowLeft, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useCart } from './CartContext';
import { PixPaymentModal } from './PixPaymentModal';
import { createPixPayment, validatePaymentForm } from '../lib/payments';

interface CartPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartPage({ isOpen, onClose }: CartPageProps) {
  const { selectedItems, addToCart, removeFromCart, clearCart, totalItems, totalPrice, giftItems } = useCart();
  const [currentView, setCurrentView] = useState<'cart' | 'payment' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixPaymentData, setPixPaymentData] = useState(null);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    // If debit or credit card is selected, redirect to external registry
    if (paymentMethod === 'debit' || paymentMethod === 'credit') {
      window.open('https://noivos.casar.com/sarah-e-rommel#/presentes', '_blank');
      return;
    }

    // Validate form data for PIX payment
    // const validation = validatePaymentForm(formData, paymentMethod);
    // if (!validation.isValid) {
    //   setFormErrors(validation.errors);
    //   return;
    // }

    // setIsProcessing(true);
    // setFormErrors({});

    // try {
    //   const orderItems = cartItems.map(item => ({
    //     id: item.id,
    //     name: item.name,
    //     price: item.price,
    //     quantity: item.quantity,
    //     store: item.store,
    //   }));

    //   // Create PIX payment
    //   const pixData = await createPixPayment(totalPrice, {
    //     name: formData.name,
    //     email: formData.email,
    //     phone: formData.phone,
    //   }, orderItems);

    //   setPixPaymentData(pixData);
    //   setIsPixModalOpen(true);
    // } catch (error) {
    //   console.error('Payment error:', error);
    //   alert('Payment failed. Please try again.');
    // } finally {
    //   setIsProcessing(false);
    // }
    handlePixPaymentConfirmed();
  };

  const handlePixPaymentConfirmed = () => {
    setIsPixModalOpen(false);
    setCurrentView('success');
    setTimeout(() => {
      clearCart();
      setCurrentView('cart');
      onClose();
    }, 5000);
  };

  const cartItems = Object.entries(selectedItems).map(([itemId, quantity]) => {
    const item = giftItems.find(i => i.id === itemId);
    return item ? { ...item, quantity } : null;
  }).filter(Boolean);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-lg bg-background shadow-2xl overflow-y-auto"
          >
            {/* Cart View */}
            {currentView === 'cart' && (
              <div className="h-full flex flex-col">
                {/* Fixed Header */}
                <div className="flex-shrink-0 p-6 border-b border-sage-light/30">
                  <div className="flex items-center justify-between">
                    <h2 className="font-romantic text-2xl text-sage-dark">Shopping Cart</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 text-sage-dark hover:bg-sage-light/20 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {cartItems.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                      <Gift className="h-16 w-16 text-sage-light mx-auto mb-4" />
                      <h3 className="font-romantic text-xl text-sage-dark mb-2">Your cart is empty</h3>
                      <p className="text-foreground/70 mb-6">Add some gifts to get started</p>
                      <Button onClick={onClose} variant="outline" className="border-sage-dark text-sage-dark hover:bg-sage-light/10">
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Scrollable Items Section */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      <div className="space-y-4">
                        {cartItems.map((item) => {
                          if (!item) return null;
                          return (
                            <motion.div
                              key={item.id}
                              layout
                              className="flex items-center space-x-4 p-4 bg-sage-light/10 rounded-xl"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium text-sage-dark">{item.name}</h3>
                                <p className="text-sm text-foreground/70 mb-2">{item.store}</p>
                                <p className="text-lg font-semibold text-sage-dark">R${item.price}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-8 h-8 bg-sage-light rounded-full flex items-center justify-center text-sage-dark hover:bg-sage-medium hover:text-background transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </motion.button>
                                <span className="w-8 text-center font-medium text-sage-dark">{item.quantity}</span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => addToCart(item.id)}
                                  className="w-8 h-8 bg-sage-dark rounded-full flex items-center justify-center text-background hover:bg-sage-medium transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="flex-shrink-0 border-t border-sage-light/30 p-6 bg-background">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium text-sage-dark">
                            Total ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                          </span>
                          <span className="text-2xl font-semibold text-sage-dark">R${totalPrice}</span>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button
                            onClick={clearCart}
                            variant="outline"
                            className="flex-1 border-sage-light text-sage-medium hover:bg-sage-light/10"
                          >
                            Clear Cart
                          </Button>
                          <Button
                            onClick={() => setCurrentView('payment')}
                            className="flex-1 bg-sage-dark hover:bg-sage-medium"
                          >
                            Checkout
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Payment View */}
            {currentView === 'payment' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCurrentView('cart')}
                      className="p-2 text-sage-dark hover:bg-sage-light/20 rounded-full transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </motion.button>
                    <h2 className="font-romantic text-2xl text-sage-dark">Payment</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 text-sage-dark hover:bg-sage-light/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-sage-light/10 rounded-xl p-4">
                    <h3 className="font-medium text-sage-dark mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      {cartItems.map((item) => {
                        if (!item) return null;
                        return (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.name} × {item.quantity}</span>
                            <span>${item.price * item.quantity}</span>
                          </div>
                        );
                      })}
                      <div className="border-t border-sage-light pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>R${totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sage-dark">Contact Information</h3>
                      {paymentMethod === 'pix' && (
                        <p className="text-sm text-foreground/60 mt-1">
                          Required for PIX payment processing and order confirmation
                        </p>
                      )}
                      {(paymentMethod === 'debit' || paymentMethod === 'credit') && (
                        <p className="text-sm text-foreground/60 mt-1">
                          This information will be passed to the external payment page
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          className={`mt-1 ${formErrors.name ? 'border-destructive' : ''}`}
                        />
                        {formErrors.name && (
                          <p className="text-sm text-destructive mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          className={`mt-1 ${formErrors.email ? 'border-destructive' : ''}`}
                        />
                        {formErrors.email && (
                          <p className="text-sm text-destructive mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className={`mt-1 ${formErrors.phone ? 'border-destructive' : ''}`}
                        />
                        {formErrors.phone && (
                          <p className="text-sm text-destructive mt-1 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {formErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-sage-dark">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-3 border border-sage-light rounded-lg hover:bg-sage-light/5 transition-colors">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex items-center space-x-2 cursor-pointer flex-1">
                          <Smartphone className="h-5 w-5 text-sage-medium" />
                          <div className="flex flex-col">
                            <span>PIX (Instant Payment)</span>
                            <span className="text-xs text-foreground/60">Pay directly through this website</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-sage-light rounded-lg hover:bg-sage-light/5 transition-colors">
                        <RadioGroupItem value="debit" id="debit" />
                        <Label htmlFor="debit" className="flex items-center space-x-2 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-sage-medium" />
                          <div className="flex flex-col">
                            <span className="flex items-center space-x-1">
                              <span>Debit Card</span>
                              <ExternalLink className="h-3 w-3" />
                            </span>
                            <span className="text-xs text-foreground/60">Redirects to external payment page</span>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-sage-light rounded-lg hover:bg-sage-light/5 transition-colors">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit" className="flex items-center space-x-2 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5 text-sage-medium" />
                          <div className="flex flex-col">
                            <span className="flex items-center space-x-1">
                              <span>Credit Card</span>
                              <ExternalLink className="h-3 w-3" />
                            </span>
                            <span className="text-xs text-foreground/60">Redirects to external payment page</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Payment Details */}
                  {paymentMethod === 'pix' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-sage-light/10 rounded-xl p-4"
                    >
                      <h4 className="font-medium text-sage-dark mb-2">PIX Payment</h4>
                      <p className="text-sm text-foreground/70 mb-3">
                        You will receive a PIX code after confirming your order. Payment is instant and secure.
                      </p>
                      <div className="flex items-center text-sm text-sage-medium">
                        <Smartphone className="h-4 w-4 mr-2" />
                        <span>Use your banking app to scan the QR code or copy the PIX key</span>
                      </div>
                    </motion.div>
                  )}

                  {(paymentMethod === 'debit' || paymentMethod === 'credit') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-sage-light/10 rounded-xl p-4"
                    >
                      <h4 className="font-medium text-sage-dark mb-2">Card Payment</h4>
                      <p className="text-sm text-foreground/70 mb-3">
                        You will be redirected to our secure external payment page to complete your card transaction.
                      </p>
                      <div className="flex items-center text-sm text-sage-medium">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span>Redirects to: noivos.casar.com</span>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-sage-dark hover:bg-sage-medium disabled:opacity-50"
                    size="lg"
                  >
                    {(paymentMethod === 'debit' || paymentMethod === 'credit') ? (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Continue to External Payment - ${totalPrice}
                      </>
                    ) : isProcessing ? (
                      'Processing...'
                    ) : (
                      `Complete PIX Payment - R$ ${totalPrice}`
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Success View */}
            {currentView === 'success' && (
              <div className="p-6 flex items-center justify-center h-full">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-16 h-16 bg-sage-dark rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="h-8 w-8 text-background" />
                  </motion.div>
                  <h2 className="font-romantic text-2xl text-sage-dark mb-4">Thank You!</h2>
                  <p className="text-foreground/70 mb-6">
                    Your gift purchase has been completed successfully. Sarah & Rommel will be so grateful for your generosity!
                  </p>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5 }}
                    className="h-1 bg-sage-dark rounded-full"
                  />
                  <p className="text-sm text-sage-medium mt-4">Redirecting...</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
      
      {/* PIX Payment Modal */}
      <PixPaymentModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        paymentData={pixPaymentData}
        onPaymentConfirmed={handlePixPaymentConfirmed}
      />
    </AnimatePresence>
  );
}