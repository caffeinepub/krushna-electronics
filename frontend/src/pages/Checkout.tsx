import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';
import { useGetCart, useGetProducts, useCreateOrder } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { Order } from '../backend';

export default function Checkout() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: cartItems } = useGetCart();
  const { data: allProducts } = useGetProducts();
  const createOrder = useCreateOrder();

  const [confirmed, setConfirmed] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cartWithProducts = useMemo(() => {
    if (!cartItems || !allProducts) return [];
    return cartItems
      .map((item) => ({
        item,
        product: allProducts.find((p) => p.id === item.productId),
      }))
      .filter((x) => x.product);
  }, [cartItems, allProducts]);

  const { subtotal, tax, total } = useMemo(() => {
    let sub = 0;
    for (const { item, product } of cartWithProducts) {
      if (product) sub += product.price * 83 * Number(item.quantity);
    }
    const t = sub * 0.18;
    return { subtotal: sub, tax: t, total: sub + t };
  }, [cartWithProducts]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Please login to checkout</h2>
        <Button
          onClick={() => navigate({ to: '/login' })}
          className="gradient-neon text-navy-deep border-0"
        >
          Login
        </Button>
      </div>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Valid email required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
      newErrors.phone = '10-digit phone required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode))
      newErrors.pincode = '6-digit pincode required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!cartItems || cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    try {
      const order = await createOrder.mutateAsync({ items: cartItems, total });
      setPlacedOrder(order);
      setConfirmed(true);
      toast.success('Order placed successfully!');
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  if (confirmed && placedOrder) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-card border border-border rounded-2xl p-10 space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <div>
              <h1 className="font-brand text-3xl font-bold text-foreground">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground mt-2">
                Thank you for shopping with Krushna Electronics
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-5 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="text-neon-cyan font-mono font-bold">
                  #{placedOrder.id.toString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-foreground font-bold">
                  ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="text-foreground capitalize">
                  {paymentMethod === 'cod'
                    ? 'Cash on Delivery'
                    : paymentMethod === 'upi'
                    ? 'UPI'
                    : 'Card'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="text-green-400 font-medium">3–5 Business Days</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              A confirmation will be sent to{' '}
              <span className="text-foreground">{form.email}</span>
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => navigate({ to: '/shop' })}
                className="gradient-neon text-navy-deep border-0 font-bold"
              >
                Continue Shopping
              </Button>
              <Button
                onClick={() => navigate({ to: '/' })}
                variant="outline"
                className="border-border hover:border-neon-cyan/40"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-brand text-3xl font-bold text-foreground mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Billing Details */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-foreground text-lg mb-5">
                  Billing Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-sm">Full Name *</Label>
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
                    <Label className="text-foreground text-sm">Email *</Label>
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
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-foreground text-sm">Phone Number *</Label>
                    <Input
                      value={form.phone}
                      onChange={handleChange('phone')}
                      placeholder="9876543210"
                      maxLength={10}
                      className="bg-secondary/50 border-border focus:border-neon-cyan/60"
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-foreground text-lg mb-5">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-foreground text-sm">Address *</Label>
                    <Input
                      value={form.address}
                      onChange={handleChange('address')}
                      placeholder="House No., Street, Area"
                      className="bg-secondary/50 border-border focus:border-neon-cyan/60"
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive">{errors.address}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-sm">City *</Label>
                    <Input
                      value={form.city}
                      onChange={handleChange('city')}
                      placeholder="Pune"
                      className="bg-secondary/50 border-border focus:border-neon-cyan/60"
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-sm">State *</Label>
                    <Input
                      value={form.state}
                      onChange={handleChange('state')}
                      placeholder="Maharashtra"
                      className="bg-secondary/50 border-border focus:border-neon-cyan/60"
                    />
                    {errors.state && (
                      <p className="text-xs text-destructive">{errors.state}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-sm">Pincode *</Label>
                    <Input
                      value={form.pincode}
                      onChange={handleChange('pincode')}
                      placeholder="411001"
                      maxLength={6}
                      className="bg-secondary/50 border-border focus:border-neon-cyan/60"
                    />
                    {errors.pincode && (
                      <p className="text-xs text-destructive">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-semibold text-foreground text-lg mb-5">
                  Payment Method
                </h2>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { value: 'upi', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm (simulated)' },
                    { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay (simulated)' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === opt.value
                          ? 'border-neon-cyan/50 bg-neon-cyan/5'
                          : 'border-border hover:border-neon-cyan/30'
                      }`}
                    >
                      <RadioGroupItem value={opt.value} className="border-border" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="font-semibold text-foreground text-lg mb-5">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {cartWithProducts.map(({ item, product }) =>
                    product ? (
                      <div
                        key={item.productId.toString()}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground truncate max-w-[160px]">
                          {product.name}{' '}
                          <span className="text-foreground">×{item.quantity.toString()}</span>
                        </span>
                        <span className="text-foreground font-medium shrink-0">
                          ₹
                          {(product.price * 83 * Number(item.quantity)).toLocaleString(
                            'en-IN',
                            { maximumFractionDigits: 0 }
                          )}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
                <Separator className="bg-border mb-4" />
                <div className="space-y-2 text-sm">
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
                  type="submit"
                  disabled={createOrder.isPending || cartWithProducts.length === 0}
                  className="w-full mt-6 gradient-neon text-navy-deep font-bold border-0 hover:opacity-90 rounded-xl"
                >
                  {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
