import { useState, useEffect } from 'react';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { ShoppingCart, Heart, Search, Menu, X, Zap, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useGetCart } from '../hooks/useQueries';
import { useGetWishlist } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const navigate = useNavigate();
  const { identity, clear, login, isLoggingIn } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: cartItems } = useGetCart();
  const { data: wishlistItems } = useGetWishlist();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthenticated = !!identity;
  const cartCount = cartItems?.length ?? 0;
  const wishlistCount = wishlistItems?.length ?? 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/shop', search: { q: searchQuery } as any });
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-deep/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-navy-deep/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-neon-cyan/30 group-hover:border-neon-cyan/70 transition-colors">
              <img
                src="/assets/generated/ke-logo.dim_256x256.png"
                alt="KE Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-brand text-xl font-bold text-foreground group-hover:text-neon-cyan transition-colors">
              Krushna <span className="text-neon-cyan">Electronics</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-neon-cyan transition-colors rounded-md hover:bg-white/5"
                activeProps={{ className: 'text-neon-cyan bg-white/5' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-48 lg:w-64 bg-secondary/50 border border-border rounded-full px-4 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60 focus:ring-1 focus:ring-neon-cyan/30 transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-neon-cyan transition-colors">
                <Search size={14} />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-muted-foreground hover:text-neon-cyan transition-colors rounded-md hover:bg-white/5">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-cyan text-navy-deep text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-muted-foreground hover:text-neon-cyan transition-colors rounded-md hover:bg-white/5">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-cyan text-navy-deep text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border hover:border-neon-cyan/40 text-sm text-foreground transition-all">
                    <User size={14} className="text-neon-cyan" />
                    <span className="max-w-[100px] truncate">{userProfile?.name || 'Account'}</span>
                    <ChevronDown size={12} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
                  {userProfile?.role === 'admin' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate({ to: '/admin' })} className="cursor-pointer">
                        <LayoutDashboard size={14} className="mr-2 text-neon-cyan" />
                        Admin Panel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut size={14} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="hidden md:flex gradient-neon text-navy-deep font-semibold hover:opacity-90 border-0 rounded-full"
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2 animate-slide-up">
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-secondary/50 border border-border rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/60"
              />
              <button type="submit" className="p-2 text-neon-cyan">
                <Search size={16} />
              </button>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-neon-cyan transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {userProfile?.role === 'admin' && (
                  <Link to="/admin" className="block px-3 py-2 text-sm font-medium text-neon-cyan" onClick={() => setMobileOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm font-medium text-destructive">
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { login(); setMobileOpen(false); }}
                disabled={isLoggingIn}
                className="w-full mt-2 py-2 rounded-full gradient-neon text-navy-deep font-semibold text-sm"
              >
                {isLoggingIn ? 'Logging in...' : 'Login / Register'}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
