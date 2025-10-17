import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { exportData, importData, getSettings, saveSettings, initializeDemoData } from '@/lib/storage';
import { Download, Upload, RefreshCw, Settings as SettingsIcon, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AppSettings } from '@/types';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atkins-pos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Backup created',
      description: 'Your data has been exported successfully',
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (window.confirm('This will overwrite all existing data. Are you sure?')) {
          importData(data);
          window.location.reload();
        }
      } catch (error) {
        toast({
          title: 'Import failed',
          description: 'Invalid backup file format',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (
      window.confirm(
        'This will reset all data to demo defaults. All existing data will be lost. Are you sure?'
      )
    ) {
      localStorage.clear();
      initializeDemoData();
      window.location.reload();
    }
  };

  const handleSaveSettings = () => {
    saveSettings(settings);
    toast({
      title: 'Settings saved',
      description: 'Your store settings have been updated',
    });
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage app configuration and data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Settings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-primary" />
                Store Settings
              </CardTitle>
              <CardDescription>Configure your store information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  placeholder="Atkins Guitar Store"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Input
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                  placeholder="123 Music Street, Harmony City"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultThreshold">Default Low Stock Threshold</Label>
                <Input
                  id="defaultThreshold"
                  type="number"
                  value={settings.defaultLowStockThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultLowStockThreshold: Number(e.target.value),
                    })
                  }
                  placeholder="5"
                />
              </div>

              <Button onClick={handleSaveSettings} className="w-full gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Backup, restore, or reset your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-foreground">Export Data</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Download a backup of all your data (products, transactions, settings)
                </p>
                <Button onClick={handleExport} variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Export Backup
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 text-foreground">Import Data</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Restore data from a previously exported backup file
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import Backup
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 text-foreground">Reset to Demo Data</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Reset all data to default demo state (WARNING: This cannot be undone)
                </p>
                <Button
                  onClick={handleResetDemo}
                  variant="destructive"
                  className="w-full gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Demo Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Application details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Application:</span>
                <span className="font-medium">Atkins Guitar Store POS</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage:</span>
                <span className="font-medium">localStorage (Browser)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mode:</span>
                <span className="font-medium">Offline-First</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Demo Credentials</CardTitle>
              <CardDescription>Default login information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Username:</span>
                  <span className="font-mono font-semibold">admin</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Password:</span>
                  <span className="font-mono font-semibold">admin123</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Note: This is a demo system with simulated authentication. In production, use
                secure authentication methods.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
