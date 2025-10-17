import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useInventory } from '@/contexts/InventoryContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReceiptPrint from '@/components/ReceiptPrint';
import { Transaction } from '@/types';
import { toast } from '@/hooks/use-toast';

const POS: React.FC = () => {
  const { products } = useInventory();
  const { cart, addToCart, updateQuantity, removeFromCart, getTotal, checkout, clearCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const handleCheckout = (paymentType: 'cash' | 'gcash') => {
    const transaction = checkout(paymentType);
    if (transaction) {
      setCompletedTransaction(transaction);
      setShowReceipt(true);
      toast({
        title: 'Sale completed!',
        description: `Transaction ${transaction.id} successful`,
      });
    } else {
      toast({
        title: 'Checkout failed',
        description: 'Please check stock availability',
        variant: 'destructive',
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      electric: 'bg-primary text-primary-foreground',
      acoustic: 'bg-accent text-accent-foreground',
      bass: 'bg-success text-success-foreground',
      accessories: 'bg-secondary text-secondary-foreground',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <Layout>
      <div className="h-full flex">
        {/* Products Section */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">Point of Sale</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="shadow-card hover:shadow-elegant transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                    <Badge className={getCategoryColor(product.category)}>
                      {product.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-primary">{formatCurrency(product.price)}</p>
                      <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-96 border-l border-border bg-card p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Cart</h2>
          </div>

          <div className="flex-1 overflow-auto mb-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <Card key={item.product.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(item.product.price)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="font-bold text-foreground">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(getTotal())}</span>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={() => handleCheckout('cash')}
                disabled={cart.length === 0}
              >
                <Banknote className="w-5 h-5" />
                Pay with Cash
              </Button>
              <Button
                className="w-full gap-2"
                variant="outline"
                size="lg"
                onClick={() => handleCheckout('gcash')}
                disabled={cart.length === 0}
              >
                <CreditCard className="w-5 h-5" />
                Pay with GCash
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
                disabled={cart.length === 0}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Complete</DialogTitle>
            <DialogDescription>Receipt ready to print</DialogDescription>
          </DialogHeader>
          {completedTransaction && <ReceiptPrint transaction={completedTransaction} />}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default POS;
