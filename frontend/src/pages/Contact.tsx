import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useSubmitContactMessage } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function Contact() {
  const submitContact = useSubmitContactMessage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Valid email required';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim() || form.message.trim().length < 10)
      newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitContact.mutateAsync({
        name: form.name,
        email: form.email,
        message: `Subject: ${form.subject}\n\n${form.message}`,
      });
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-brand text-4xl font-bold text-foreground mb-3">
            Get in <span className="text-neon-cyan">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have a question or need help? We're here for you. Reach out and our team will
            respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-5">
            {/* Address */}
            <div className="bg-card border border-border rounded-xl p-5 hover:border-neon-cyan/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-neon-cyan" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Store Address</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Shop No. 12, Electronics Market,
                    <br />
                    MG Road, Pune,
                    <br />
                    Maharashtra 411001, India
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-card border border-border rounded-xl p-5 hover:border-neon-cyan/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-neon-cyan" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                  <p className="text-sm text-muted-foreground">+91 20 2765 4321</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-card border border-border rounded-xl p-5 hover:border-neon-cyan/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-neon-cyan" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">info@krushnaelectronics.in</p>
                  <p className="text-sm text-muted-foreground">support@krushnaelectronics.in</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-card border border-border rounded-xl p-5 hover:border-neon-cyan/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-neon-cyan" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                  <div className="space-y-1 text-sm">
                    {[
                      { day: 'Mon – Fri', hours: '10:00 AM – 8:00 PM' },
                      { day: 'Saturday', hours: '10:00 AM – 9:00 PM' },
                      { day: 'Sunday', hours: '11:00 AM – 6:00 PM' },
                    ].map((item) => (
                      <div key={item.day} className="flex justify-between gap-4">
                        <span className="text-muted-foreground">{item.day}</span>
                        <span className="text-foreground font-medium">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form + Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Placeholder */}
            <div className="bg-card border border-border rounded-xl overflow-hidden h-48 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-navy-mid to-navy-deep flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                  <MapPin size={24} className="text-neon-cyan" />
                </div>
                <div className="text-center">
                  <p className="text-foreground font-semibold">Krushna Electronics</p>
                  <p className="text-sm text-muted-foreground">MG Road, Pune, Maharashtra</p>
                </div>
                <div className="absolute inset-0 opacity-10">
                  {/* Grid pattern */}
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" className="text-neon-cyan" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            {submitted ? (
              <div className="bg-card border border-green-500/30 rounded-xl p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-green-400" />
                </div>
                <h3 className="font-brand text-2xl font-bold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  variant="outline"
                  className="mt-4 border-border hover:border-neon-cyan/40"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-foreground text-lg mb-5">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-foreground text-sm">Your Name *</Label>
                      <Input
                        value={form.name}
                        onChange={handleChange('name')}
                        placeholder="Rahul Sharma"
                        className="bg-secondary/50 border-border focus:border-neon-cyan/60"
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-foreground text-sm">Email Address *</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        placeholder="rahul@example.com"
                        className="bg-secondary/50 border-border focus:border-neon-cyan/60"
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-sm">Subject *</Label>
                    <Input
                      value={form.subject}
                      onChange={handleChange('subject')}
                      placeholder="Product inquiry, support, etc."
                      className="bg-secondary/50 border-border focus:border-neon-cyan/60"
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-sm">Message *</Label>
                    <Textarea
                      value={form.message}
                      onChange={handleChange('message')}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="bg-secondary/50 border-border focus:border-neon-cyan/60 resize-none"
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="w-full gradient-neon text-navy-deep font-bold border-0 hover:opacity-90 rounded-xl"
                  >
                    <Send size={16} className="mr-2" />
                    {submitContact.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
