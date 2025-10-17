import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { getSettings } from '@/lib/storage';

interface ReceiptPrintProps {
  transaction: Transaction;
}

const ReceiptPrint: React.FC<ReceiptPrintProps> = ({ transaction }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const settings = getSettings();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <div>
      <div ref={componentRef} className="p-8 bg-white text-black">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{settings.storeName}</h1>
          <p className="text-sm">{settings.storeAddress}</p>
        </div>

        <div className="border-t border-b border-black py-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Transaction ID:</span>
            <span className="font-mono">{transaction.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Date:</span>
            <span>{new Date(transaction.date).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cashier:</span>
            <span>{transaction.cashierName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Payment:</span>
            <span className="uppercase">{transaction.paymentType}</span>
          </div>
        </div>

        <table className="w-full mb-4">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-2">Item</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {transaction.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-2 text-sm">
                  <div>{item.product.name}</div>
                  <div className="text-xs text-gray-600">{item.product.brand}</div>
                </td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">{formatCurrency(item.product.price)}</td>
                <td className="text-right font-semibold">
                  {formatCurrency(item.product.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t-2 border-black pt-2">
          <div className="flex justify-between text-lg font-bold">
            <span>TOTAL</span>
            <span>{formatCurrency(transaction.total)}</span>
          </div>
        </div>

        <div className="text-center mt-6 text-sm">
          <p>Thank you for your purchase!</p>
          <p className="text-xs mt-2">Please keep this receipt for your records</p>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Print Receipt
        </Button>
      </div>
    </div>
  );
};

export default ReceiptPrint;
