import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { OurStorySection } from './components/OurStorySection';
import { DetailsSection } from './components/DetailsSection';
import { GallerySection } from './components/GallerySection';
import { GiftRegistrySection } from './components/GiftRegistrySection';
import { RSVPSection } from './components/RSVPSection';
import { Footer } from './components/Footer';
import { CartProvider } from './components/CartContext';
import { FloatingCartButton } from './components/FloatingCartButton';
import { CartPage } from './components/CartPage';
import { PixPaymentModal } from './components/PixPaymentModal';
import { PaymentSuccessModal } from './components/PaymentSuccessModal';
import { usePixPaymentPersistence } from './hooks/usePixPaymentPersistence';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successAmount, setSuccessAmount] = useState(0);
  
  // Hook para persistência do modal PIX
  const { pixPaymentData, totalAmount, isPixModalOpen, closePixModal, openPixModal } = usePixPaymentPersistence();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'story', 'details', 'gallery', 'gifts', 'rsvp'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <Navigation activeSection={activeSection} />
        <main>
          <HeroSection />
          <OurStorySection />
          <DetailsSection />
          <GallerySection />
          <GiftRegistrySection onOpenCart={() => setIsCartOpen(true)} />
          <RSVPSection />
        </main>
        <Footer />
        <FloatingCartButton onOpenCart={() => setIsCartOpen(true)} />
        <CartPage 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          onOpenPixModal={openPixModal}
        />
        
        {/* Modal PIX Global - Persiste após reload */}
        <PixPaymentModal
          isOpen={isPixModalOpen}
          onClose={closePixModal}
          paymentData={pixPaymentData}
          onPaymentConfirmed={() => {
            // Store success amount before closing
            setSuccessAmount(totalAmount);
            closePixModal();
            // Close cart if it's open and show success modal
            setIsCartOpen(false);
            setShowSuccessModal(true);
          }}
          totalAmount={totalAmount}
        />

        {/* Modal de Sucesso do Pagamento */}
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          totalAmount={successAmount}
        />
      </div>
    </CartProvider>
  );
}
