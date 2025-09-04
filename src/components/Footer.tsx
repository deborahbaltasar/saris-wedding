import { motion } from 'motion/react';
import { Heart, Mail, Phone, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-sage-light/20 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-sage-dark fill-current" />
              <span className="font-romantic text-2xl text-sage-dark">Sarah & Rommel</span>
              <Heart className="h-6 w-6 text-sage-dark fill-current" />
            </div>
            <p className="text-foreground/70 mb-6">
              01 de Novembro, 2025 • Fortaleza, Ceará
            </p>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8"
          >
            <a
              href="mailto:hello@sarahandjames.com"
              className="flex items-center space-x-2 text-sage-dark hover:text-sage-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>hello@sarahandjames.com</span>
            </a>
            <a
              href="tel:+1555123456"
              className="flex items-center space-x-2 text-sage-dark hover:text-sage-medium transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>(555) 123-4567</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-4 mb-8"
          >
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href="#"
              className="w-10 h-10 bg-sage-dark text-background rounded-full flex items-center justify-center hover:bg-sage-medium transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href="#"
              className="w-10 h-10 bg-sage-dark text-background rounded-full flex items-center justify-center hover:bg-sage-medium transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </motion.a>
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="border-t border-sage-light/30 pt-8"
          >
            <p className="text-sm text-foreground/60">
              © 2025 Sarah & Rommel •  Desenvolvido pela irmã da noiva ❤️
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}