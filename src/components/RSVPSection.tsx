import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Users, Utensils, Music, Send, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

interface RSVPForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  attendance: 'yes' | 'no' | '';
  guestCount: string;
  guestNames: string;
  dietaryRestrictions: string[];
  dietaryDetails: string;
  songRequest: string;
  message: string;
}

const initialForm: RSVPForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  attendance: '',
  guestCount: '1',
  guestNames: '',
  dietaryRestrictions: [],
  dietaryDetails: '',
  songRequest: '',
  message: ''
};

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-free' },
  { id: 'dairy-free', label: 'Dairy-free' },
  { id: 'nut-allergy', label: 'Nut allergy' },
  { id: 'other', label: 'Other (please specify)' }
];

export function RSVPSection() {
  const [form, setForm] = useState<RSVPForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<RSVPForm>>({});

  const updateForm = (field: keyof RSVPForm, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleDietaryRestriction = (restriction: string) => {
    const current = form.dietaryRestrictions;
    const updated = current.includes(restriction)
      ? current.filter(r => r !== restriction)
      : [...current, restriction];
    updateForm('dietaryRestrictions', updated);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RSVPForm> = {};

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.attendance) newErrors.attendance = 'Please let us know if you can attend';

    if (form.attendance === 'yes') {
      if (!form.guestCount) newErrors.guestCount = 'Please specify number of guests';
      if (parseInt(form.guestCount) > 1 && !form.guestNames.trim()) {
        newErrors.guestNames = 'Please provide names of additional guests';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section id="rsvp" className="py-20 bg-gradient-to-b from-cream/30 to-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle className="h-16 w-16 text-sage-dark mx-auto mb-6" />
            <h2 className="font-romantic text-4xl text-sage-dark mb-4">Thank You!</h2>
            <p className="text-lg text-foreground/70 mb-8">
              Your RSVP has been received. We're so excited to celebrate with you!
            </p>
            <div className="bg-sage-light/20 rounded-2xl p-6 inline-block">
              <p className="text-sage-dark">
                {form.attendance === 'yes' 
                  ? `We can't wait to see you on June 15th!` 
                  : `We'll miss you, but we understand. Thank you for letting us know.`
                }
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-10 bg-gradient-to-b from-cream/30 to-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-romantic text-4xl md:text-5xl text-sage-dark mb-6">
            RSVP
          </h2>
          <div className="w-24 h-1 bg-sage-dark mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-foreground/70">
            Please let us know if you can join us for our special day. We can't wait to celebrate with you!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-sage-light/30"
        >
          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="font-romantic text-xl text-sage-dark mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Your Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  className={errors.firstName ? 'border-destructive' : ''}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => updateForm('lastName', e.target.value)}
                  className={errors.lastName ? 'border-destructive' : ''}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="mb-8">
            <h3 className="font-romantic text-xl text-sage-dark mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Will you be attending?
            </h3>
            <RadioGroup
              value={form.attendance}
              onValueChange={(value) => updateForm('attendance', value as 'yes' | 'no')}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes, I'll be there!</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">Unfortunately, I can't make it</Label>
              </div>
            </RadioGroup>
            {errors.attendance && (
              <p className="text-sm text-destructive mt-1">{errors.attendance}</p>
            )}
          </div>

          {/* Guest Information - Only shown if attending */}
          {form.attendance === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8"
            >
              <h3 className="font-romantic text-xl text-sage-dark mb-4">Guest Details</h3>
              <div className="mb-4">
                <Label htmlFor="guestCount">Number of Guests (including yourself)</Label>
                <Select value={form.guestCount} onValueChange={(value) => updateForm('guestCount', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {parseInt(form.guestCount) > 1 && (
                <div className="mb-4">
                  <Label htmlFor="guestNames">Names of Additional Guests</Label>
                  <Textarea
                    id="guestNames"
                    value={form.guestNames}
                    onChange={(e) => updateForm('guestNames', e.target.value)}
                    className={errors.guestNames ? 'border-destructive' : ''}
                    placeholder="Please list the names of your additional guests"
                    rows={3}
                  />
                  {errors.guestNames && (
                    <p className="text-sm text-destructive mt-1">{errors.guestNames}</p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Dietary Restrictions - Only shown if attending */}
          {/* {form.attendance === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8"
            >
              <h3 className="font-romantic text-xl text-sage-dark mb-4 flex items-center">
                <Utensils className="h-5 w-5 mr-2" />
                Dietary Restrictions
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {dietaryOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={form.dietaryRestrictions.includes(option.id)}
                      onCheckedChange={() => toggleDietaryRestriction(option.id)}
                    />
                    <Label htmlFor={option.id} className="text-sm">{option.label}</Label>
                  </div>
                ))}
              </div>
              
              {(form.dietaryRestrictions.includes('other') || form.dietaryRestrictions.length > 0) && (
                <div>
                  <Label htmlFor="dietaryDetails">Please specify any dietary requirements or allergies</Label>
                  <Textarea
                    id="dietaryDetails"
                    value={form.dietaryDetails}
                    onChange={(e) => updateForm('dietaryDetails', e.target.value)}
                    placeholder="Please provide details about dietary restrictions..."
                    rows={2}
                  />
                </div>
              )}
            </motion.div>
          )} */}

          {/* Song Request */}
          {/* {form.attendance === 'yes' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-8"
            >
              <h3 className="font-romantic text-xl text-sage-dark mb-4 flex items-center">
                <Music className="h-5 w-5 mr-2" />
                Song Request
              </h3>
              <div>
                <Label htmlFor="songRequest">Request a song for our playlist</Label>
                <Input
                  id="songRequest"
                  value={form.songRequest}
                  onChange={(e) => updateForm('songRequest', e.target.value)}
                  placeholder="Artist - Song Title"
                />
              </div>
            </motion.div>
          )} */}

          {/* Message */}
          <div className="mb-8">
            <h3 className="font-romantic text-xl text-sage-dark mb-4">
              Personal Message
            </h3>
            <div>
              <Label htmlFor="message">Share a message with us (optional)</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => updateForm('message', e.target.value)}
                placeholder="We'd love to hear from you..."
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sage-dark hover:bg-sage-medium text-background py-3 text-base flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-background border-t-transparent mr-2"></div>
                  Sending RSVP...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send RSVP
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-sm text-foreground/60">
            Please RSVP by May 1st, 2025. If you have any questions, feel free to contact us at{' '}
            <a href="mailto:hello@sarahandjames.com" className="text-sage-dark hover:underline">
              hello@sarahandjames.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}