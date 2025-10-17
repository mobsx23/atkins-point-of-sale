import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions } from '@/lib/storage';
import { useInventory } from '@/contexts/InventoryContext';
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Transaction } from '@/types';

const Dashboard: React.FC = () => {
  const { products, getLowStockProducts } = useInventory();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    todaySales: 0,
    todayTransactions: 0,
    totalRevenue: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    const loadData = () => {
      const allTransactions = getTransactions();
      setTransactions(allTransactions);

      const today = new Date().toDateString();
      const todayTransactions = allTransactions.filter(
        t => new Date(t.date).toDateString() === today
      );

      const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
      const totalRevenue = allTransactions.reduce((sum, t) => sum + t.total, 0);
      const lowStockCount = getLowStockProducts().length;

      setStats({
        todaySales,
        todayTransactions: todayTransactions.length,
        totalRevenue,
        lowStockCount,
      });
    };

    loadData();
  }, [products, getLowStockProducts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const statCards = [
    {
      title: "Today's Sales",
      value: formatCurrency(stats.todaySales),
      description: `${stats.todayTransactions} transactions`,
      icon: DollarSign,
      color: 'text-success',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      description: `${transactions.length} total transactions`,
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      title: 'Products in Stock',
      value: products.length.toString(),
      description: 'Active inventory items',
      icon: Package,
      color: 'text-accent',
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockCount.toString(),
      description: 'Items need restocking',
      icon: AlertTriangle,
      color: 'text-warning',
    },
  ];

  const recentTransactions = transactions.slice(-5).reverse();
  const lowStockItems = getLowStockProducts().slice(0, 5);

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your store performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Latest sales activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No transactions yet</p>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{txn.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(txn.date).toLocaleString()} • {txn.paymentType.toUpperCase()}
                        </p>
                      </div>
                      <p className="font-bold text-success">{formatCurrency(txn.total)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Low Stock Alert
              </CardTitle>
              <CardDescription>Items that need restocking</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">All items well stocked</p>
              ) : (
                <div className="space-y-4">
                  {lowStockItems.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20"
                    >
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-warning">{product.stock} left</p>
                        <p className="text-xs text-muted-foreground">
                          Min: {product.minStockThreshold}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
