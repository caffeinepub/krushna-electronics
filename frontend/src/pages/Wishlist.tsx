import { useNavigate, Link } from '@tanstack/react-router';
import { Heart, ShoppingBag } from 'lucide-react';
import { useGetWishlist, useGetProducts, useRemoveFromWishlist } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function Wishlist() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: wishlistIds, isLoading: wishlistLoading } = useGetWishlist();
  const { data: allProducts, isLoading: productsLoading } = useGetProducts();
  const removeFromWishlist = useRemoveFromWishlist();

  const isLoading = wishlistLoading || productsLoading;

  const wishlistProducts = (allProducts ?? []).filter((p) =>
    (wishlistIds ?? []).some((id) => id === p.id)
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Heart size={64} className="mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Please login to view your wishlist
        </h2>
        <Button
          onClick={() => navigate({ to: '/login' })}
          className="gradient-neon text-navy-deep border-0 mt-4"
        >
          Login
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-48 mb-6 bg-secondary/50" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl bg-secondary/50" />
          ))}
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Heart size={64} className="mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-6">
          Save products you love to your wishlist
        </p>
        <Button
          onClick={() => navigate({ to: '/shop' })}
          className="gradient-neon text-navy-deep border-0"
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-brand text-3xl font-bold text-foreground">
              My <span className="text-neon-cyan">Wishlist</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm text-neon-cyan hover:underline flex items-center gap-1"
          >
            <ShoppingBag size={14} />
            Continue Shopping
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id.toString()} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
