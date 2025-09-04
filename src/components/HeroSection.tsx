import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { VideoPlayer } from './VideoPlayer';
import { VideoScrollController } from './VideoScrollController';

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdownEnded, setCountdownEnded] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const weddingDate = new Date("2025-11-01T20:00:00-03:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else if (!countdownEnded) {
        setCountdownEnded(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownEnded]);

  return (
    <section ref={heroRef} id="home" className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-gradient-to-br from-background via-cream/30 to-sage-light/20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1531768758921-efe347c05370?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwbGVhdmVzJTIwYm90YW5pY2FsfGVufDF8fHx8MTc1Njk1MDYzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Watercolor leaves background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Floating leaf decorations */}
      {/* <motion.div
        animate={{ 
          rotate: [0, 5, -5, 0],
          y: [0, -10, 0] 
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 opacity-30"
      >
        <div className="w-16 h-16 bg-sage-light/40 rounded-full blur-sm"></div>
      </motion.div> */}

      {/* <motion.div
        animate={{
          rotate: [0, -3, 3, 0],
          y: [0, 15, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-32 right-16 opacity-30"
      >
        <div className="w-12 h-12 bg-eucalyptus/40 rounded-full blur-sm"></div>
      </motion.div> */}

      {/* Main content container with proper vertical centering */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 pt-32 pb-8">
        <div className="h-20"></div>
        <div className="max-w-4xl w-full text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <img
                src="/src/assets/monograma.png"
                alt="Wedding Monogram"
                className="h-12 w-12 mx-auto mb-4 object-contain"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-romantic text-4xl sm:text-6xl md:text-7xl text-sage-dark mb-4"
            >
              Sarah & Rommel
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl text-foreground/70 mb-8 font-light"
            >
              are getting married
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center justify-center space-x-2 text-lg text-sage-dark mb-12"
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">01 de Novembro, 2025</span>
            </motion.div>
          </motion.div>

          {/* Countdown Timer - Always Visible */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-background/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-sage-light/30 mb-8"
          >
            <h2 className="font-romantic text-2xl text-sage-dark mb-6">
              {countdownEnded ? "Our Special Day is Here!" : "Contando os dias para o nosso felizes para sempre..."}
            </h2>
            {!countdownEnded ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="text-center p-4 bg-sage-light/10 rounded-xl"
                  >
                    <div className="text-2xl md:text-3xl font-semibold text-sage-dark mb-1">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-foreground/60 uppercase tracking-wide">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center py-8"
              >
                <Heart className="h-16 w-16 text-sage-dark mx-auto mb-4" />
                <p className="text-lg text-foreground/70">
                  Thank you for being part of our journey
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Video - Always Visible */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative bg-background/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-sage-light/30 w-full"
          >
            <div className="relative">
              <VideoPlayer
                ref={videoRef}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                poster="https://images.unsplash.com/photo-1629943206404-4b5c164957a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcm9tYW50aWMlMjBuYXR1cmV8ZW58MXx8fHwxNzU3MDA2NTc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                title="Our Love Story"
                description="A glimpse into our journey together"
                autoPlay={false}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {/* Video scroll controller */}
            <VideoScrollController
              videoRef={videoRef}
              containerRef={heroRef}
              isVideoVisible={true}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
