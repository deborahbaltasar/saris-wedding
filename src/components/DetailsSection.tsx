import { motion } from 'motion/react';
import { MapPin, Clock, Calendar, Car, Utensils, Music, Camera } from 'lucide-react';

export function DetailsSection() {
  const ceremonyDetails = {
    title: "Cerimônia",
    date: "01 de Novembro, 2025",
    time: "20 hs",
    venue: "Paróquia São João Eudes",
    address: "R. José Guilherme da Costa, 60 - Eng. Luciano Cavalcante, Fortaleza - CE, 60810-480",
    description: "Uma celebração especial na igreja, cercada por fé, amor e pessoas queridas.",
    maps: "https://www.google.com/maps/place/Igreja+Matriz+de+S%C3%A3o+Jo%C3%A3o+Eudes/@-3.7689981,-38.4982111,17z/data=!4m15!1m8!3m7!1s0x7c74f4d582f04b5:0x3bb803698e9ae2e2!2sR.+Jos%C3%A9+Guilherme+da+Costa,+60+-+Eng.+Luciano+Cavalcante,+Fortaleza+-+CE,+60811-300!3b1!8m2!3d-3.7689981!4d-38.4956362!16s%2Fg%2F11t5_y7q5w!3m5!1s0x7c74f6a78e5c53b:0x462c3718789c4875!8m2!3d-3.7689981!4d-38.4956362!16s%2Fg%2F11jl1hqqk1?entry=ttu&g_ep=EgoyMDI1MDgzMC4wIKXMDSoASAFQAw%3D%3D"
  };

  const receptionDetails = {
    title: "Recepção",
    date: "01 de Novembro, 2025",
    time: "22 hs",
    venue: "Ilmar Gourmet",
    address: "Rua Luiza Miranda Coelho, 1111 - Eng. Luciano Cavalcante, Fortaleza - CE, 60811-110",
    description: "Celebre conosco até a noite com jantar, dança e memórias que durarão para sempre.",
    maps: "https://www.google.com/maps/place/Ilmar+Gourmet/@-3.7751854,-38.4859554,17z/data=!3m1!4b1!4m6!3m5!1s0x7c74f57cb4d6629:0x896b7f5fd2eb3116!8m2!3d-3.7751854!4d-38.4859554!16s%2Fg%2F1tfydsxj?entry=ttu&g_ep=EgoyMDI1MDgzMC4wIKXMDSoASAFQAw%3D%3D"
  };

  const additionalInfo = [
    {
      icon: Car,
      title: "Transportation",
      description: "Complimentary shuttle service will be provided from the ceremony to reception venue."
    },
    {
      icon: Utensils,
      title: "Catering",
      description: "Enjoy a three-course plated dinner featuring locally-sourced ingredients and vegetarian options."
    },
    {
      icon: Music,
      title: "Entertainment",
      description: "Live acoustic music during ceremony and cocktail hour, followed by DJ and dancing."
    },
    {
      icon: Camera,
      title: "Photography",
      description: "Please enjoy our unplugged ceremony, but feel free to share photos during the reception!"
    }
  ];

  const EventCard = ({ event }: { event: typeof ceremonyDetails }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-sage-light/30 h-full"
    >
      <h3 className="font-romantic text-3xl text-sage-dark mb-6">{event.title}</h3>
      <p className="text-foreground/80 mb-6 leading-relaxed">{event.description}</p>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center text-foreground/70">
          <Calendar className="h-5 w-5 text-sage-medium mr-3 flex-shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-foreground/70">
          <Clock className="h-5 w-5 text-sage-medium mr-3 flex-shrink-0" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-start text-foreground/70">
          <MapPin className="h-5 w-5 text-sage-medium mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-sage-dark">{event.venue}</div>
            <div className="text-sm">{event.address}</div>
          </div>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center px-6 py-3 bg-sage-dark text-background rounded-full hover:bg-sage-medium transition-colors w-full sm:w-auto justify-center"
        onClick={() => window.open(`${event.maps}`, '_blank')}
      >
        <MapPin className="h-4 w-4 mr-2" />
        Abrir no mapa
      </motion.button>
    </motion.div>
  );

  return (
    <section id="details" className="py-10 bg-gradient-to-b from-cream/30 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-romantic text-4xl md:text-5xl text-sage-dark mb-6">
            Detalhes
          </h2>
          <div className="w-24 h-1 bg-sage-dark mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Todas as informações importantes que você precisa para o nosso grande dia. Mal podemos esperar para celebrar com você!
          </p>
        </motion.div>

        {/* Ceremony and Reception Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <EventCard event={ceremonyDetails} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <EventCard event={receptionDetails} />
          </motion.div>
        </motion.div>

        {/* Additional Information */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="font-romantic text-3xl text-sage-dark text-center mb-12">
            Additional Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-background/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-sage-light/30"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-sage-light/20 rounded-full flex items-center justify-center">
                    <info.icon className="h-6 w-6 text-sage-dark" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sage-dark mb-2">{info.title}</h4>
                    <p className="text-foreground/70 text-sm leading-relaxed">{info.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

        {/* Dress Code */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-sage-light/20 rounded-2xl p-8 inline-block max-w-2xl">
            <h3 className="font-romantic text-2xl text-sage-dark mb-4">Dress Code</h3>
            <p className="text-foreground/80 leading-relaxed">
              We invite you to dress in garden party attire. Think florals, pastels, and comfortable shoes for dancing on grass! 
              Please avoid white and ivory to keep those colors special for the bride.
            </p>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}