import { useState } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { ShoppingCart, Heart, Star, ArrowLeft, Package, Zap, CheckCircle, XCircle } from 'lucide-react';
import { useGetProduct, useGetProductsByCategory, useAddToCart, useAddToWishlist, useRemoveFromWishlist, useGetWishlist } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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

const specsMap: Record<string, Record<string, string>> = {
  'iPhone 15 Pro': { Display: '6.1" Super Retina XDR', Chip: 'A17 Pro', Camera: '48MP Main + 12MP Ultra Wide', Battery: '3274 mAh', OS: 'iOS 17', Storage: '128GB / 256GB / 512GB' },
  'Samsung Galaxy S24 Ultra': { Display: '6.8" Dynamic AMOLED 2X', Chip: 'Snapdragon 8 Gen 3', Camera: '200MP Main', Battery: '5000 mAh', OS: 'Android 14', Storage: '256GB / 512GB / 1TB' },
  'Google Pixel 8 Pro': { Display: '6.7" LTPO OLED', Chip: 'Google Tensor G3', Camera: '50MP Main', Battery: '5050 mAh', OS: 'Android 14', Storage: '128GB / 256GB / 1TB' },
  'MacBook Pro 16"': { Display: '16.2" Liquid Retina XDR', Chip: 'Apple M3 Pro', RAM: '18GB Unified', Storage: '512GB SSD', Battery: '22 hours', OS: 'macOS Sonoma' },
  'Dell XPS 15': { Display: '15.6" OLED 3.5K', Processor: 'Intel Core i9-13900H', RAM: '32GB DDR5', Storage: '1TB NVMe SSD', Battery: '86Wh', OS: 'Windows 11 Pro' },
  'Lenovo ThinkPad X1 Carbon': { Display: '14" IPS Anti-glare', Processor: 'Intel Core i7-1365U', RAM: '16GB LPDDR5', Storage: '1TB SSD', Battery: '57Wh', OS: 'Windows 11 Pro' },
};

export default function ProductDetails() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const productId = BigInt(id || '1');
  const { data: product, isLoading } = useGetProduct(productId);
  const { data: relatedProducts } = useGetProductsByCategory(product?.category || '');
  const { data: wishlist } = useGetWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-32 mb-6 bg-secondary/50" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-xl bg-secondary/50" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 bg-secondary/50" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Product not found</h2>
        <Button onClick={() => navigate({ to: '/shop' })} className="gradient-neon text-navy-deep border-0">
          Back to Shop
        </Button>
      </div>
    );
  }

  const imgSrc = getProductImage(product.imageFile);
  const images = [imgSrc, imgSrc, imgSrc]; // Use same image for thumbnails
  const isInWishlist = wishlist?.some((wid) => wid === product.id) ?? false;
  const inStock = product.stock > BigInt(0);
  const specs = specsMap[product.name] || {};
  const priceInr = product.price * 83;
  const related = (relatedProducts || []).filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate({ to: '/login' }); return; }
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(quantity) });
      toast.success(`${product.name} added to cart!`);
    } catch { toast.error('Failed to add to cart'); }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate({ to: '/login' }); return; }
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: BigInt(quantity) });
      navigate({ to: '/checkout' });
    } catch { toast.error('Failed to proceed'); }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate({ to: '/login' }); return; }
    try {
      if (isInWishlist) {
        await removeFromWishlist.mutateAsync(product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist.mutateAsync(product.id);
        toast.success('Added to wishlist!');
      }
    } catch { toast.error('Failed to update wishlist'); }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-neon-cyan transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-neon-cyan transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-square bg-navy-mid rounded-xl overflow-hidden border border-border">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i ? 'border-neon-cyan neon-border' : 'border-border hover:border-neon-cyan/40'
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <Badge className="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30 mb-2">{product.category}</Badge>
              <h1 className="font-brand text-3xl font-bold text-foreground">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className={s <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.0) · 128 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-neon-cyan">
                ₹{priceInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ₹{(priceInr * 1.15).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/30">13% OFF</Badge>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="text-sm text-green-400 font-medium">In Stock ({product.stock.toString()} units)</span>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-destructive" />
                  <span className="text-sm text-destructive font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 text-foreground font-medium border-x border-border">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(Number(product.stock), quantity + 1))}
                  className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || addToCart.isPending}
                className="flex-1 gradient-neon text-navy-deep font-bold border-0 hover:opacity-90 rounded-xl"
              >
                <ShoppingCart size={16} className="mr-2" />
                {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={!inStock}
                variant="outline"
                className="flex-1 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 rounded-xl"
              >
                <Zap size={16} className="mr-2" />
                Buy Now
              </Button>
              <Button
                onClick={handleWishlist}
                variant="outline"
                className={`border-border hover:border-neon-cyan/40 rounded-xl ${isInWishlist ? 'text-neon-cyan border-neon-cyan/40' : 'text-muted-foreground'}`}
              >
                <Heart size={16} className={isInWishlist ? 'fill-neon-cyan' : ''} />
              </Button>
            </div>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Package size={16} className="text-neon-cyan" />
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-muted-foreground">{key}: </span>
                      <span className="text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="font-brand text-2xl font-bold text-foreground mb-6">
              Related <span className="text-neon-cyan">Products</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id.toString()} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
