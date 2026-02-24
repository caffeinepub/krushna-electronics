import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAddToCart, useAddToWishlist, useRemoveFromWishlist, useGetWishlist } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

function getProductImage(imageFile: string): string {
  const map: Record<string, string> = {
    'iphone15pro.jpg': '/assets/generated/product-phone-1.dim_600x600.png',
    'pixel8pro.jpg': '/assets/generated/product-phone-1.dim_600x600.png',
    's24ultra.jpg': '/assets/generated/product-phone-1.dim_600x600.png',
    'macbookpro16.jpg': '/assets/generated/product-laptop-1.dim_600x600.png',
    'dellxps15.jpg': '/assets/generated/product-laptop-1.dim_600x600.png',
    'thinkpadx1.jpg': '/assets/generated/product-laptop-1.dim_600x600.png',
  };
  return map[imageFile] || '/assets/generated/product-phone-1.dim_600x600.png';
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/40'}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlist } = useGetWishlist();

  const isInWishlist = wishlist?.some((id) => id === product.id) ?? false;
  const rating = 4; // Static rating since backend doesn't have ratings
  const imgSrc = getProductImage(product.imageFile);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate({ to: '/login' });
      return;
    }
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(1) });
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      navigate({ to: '/login' });
      return;
    }
    try {
      if (isInWishlist) {
        await removeFromWishlist.mutateAsync(product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist.mutateAsync(product.id);
        toast.success('Added to wishlist!');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link to="/product/$id" params={{ id: product.id.toString() }} className="block group">
      <div className="bg-card border border-border rounded-xl overflow-hidden card-hover shadow-card">
        {/* Image */}
        <div className="relative aspect-square bg-navy-mid overflow-hidden">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all ${
              isInWishlist
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40'
                : 'bg-black/30 text-white/70 border border-white/10 hover:text-neon-cyan hover:border-neon-cyan/40'
            }`}
          >
            <Heart size={14} className={isInWishlist ? 'fill-neon-cyan' : ''} />
          </button>
          {/* Stock badge */}
          {product.stock === BigInt(0) && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-destructive/80 text-destructive-foreground text-xs rounded-full">
              Out of Stock
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-2">
          <div>
            <p className="text-xs text-neon-cyan/70 font-medium uppercase tracking-wide">{product.category}</p>
            <h3 className="text-sm font-semibold text-foreground line-clamp-2 mt-0.5 group-hover:text-neon-cyan transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <StarRating rating={rating} />
            <span className="text-xs text-muted-foreground">({rating}.0)</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-bold text-neon-cyan">
              ₹{(product.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={addToCart.isPending || product.stock === BigInt(0)}
              className="h-7 px-2.5 text-xs gradient-neon text-navy-deep font-semibold border-0 hover:opacity-90 disabled:opacity-50"
            >
              <ShoppingCart size={12} className="mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
