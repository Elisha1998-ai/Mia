import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 20,
  },
  storeInfo: {
    flexDirection: 'column',
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111111',
  },
  storeDetail: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'right',
  },
  invoiceMeta: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 10,
    color: '#666666',
    marginRight: 8,
  },
  metaValue: {
    fontSize: 10,
    color: '#111111',
    fontWeight: 'bold',
  },
  billTo: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  customerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 4,
  },
  customerDetail: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  table: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
    marginBottom: 8,
  },
  colItem: { width: '50%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '17.5%', textAlign: 'right' },
  colTotal: { width: '17.5%', textAlign: 'right' },
  
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111111',
    textTransform: 'uppercase',
  },
  cellText: {
    fontSize: 10,
    color: '#333333',
  },
  cellTextBold: {
    fontSize: 10,
    color: '#111111',
    fontWeight: 'bold',
  },
  totals: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 8,
    width: '40%',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 10,
    color: '#666666',
  },
  totalValue: {
    fontSize: 10,
    color: '#111111',
    fontWeight: 'bold',
  },
  grandTotal: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    width: '40%',
    justifyContent: 'space-between',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111111',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111111',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 8,
    color: '#999999',
    marginBottom: 4,
  },
});

interface InvoiceProps {
  order: any;
  items: any[];
  storeSettings: any;
  customer: any;
}

export const InvoiceTemplate = ({ order, items, storeSettings, customer }: InvoiceProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{storeSettings?.storeName || 'Mia Store'}</Text>
          <Text style={styles.storeDetail}>{storeSettings?.storeAddress || ''}</Text>
          <Text style={styles.storeDetail}>{storeSettings?.storePhone || ''}</Text>
          <Text style={styles.storeDetail}>{storeSettings?.adminEmail || ''}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <View style={styles.invoiceMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Invoice #:</Text>
              <Text style={styles.metaValue}>{order.orderNumber}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Date:</Text>
              <Text style={styles.metaValue}>{new Date(order.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Status:</Text>
              <Text style={styles.metaValue}>{order.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bill To */}
      <View style={styles.billTo}>
        <Text style={styles.sectionTitle}>Bill To</Text>
        <Text style={styles.customerName}>{customer?.fullName || 'Guest Customer'}</Text>
        <Text style={styles.customerDetail}>{customer?.email || ''}</Text>
        <Text style={styles.customerDetail}>{customer?.phone || ''}</Text>
        <Text style={styles.customerDetail}>{order.shippingAddress || ''}</Text>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.colItem}><Text style={styles.headerText}>Item</Text></View>
          <View style={styles.colQty}><Text style={styles.headerText}>Qty</Text></View>
          <View style={styles.colPrice}><Text style={styles.headerText}>Price</Text></View>
          <View style={styles.colTotal}><Text style={styles.headerText}>Total</Text></View>
        </View>
        
        {items.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.colItem}><Text style={styles.cellTextBold}>{item.product?.name || 'Product'}</Text></View>
            <View style={styles.colQty}><Text style={styles.cellText}>{item.quantity}</Text></View>
            <View style={styles.colPrice}><Text style={styles.cellText}>₦{Number(item.price).toLocaleString()}</Text></View>
            <View style={styles.colTotal}><Text style={styles.cellText}>₦{(Number(item.price) * item.quantity).toLocaleString()}</Text></View>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>₦{Number(order.totalAmount).toLocaleString()}</Text>
        </View>
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>Total</Text>
          <Text style={styles.grandTotalValue}>₦{Number(order.totalAmount).toLocaleString()}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for your business!</Text>
        <Text style={styles.footerText}>For any inquiries, please contact {storeSettings?.adminEmail || 'support@mia-auto.ai'}</Text>
      </View>
    </Page>
  </Document>
);
