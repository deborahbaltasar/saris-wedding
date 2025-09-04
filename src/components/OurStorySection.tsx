import { motion } from 'motion/react';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const storyMilestones = [
  {
    date: "March 2019",
    title: "We First Met",
    description: "A chance encounter at a coffee shop in downtown Portland led to hours of conversation and an instant connection.",
    image: "https://images.unsplash.com/photo-1629751450989-c3aa81267f7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjByb21hbnRpYyUyMGVuZ2FnZW1lbnR8ZW58MXx8fHwxNzU2OTUwNjMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Blue Star Coffee, Portland",
    icon: Heart
  },
  {
    date: "August 2020",
    title: "First Adventure",
    description: "Our first big trip together to the Oregon Coast, where we discovered our shared love for sunrise hikes and quiet moments by the ocean.",
    image: "https://images.unsplash.com/photo-1619010539735-92149716db70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNvdXBsZSUyMHdlZGRpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTY4ODQ4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Cannon Beach, Oregon",
    icon: MapPin
  },
  {
    date: "December 2022",
    title: "Moving In Together",
    description: "We found our perfect little home and made it ours, complete with a garden where we grow herbs and Sarah's favorite flowers.",
    image: "https://images.unsplash.com/photo-1700142611715-8a023c5eb8c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYm91cXVldCUyMGZsb3dlcnMlMjB3aGl0ZXxlbnwxfHx8fDE3NTY5NTA2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Our Home, Portland",
    icon: Heart
  },
  {
    date: "September 2024",
    title: "The Proposal",
    description: "Rommel surprised Sarah with a proposal during our favorite sunset spot overlooking the city. She said yes through happy tears!",
    image: "https://images.unsplash.com/photo-1677677402907-05f2883e3f66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VyZW1vbnklMjBvdXRkb29yfGVufDF8fHx8MTc1NjkyMzEyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    location: "Mount Tabor Park, Portland",
    icon: Heart
  }
];

export function OurStorySection() {
  return (
    <section id="story" className="py-12 bg-gradient-to-b from-background to-cream/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-romantic text-4xl md:text-5xl text-sage-dark mb-6">
            Nossa história
          </h2>
          <div className="w-24 h-1 bg-sage-dark mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Every love story is beautiful, but ours is our favorite. Here are the moments that brought us together and the journey that led us to this special day.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-sage-light/50 hidden md:block"></div>

          <div className="space-y-12">
            {storyMilestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline marker */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-sage-dark rounded-full border-4 border-background shadow-lg z-10 hidden md:flex items-center justify-center">
                  <milestone.icon className="h-5 w-5 text-background" />
                </div>

                {/* Content */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-sage-light/30"
                  >
                    <div className="flex items-center mb-4 md:hidden">
                      <milestone.icon className="h-5 w-5 text-sage-dark mr-2" />
                      <span className="text-sage-medium font-medium">{milestone.date}</span>
                    </div>
                    <div className="hidden md:block mb-4">
                      <span className="text-sage-medium font-medium">{milestone.date}</span>
                    </div>
                    <h3 className="font-romantic text-2xl text-sage-dark mb-4">{milestone.title}</h3>
                    <p className="text-foreground/80 mb-4 leading-relaxed">{milestone.description}</p>
                    <div className="flex items-center text-sm text-sage-medium">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{milestone.location}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Image */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'} mb-8 md:mb-0`}>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative overflow-hidden rounded-2xl shadow-lg"
                  >
                    <ImageWithFallback
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-sage-dark/10"></div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-sage-light/20 rounded-2xl p-8 inline-block">
            <h3 className="font-romantic text-2xl text-sage-dark mb-4">
              And now, we can't wait to start our next chapter...
            </h3>
            <div className="flex items-center justify-center space-x-2 text-sage-medium">
              <Heart className="h-5 w-5 fill-current" />
              <span className="font-medium">Together Forever</span>
              <Heart className="h-5 w-5 fill-current" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}