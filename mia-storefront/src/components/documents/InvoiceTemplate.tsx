import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define styles to match the "Flowly" clean aesthetic
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#94a3b8',
    letterSpacing: 0,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: '#0d666b', // Deep teal from reference
    borderRadius: 8,
    // Add a simple geometric pattern simulation
    borderWidth: 2,
    borderColor: '#0a5256',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginVertical: 30,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  infoSection: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 6,
    textTransform: 'none',
  },
  valueBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 1.5,
    maxWidth: 200,
  },
  datesContainer: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  dateBlock: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 16,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colPrice: { flex: 1.5, textAlign: 'right' },
  colTotal: { flex: 1.5, textAlign: 'right' },
  headerText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  rowText: {
    fontSize: 10,
    color: '#334155',
  },
  rowTextBold: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  totalsContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    width: 250,
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  grandTotalRow: {
    flexDirection: 'row',
    width: 250,
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  grandTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  notesBox: {
    marginTop: 60,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 9,
    color: '#94a3b8',
    lineHeight: 1.6,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155',
  },
  footerContact: {
    fontSize: 10,
    color: '#94a3b8',
  }
});

interface InvoiceProps {
  order: any;
  items: any[];
  storeSettings: any;
  customer: any;
}

export const InvoiceTemplate = ({ order, items, storeSettings, customer }: InvoiceProps) => {
  const subtotal = Number(order.totalAmount);
  const issuedDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const dueDate = new Date(issuedDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days later

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Invoice</Text>
            <Text style={styles.invoiceNumber}>Invoice Number #{order.orderNumber || 'INV-000'}</Text>
          </View>
          <View style={styles.logoPlaceholder} />
        </View>

        {/* Info Container (Billed By / Billed To) */}
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.label}>Billed By :</Text>
            <Text style={styles.valueBold}>{storeSettings?.storeName || 'Pony Store'}</Text>
            <Text style={styles.valueText}>{storeSettings?.storeAddress || 'Lagos, Nigeria'}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.label}>Billed To :</Text>
            <Text style={styles.valueBold}>{customer?.fullName || 'Guest Customer'}</Text>
            <Text style={styles.valueText}>{order.shippingAddress || 'No shipping address provided'}</Text>
          </View>
        </View>

        {/* Dates Container */}
        <View style={styles.datesContainer}>
          <View style={styles.dateBlock}>
            <Text style={styles.label}>Date Issued :</Text>
            <Text style={styles.valueBold}>{issuedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.label}>Due Date :</Text>
            <Text style={styles.valueBold}>{dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          </View>
        </View>

        {/* Invoice Details Table */}
        <Text style={styles.detailsTitle}>Invoice Details</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colDesc}><Text style={styles.headerText}>Items/Service</Text></View>
            <View style={styles.colQty}><Text style={styles.headerText}>Quantity</Text></View>
            <View style={styles.colPrice}><Text style={styles.headerText}>Unit Price</Text></View>
            <View style={styles.colTotal}><Text style={styles.headerText}>Total</Text></View>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.colDesc}><Text style={styles.rowTextBold}>{item.product?.name || 'Product'}</Text></View>
              <View style={styles.colQty}><Text style={styles.rowText}>{item.quantity}</Text></View>
              <View style={styles.colPrice}><Text style={styles.rowText}>NGN {Number(item.price).toLocaleString()}</Text></View>
              <View style={styles.colTotal}><Text style={styles.rowTextBold}>NGN {(Number(item.price) * item.quantity).toLocaleString()}</Text></View>
            </View>
          ))}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.rowText}>Subtotal</Text>
            <Text style={styles.rowTextBold}>NGN {subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.rowText}>Tax (0%)</Text>
            <Text style={styles.rowTextBold}>NGN 0</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.rowText}>Discount</Text>
            <Text style={styles.rowTextBold}>NGN 0</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalText}>Grand Total</Text>
            <Text style={styles.grandTotalText}>NGN {subtotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Notes Box */}
        <View style={styles.notesBox}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesText}>• Payment is due by {dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</Text>
          <Text style={styles.notesText}>• Please include the invoice number in the payment reference to ensure accurate processing.</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{storeSettings?.storeName || 'Pony Finance Company, IND'}</Text>
          <Text style={styles.footerContact}>{storeSettings?.storePhone || '(+234) 812-4567-8901'}</Text>
        </View>
      </Page>
    </Document>
  );
};
