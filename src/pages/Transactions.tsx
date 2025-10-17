import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getTransactions } from '@/lib/storage';
import { Transaction } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Receipt, Search, Calendar, CreditCard, Banknote } from 'lucide-react';
import ReceiptPrint from '@/components/ReceiptPrint';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const data = getTransactions();
    setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const filteredTransactions = transactions.filter(
    t =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.cashierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.paymentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const handleViewReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowReceipt(true);
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
          <p className="text-muted-foreground mt-1">View and manage all sales transactions</p>
        </div>

        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Search Transactions
            </CardTitle>
            <CardDescription>Filter by transaction ID, cashier, or payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Receipt className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg text-foreground">{transaction.id}</h3>
                      <Badge
                        className={
                          transaction.paymentType === 'cash'
                            ? 'bg-success text-success-foreground'
                            : 'bg-primary text-primary-foreground'
                        }
                      >
                        {transaction.paymentType === 'cash' ? (
                          <>
                            <Banknote className="w-3 h-3 mr-1" />
                            Cash
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3 h-3 mr-1" />
                            GCash
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Date & Time</p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(transaction.date).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cashier</p>
                        <p className="text-sm font-medium">{transaction.cashierName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="text-sm font-medium">{transaction.items.length} item(s)</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(transaction.total)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Items:</p>
                      <div className="space-y-1">
                        {transaction.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-foreground">
                              {item.product.name} × {item.quantity}
                            </span>
                            <span className="font-medium">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReceipt(transaction)}
                      className="gap-2"
                    >
                      <Receipt className="w-4 h-4" />
                      View Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No transactions found</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Receipt</DialogTitle>
            <DialogDescription>View and print transaction details</DialogDescription>
          </DialogHeader>
          {selectedTransaction && <ReceiptPrint transaction={selectedTransaction} />}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Transactions;
