import { useNavigate } from '@tanstack/react-router';
import { Users, Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { useGetDashboardStats, useIsCallerAdmin } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <AlertTriangle size={48} className="mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">Please login to access the admin panel.</p>
        <Button onClick={() => navigate({ to: '/login' })} className="gradient-neon text-navy-deep border-0">
          Login
        </Button>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48 bg-secondary/50" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl bg-secondary/50" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="py-20 text-center">
        <AlertTriangle size={48} className="mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">
          You don't have permission to access the admin panel.
        </p>
        <Button onClick={() => navigate({ to: '/' })} variant="outline" className="border-border">
          Go Home
        </Button>
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats ? stats.totalUsers.toString() : '—',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/20',
    },
    {
      icon: Package,
      label: 'Total Products',
      value: stats ? stats.totalProducts.toString() : '—',
      color: 'text-neon-cyan',
      bg: 'bg-neon-cyan/10 border-neon-cyan/20',
    },
    {
      icon: ShoppingCart,
      label: 'Total Orders',
      value: stats ? stats.totalOrders.toString() : '—',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10 border-purple-400/20',
    },
    {
      icon: TrendingUp,
      label: 'Total Sales',
      value: stats
        ? `₹${(stats.totalSales * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
        : '—',
      color: 'text-green-400',
      bg: 'bg-green-400/10 border-green-400/20',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-brand text-3xl font-bold text-foreground">
          Admin <span className="text-neon-cyan">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-1">Overview of your store's performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) =>
          statsLoading ? (
            <Skeleton key={card.label} className="h-28 rounded-xl bg-secondary/50" />
          ) : (
            <div
              key={card.label}
              className="bg-card border border-border rounded-xl p-5 hover:border-neon-cyan/30 transition-all"
            >
              <div
                className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-3 ${card.bg}`}
              >
                <card.icon size={20} className={card.color} />
              </div>
              <p className={`text-2xl font-bold font-brand ${card.color}`}>{card.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
            </div>
          )
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Products', to: '/admin/products', desc: 'Add, edit, or remove products' },
          { label: 'Manage Users', to: '/admin/users', desc: 'View and manage user accounts' },
          { label: 'Manage Orders', to: '/admin/orders', desc: 'View and update order statuses' },
        ].map((link) => (
          <button
            key={link.to}
            onClick={() => navigate({ to: link.to as any })}
            className="bg-card border border-border rounded-xl p-5 text-left hover:border-neon-cyan/40 transition-all group"
          >
            <h3 className="font-semibold text-foreground group-hover:text-neon-cyan transition-colors">
              {link.label}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
