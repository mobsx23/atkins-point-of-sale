import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getTransactions } from '@/lib/storage';
import { useInventory } from '@/contexts/InventoryContext';
import { Transaction, Product } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Download, TrendingUp, Package, DollarSign } from 'lucide-react';

const Reports: React.FC = () => {
  const { products, getLowStockProducts } = useInventory();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [salesReport, setSalesReport] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    averageTransaction: 0,
    cashSales: 0,
    gcashSales: 0,
  });
  const [topProducts, setTopProducts] = useState<Array<{ product: Product; totalSold: number; revenue: number }>>([]);

  useEffect(() => {
    loadReports();
  }, [products]);

  const loadReports = () => {
    const allTransactions = getTransactions();
    setTransactions(allTransactions);

    // Sales summary
    const totalRevenue = allTransactions.reduce((sum, t) => sum + t.total, 0);
    const cashSales = allTransactions
      .filter(t => t.paymentType === 'cash')
      .reduce((sum, t) => sum + t.total, 0);
    const gcashSales = allTransactions
      .filter(t => t.paymentType === 'gcash')
      .reduce((sum, t) => sum + t.total, 0);

    setSalesReport({
      totalRevenue,
      totalTransactions: allTransactions.length,
      averageTransaction: allTransactions.length > 0 ? totalRevenue / allTransactions.length : 0,
      cashSales,
      gcashSales,
    });

    // Top selling products
    const productSales: Record<string, { product: Product; totalSold: number; revenue: number }> = {};
    
    allTransactions.forEach(txn => {
      txn.items.forEach(item => {
        if (!productSales[item.product.id]) {
          productSales[item.product.id] = {
            product: item.product,
            totalSold: 0,
            revenue: 0,
          };
        }
        productSales[item.product.id].totalSold += item.quantity;
        productSales[item.product.id].revenue += item.product.price * item.quantity;
      });
    });

    const sortedProducts = Object.values(productSales).sort((a, b) => b.totalSold - a.totalSold);
    setTopProducts(sortedProducts.slice(0, 10));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const exportSalesReport = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      salesSummary: salesReport,
      transactions: transactions.map(t => ({
        id: t.id,
        date: t.date,
        total: t.total,
        paymentType: t.paymentType,
        items: t.items.length,
      })),
      topProducts: topProducts.map(p => ({
        name: p.product.name,
        brand: p.product.brand,
        totalSold: p.totalSold,
        revenue: p.revenue,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportInventoryReport = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      totalProducts: products.length,
      lowStockItems: getLowStockProducts().length,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        stock: p.stock,
        minStockThreshold: p.minStockThreshold,
        price: p.price,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lowStockProducts = getLowStockProducts();

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Business insights and performance metrics</p>
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="sales" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Sales Report
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="w-4 h-4" />
              Inventory Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={exportSalesReport} className="gap-2">
                <Download className="w-4 h-4" />
                Export Sales Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(salesReport.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All time sales
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {salesReport.totalTransactions}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed sales
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Transaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {formatCurrency(salesReport.averageTransaction)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per transaction
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Payment Split
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Cash:</span>
                      <span className="font-semibold">{formatCurrency(salesReport.cashSales)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GCash:</span>
                      <span className="font-semibold">{formatCurrency(salesReport.gcashSales)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Top Selling Products
                </CardTitle>
                <CardDescription>Best performing items by quantity sold</CardDescription>
              </CardHeader>
              <CardContent>
                {topProducts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No sales data yet</p>
                ) : (
                  <div className="space-y-4">
                    {topProducts.map((item, index) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{formatCurrency(item.revenue)}</p>
                          <p className="text-sm text-muted-foreground">{item.totalSold} sold</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={exportInventoryReport} className="gap-2">
                <Download className="w-4 h-4" />
                Export Inventory Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{products.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active inventory items</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Stock Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(products.reduce((sum, p) => sum + p.price * p.stock, 0))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Current inventory value</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Low Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{lowStockProducts.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Need restocking</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-warning" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>Products below minimum threshold</CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">All items well stocked</p>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.brand} • {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-warning">{product.stock} left</p>
                          <p className="text-xs text-muted-foreground">
                            Min threshold: {product.minStockThreshold}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
