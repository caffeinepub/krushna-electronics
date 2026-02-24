import { useState, useMemo } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { SlidersHorizontal, X } from 'lucide-react';
import { useGetProducts, useGetCategories } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Shop() {
  const search = useSearch({ strict: false }) as any;
  const navigate = useNavigate();
  const { data: products, isLoading } = useGetProducts();
  const { data: categories } = useGetCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>(search?.category || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const searchQuery = (search?.q as string) || '';

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter((p) => {
      const priceInr = p.price * 83;
      return priceInr >= priceRange[0] && priceInr <= priceRange[1];
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case 'popularity':
        result.sort((a, b) => Number(b.stock) - Number(a.stock));
        break;
    }

    return result;
  }, [products, selectedCategory, priceRange, sortBy, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 300000]);
    setSortBy('newest');
    navigate({ to: '/shop' });
  };

  const hasFilters = selectedCategory || priceRange[0] > 0 || priceRange[1] < 300000;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-brand text-3xl font-bold text-foreground">
              {searchQuery ? `Search: "${searchQuery}"` : selectedCategory ? selectedCategory : 'All Products'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-border hover:border-neon-cyan/40 hover:text-neon-cyan"
            >
              <SlidersHorizontal size={14} className="mr-1.5" />
              Filters
              {hasFilters && <span className="ml-1.5 w-2 h-2 rounded-full bg-neon-cyan" />}
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 bg-secondary/50 border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-64 shrink-0 space-y-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Filters</h3>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-xs text-neon-cyan hover:underline flex items-center gap-1">
                      <X size={12} /> Clear
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-5">
                  <h4 className="text-sm font-medium text-foreground mb-3">Category</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        !selectedCategory ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      All Categories
                    </button>
                    {(categories ?? []).map((cat) => (
                      <button
                        key={cat.id.toString()}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                          selectedCategory === cat.name ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Price Range (₹)</h4>
                  <Slider
                    min={0}
                    max={300000}
                    step={1000}
                    value={priceRange}
                    onValueChange={(v) => setPriceRange(v as [number, number])}
                    className="mb-3"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                    <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-xl bg-secondary/50" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                <Button onClick={clearFilters} variant="outline" className="border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
