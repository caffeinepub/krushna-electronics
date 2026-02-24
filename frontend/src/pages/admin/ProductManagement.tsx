import { useState } from 'react';
import { Plus, Pencil, Trash2, Package, X } from 'lucide-react';
import {
  useGetProducts,
  useGetCategories,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateProductStock,
} from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { Product } from '../../backend';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  imageFile: string;
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  imageFile: '',
};

export default function ProductManagement() {
  const { data: products, isLoading } = useGetProducts();
  const { data: categories } = useGetCategories();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateStock = useUpdateProductStock();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [stockEdit, setStockEdit] = useState<{ id: bigint; value: string } | null>(null);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      imageFile: product.imageFile,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    const stock = parseInt(form.stock, 10);
    if (isNaN(price) || isNaN(stock)) {
      toast.error('Invalid price or stock value');
      return;
    }
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          name: form.name,
          description: form.description,
          price,
          stock: BigInt(stock),
          category: form.category,
          imageFile: form.imageFile,
        });
        toast.success('Product updated!');
      } else {
        await addProduct.mutateAsync({
          name: form.name,
          description: form.description,
          price,
          stock: BigInt(stock),
          category: form.category,
          imageFile: form.imageFile,
        });
        toast.success('Product added!');
      }
      setShowForm(false);
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success('Product deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleStockUpdate = async (id: bigint) => {
    if (!stockEdit) return;
    const val = parseInt(stockEdit.value, 10);
    if (isNaN(val) || val < 0) { toast.error('Invalid stock value'); return; }
    try {
      await updateStock.mutateAsync({ id, stock: BigInt(val) });
      toast.success('Stock updated');
      setStockEdit(null);
    } catch {
      toast.error('Failed to update stock');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-brand text-3xl font-bold text-foreground">
            Product <span className="text-neon-cyan">Management</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {products?.length ?? 0} products in store
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="gradient-neon text-navy-deep font-bold border-0 hover:opacity-90"
        >
          <Plus size={16} className="mr-1.5" /> Add Product
        </Button>
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
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Product</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Category</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Price</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">Stock</th>
                  <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(products ?? []).map((product) => (
                  <tr key={product.id.toString()} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                          <Package size={14} className="text-neon-cyan" />
                        </div>
                        <span className="font-medium text-foreground truncate max-w-[180px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
                    <td className="px-4 py-3 text-neon-cyan font-medium">
                      ₹{(product.price * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3">
                      {stockEdit?.id === product.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={stockEdit.value}
                            onChange={(e) => setStockEdit({ id: product.id, value: e.target.value })}
                            className="w-20 h-7 text-xs bg-secondary/50 border-border"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleStockUpdate(product.id)}
                            className="h-7 px-2 text-xs gradient-neon text-navy-deep border-0"
                          >
                            Save
                          </Button>
                          <button onClick={() => setStockEdit(null)} className="text-muted-foreground hover:text-foreground">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setStockEdit({ id: product.id, value: product.stock.toString() })}
                          className={`text-sm font-medium hover:underline ${
                            product.stock === BigInt(0) ? 'text-destructive' : 'text-foreground'
                          }`}
                        >
                          {product.stock.toString()}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground font-brand text-xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-foreground text-sm">Product Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="iPhone 15 Pro"
                required
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground text-sm">Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Product description..."
                required
                rows={3}
                className="bg-secondary/50 border-border resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-foreground text-sm">Price (USD) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="999.99"
                  required
                  className="bg-secondary/50 border-border"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground text-sm">Stock *</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                  placeholder="50"
                  required
                  className="bg-secondary/50 border-border"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground text-sm">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {(categories ?? []).map((cat) => (
                    <SelectItem key={cat.id.toString()} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground text-sm">Image Filename</Label>
              <Input
                value={form.imageFile}
                onChange={(e) => setForm((p) => ({ ...p, imageFile: e.target.value }))}
                placeholder="product-image.jpg"
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={addProduct.isPending || updateProduct.isPending}
                className="flex-1 gradient-neon text-navy-deep font-bold border-0"
              >
                {addProduct.isPending || updateProduct.isPending
                  ? 'Saving...'
                  : editingProduct
                  ? 'Update Product'
                  : 'Add Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-border"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Product?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. The product will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
