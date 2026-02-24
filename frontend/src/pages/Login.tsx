import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Zap, Shield, ShoppingBag, Heart } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';

export default function Login() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn, isLoginError, loginError } = useInternetIdentity();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-neon-cyan/30 mx-auto mb-4">
            <img
              src="/assets/generated/ke-logo.dim_256x256.png"
              alt="KE Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-brand text-3xl font-bold text-foreground">
            Welcome to <span className="text-neon-cyan">Krushna Electronics</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your cart, wishlist, and orders
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <div className="space-y-3">
            {[
              { icon: ShoppingBag, text: 'Track your orders and cart' },
              { icon: Heart, text: 'Save products to your wishlist' },
              { icon: Shield, text: 'Secure, decentralized authentication' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-7 h-7 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                  <item.icon size={14} className="text-neon-cyan" />
                </div>
                {item.text}
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-5">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full gradient-neon text-navy-deep font-bold border-0 hover:opacity-90 rounded-xl py-3 text-base"
            >
              <Zap size={18} className="mr-2" />
              {isLoggingIn ? 'Connecting...' : 'Login / Register'}
            </Button>
            {isLoginError && loginError?.message !== 'User is already authenticated' && (
              <p className="text-xs text-destructive text-center mt-3">{loginError?.message}</p>
            )}
            <p className="text-xs text-muted-foreground text-center mt-3">
              New users are automatically registered on first login.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
