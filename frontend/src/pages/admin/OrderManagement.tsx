import { useState } from 'react';
import { ShoppingCart, Clock } from 'lucide-react';
import { useGetAllOrders, useUpdateOrderStatus } from '../../hooks/useQueries';
import { OrderStatus } from '../../backend';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  processing: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  shipped: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
  delivered: 'bg-green-400/10 text-green-400 border-green-400/30',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
};

function getStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    [OrderStatus.pending]: 'Pending',
    [OrderStatus.processing]: 'Processing',
    [OrderStatus.shipped]: 'Shipped',
    [OrderStatus.delivered]: 'Delivered',
    [OrderStatus.cancelled]: 'Cancelled',
  };
  return map[status] ?? String(status);
}

function getStatusKey(status: OrderStatus): string {
  return String(status).toLowerCase();
}

export default function OrderManagement() {
  const { data: orders, isLoading } = useGetAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: bigint, newStatus: string) => {
    setUpdatingId(orderId.toString());
    const statusMap: Record<string, OrderStatus> = {
      pending: OrderStatus.pending,
      processing: OrderStatus.processing,
      shipped: OrderStatus.shipped,
      delivered: OrderStatus.delivered,
      cancelled: OrderStatus.cancelled,
    };
    try {
      await updateStatus.mutateAsync({ id: orderId, status: statusMap[newStatus] });
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-bold text-foreground">
          Order <span className="text-neon-cyan">Management</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {orders?.length ?? 0} total orders
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl bg-secondary/50" />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Order ID</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Items</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {(orders ?? []).map((order) => {
                  const statusKey = getStatusKey(order.status);
                  const date = new Date(Number(order.createdAt) / 1_000_000);
                  return (
                    <tr
                      key={order.id.toString()}
                      className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-neon-cyan font-bold">
                          #{order.id.toString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          {order.userId.toString().slice(0, 16)}...
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3 text-neon-cyan font-medium">
                        ₹{(order.total * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {date.toLocaleDateString('en-IN')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={statusKey}
                          onValueChange={(v) => handleStatusChange(order.id, v)}
                          disabled={updatingId === order.id.toString()}
                        >
                          <SelectTrigger className="w-32 h-7 text-xs bg-secondary/50 border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                              (s) => (
                                <SelectItem key={s} value={s} className="capitalize">
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(orders ?? []).length === 0 && (
              <div className="py-12 text-center">
                <ShoppingCart size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
