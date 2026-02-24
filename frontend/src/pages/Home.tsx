import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Shield, Truck, Headphones, Award, Star, ChevronRight } from 'lucide-react';
import { useGetProducts, useGetCategories } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const categoryImages: Record<string, string> = {
  Smartphones: '/assets/generated/cat-smartphones.dim_400x240.png',
  Laptops: '/assets/generated/cat-laptops.dim_400x240.png',
  Accessories: '/assets/generated/cat-accessories.dim_400x240.png',
  'TVs & Displays': '/assets/generated/cat-tvs.dim_400x240.png',
  Tablets: '/assets/generated/cat-accessories.dim_400x240.png',
};

const testimonials = [
  { name: 'Rahul Sharma', location: 'Mumbai', rating: 5, text: 'Excellent service and genuine products. Got my iPhone delivered in 2 days. Highly recommended!' },
  { name: 'Priya Patel', location: 'Ahmedabad', rating: 5, text: 'Best electronics store in Pune. The staff is very knowledgeable and prices are competitive.' },
  { name: 'Amit Kumar', location: 'Delhi', rating: 4, text: 'Great selection of laptops. The MacBook Pro I bought works perfectly. Will shop again!' },
];

const features = [
  { icon: Truck, title: 'Fast Delivery', desc: 'Same-day delivery in Pune, 2-day pan India' },
  { icon: Shield, title: 'Genuine Products', desc: '100% authentic with manufacturer warranty' },
  { icon: Headphones, title: '24/7 Support', desc: 'Expert assistance whenever you need it' },
  { icon: Award, title: 'Best Prices', desc: 'Price match guarantee on all products' },
];

export default function Home() {
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();

  const featuredProducts = products?.slice(0, 8) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '560px' }}>
        {/* Background image layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x700.png)' }}
        />
        {/* Strong dark overlay to suppress any image-embedded text */}
        <div className="absolute inset-0" style={{ background: 'rgba(5, 10, 30, 0.75)' }} />
        {/* Gradient overlay for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/80 via-navy-deep/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: '560px' }}>
          <div className="max-w-xl space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-neon" />
              Latest Offers — Up to 40% Off
            </div>
            <h1 className="font-brand text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Premium Electronics<br />
              <span className="neon-text">At Your Fingertips</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Discover the latest smartphones, laptops, and accessories from top brands. Genuine products, competitive prices, and expert support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate({ to: '/shop' })}
                className="gradient-neon text-navy-deep font-bold border-0 hover:opacity-90 px-6 py-2.5 rounded-full text-base"
              >
                Shop Now <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/about' })}
                className="border-border text-foreground hover:border-neon-cyan/60 hover:text-neon-cyan rounded-full px-6 py-2.5 text-base"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-navy-mid/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-brand text-3xl font-bold text-foreground">
              Shop by <span className="text-neon-cyan">Category</span>
            </h2>
            <p className="text-muted-foreground mt-2">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoriesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl bg-secondary/50" />
                ))
              : (categories ?? []).map((cat) => (
                  <Link
                    key={cat.id.toString()}
                    to="/shop"
                    search={{ category: cat.name } as any}
                    className="group relative rounded-xl overflow-hidden border border-border hover:border-neon-cyan/40 transition-all card-hover"
                    style={{ minHeight: '160px' }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${categoryImages[cat.name] || '/assets/generated/cat-accessories.dim_400x240.png'})` }}
                    />
                    <div className="absolute inset-0 bg-navy-deep/60 group-hover:bg-navy-deep/40 transition-colors" />
                    <div className="relative h-full flex flex-col items-center justify-center p-4 text-center" style={{ minHeight: '160px' }}>
                      <h3 className="font-brand text-lg font-bold text-foreground group-hover:text-neon-cyan transition-colors">
                        {cat.name}
                      </h3>
                      <span className="mt-1 text-xs text-muted-foreground group-hover:text-neon-cyan/70 flex items-center gap-1 transition-colors">
                        Explore <ChevronRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-brand text-3xl font-bold text-foreground">
                Featured <span className="text-neon-cyan">Products</span>
              </h2>
              <p className="text-muted-foreground mt-1">Handpicked top sellers just for you</p>
            </div>
            <Link to="/shop" className="flex items-center gap-1 text-neon-cyan hover:underline text-sm font-medium">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl bg-secondary/50" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-navy-mid/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-brand text-3xl font-bold text-foreground">
              Why Choose <span className="text-neon-cyan">Us?</span>
            </h2>
            <p className="text-muted-foreground mt-2">We go above and beyond for our customers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-6 text-center hover:border-neon-cyan/40 transition-all card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={22} className="text-neon-cyan" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-brand text-3xl font-bold text-foreground">
              Customer <span className="text-neon-cyan">Reviews</span>
            </h2>
            <p className="text-muted-foreground mt-2">What our customers say about us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-xl p-6 hover:border-neon-cyan/30 transition-all">
                <div className="flex items-center gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-navy-deep via-navy-mid to-navy-deep border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-brand text-3xl font-bold text-foreground mb-3">
            Ready to Upgrade Your <span className="text-neon-cyan">Tech?</span>
          </h2>
          <p className="text-muted-foreground mb-6">Explore our full range of electronics and find your perfect device.</p>
          <Button
            onClick={() => navigate({ to: '/shop' })}
            className="gradient-neon text-navy-deep font-bold border-0 hover:opacity-90 px-8 py-3 rounded-full text-base"
          >
            Browse All Products <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
