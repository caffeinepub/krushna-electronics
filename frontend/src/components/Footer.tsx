import { Link } from '@tanstack/react-router';
import { Zap, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiYoutube } from 'react-icons/si';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'krushna-electronics');

  return (
    <footer className="bg-navy-deep border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-neon-cyan/30">
                <img src="/assets/generated/ke-logo.dim_256x256.png" alt="KE" className="w-full h-full object-cover" />
              </div>
              <span className="font-brand text-lg font-bold text-foreground">
                Krushna <span className="text-neon-cyan">Electronics</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted destination for premium electronics. Quality products, competitive prices, and exceptional service since 2010.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-neon-cyan hover:bg-secondary transition-all">
                <SiFacebook size={16} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-neon-cyan hover:bg-secondary transition-all">
                <SiX size={16} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-neon-cyan hover:bg-secondary transition-all">
                <SiInstagram size={16} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-neon-cyan hover:bg-secondary transition-all">
                <SiYoutube size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Shop' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/cart', label: 'Cart' },
                { to: '/wishlist', label: 'Wishlist' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-neon-cyan/40 group-hover:bg-neon-cyan transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin size={14} className="text-neon-cyan mt-0.5 shrink-0" />
                <span>Shop No. 12, Electronics Market, MG Road, Pune, Maharashtra 411001, India</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone size={14} className="text-neon-cyan shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail size={14} className="text-neon-cyan shrink-0" />
                <span>info@krushnaelectronics.in</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Business Hours</h3>
            <ul className="space-y-2">
              {[
                { day: 'Mon – Fri', hours: '10:00 AM – 8:00 PM' },
                { day: 'Saturday', hours: '10:00 AM – 9:00 PM' },
                { day: 'Sunday', hours: '11:00 AM – 6:00 PM' },
              ].map((item) => (
                <li key={item.day} className="flex items-center gap-2 text-sm">
                  <Clock size={12} className="text-neon-cyan shrink-0" />
                  <span className="text-muted-foreground">{item.day}:</span>
                  <span className="text-foreground font-medium">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {year} Krushna Electronics. All rights reserved.</span>
          <span>
            Built with{' '}
            <span className="text-red-400">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
