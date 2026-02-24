import { useMemo } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useGetCart, useGetProduct, useGetProducts, useRemoveFromCart, useUpdateCartItem } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { CartItem } from '../backend';

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

function CartItemRow({
  item,
  onRemove,
  onUpdateQty,
}: {
  item: CartItem;
  onRemove: (id: bigint) => void;
  onUpdateQty: (id: bigint, qty: bigint) => void;
}) {
  const { data: product, isLoading } = useGetProduct(item.productId);

  if (isLoading) return <Skeleton className="h-24 rounded-xl bg-secondary/50" />;
  if (!product) return null;

  const priceInr = product.price * 83;
  const imgSrc = getProductImage(product.imageFile);

  return (
    <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
      <Link to="/product/$id" params={{ id: product.id.toString() }}>
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-navy-mid shrink-0">
          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link to="/product/$id" params={{ id: product.id.toString() }}>
          <h3 className="font-semibold text-foreground hover:text-neon-cyan transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
        <p className="text-neon-cyan font-bold mt-1">
          ₹{priceInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
      </div>
      <div className="flex items-center border border-border rounded-lg overflow-hidden shrink-0">
        <button
          onClick={() => onUpdateQty(item.productId, BigInt(Math.max(1, Number(item.quantity) - 1)))}
          className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="px-3 py-1.5 text-foreground text-sm font-medium border-x border-border">
          {item.quantity.toString()}
        </span>
        <button
          onClick={() => onUpdateQty(item.productId, BigInt(Number(item.quantity) + 1))}
          className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-foreground">
          ₹{(priceInr * Number(item.quantity)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
        <button
          onClick={() => onRemove(item.productId)}
          className="mt-1 text-destructive hover:text-destructive/80 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: cartItems, isLoading } = useGetCart();
  const { data: allProducts } = useGetProducts();
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();

  const { subtotal, tax, total } = useMemo(() => {
    if (!cartItems || !allProducts) return { subtotal: 0, tax: 0, total: 0 };
    let sub = 0;
    for (const item of cartItems) {
      const product = allProducts.find((p) => p.id === item.productId);
      if (product) {
        sub += product.price * 83 * Number(item.quantity);
      }
    }
    const t = sub * 0.18;
    return { subtotal: sub, tax: t, total: sub + t };
  }, [cartItems, allProducts]);

  const handleRemove = async (productId: bigint) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleUpdateQty = async (productId: bigint, quantity: bigint) => {
    try {
      await updateCartItem.mutateAsync({ productId, quantity });
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Please login to view your cart</h2>
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
        <Skeleton className="h-8 w-32 mb-6 bg-secondary/50" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-secondary/50" />
          ))}
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to get started</p>
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
        <h1 className="font-brand text-3xl font-bold text-foreground mb-8">
          Shopping <span className="text-neon-cyan">Cart</span>
          <span className="text-lg font-normal text-muted-foreground ml-3">({cartItems.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <CartItemRow
                key={item.productId.toString()}
                item={item}
                onRemove={handleRemove}
                onUpdateQty={handleUpdateQty}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-foreground text-lg mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">
                    ₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span className="text-foreground">
                    ₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-400 font-medium">FREE</span>
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-foreground">Total</span>
                  <span className="text-neon-cyan">
                    ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => navigate({ to: '/checkout' })}
                className="w-full mt-6 gradient-neon text-navy-deep font-bold border-0 hover:opacity-90 rounded-xl"
              >
                Proceed to Checkout <ArrowRight size={16} className="ml-2" />
              </Button>
              <Link
                to="/shop"
                className="block text-center text-sm text-muted-foreground hover:text-neon-cyan transition-colors mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
