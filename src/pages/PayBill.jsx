import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase/firebaseConfig';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

function PayBill() {
  const [occupiedTables, setOccupiedTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableName, setTableName] = useState('');
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  // Fetch all occupied tables
  useEffect(() => {
    const fetchOccupiedTables = async () => {
      const snapshot = await getDocs(collection(db, 'Tables'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOccupiedTables(
        data.filter((t) => t.IsOccupied).sort((a, b) => a.Number - b.Number)
      );
    };
    fetchOccupiedTables();
  }, []);

  // Load all orders for selected table
  const handleLoadOrdersForTable = async (tableId) => {
    setSelectedTable(tableId);

    const tableDoc = await getDoc(doc(db, 'Tables', tableId));
    if (tableDoc.exists()) {
      setTableName(tableDoc.data().Name);
    }

    const q = query(collection(db, 'Orders'), where('Table', '==', tableId));
    const snapshot = await getDocs(q);
    const orders = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((order) => order.Status !== 'Paid'); // Only show unpaid orders

    setOrders(orders);
  };

  // Handle payment of one individual order
  const handleMarkOrderPaid = async (orderId) => {
    const confirm = window.confirm('Mark this order as paid?');
    if (!confirm) return;

    try {
      await updateDoc(doc(db, 'Orders', orderId), {
        Status: 'Paid',
      });

      // Reload orders for the current table
      await handleLoadOrdersForTable(selectedTable);

      // Check if all orders for this table are paid now
      const q = query(
        collection(db, 'Orders'),
        where('Table', '==', selectedTable)
      );
      const snapshot = await getDocs(q);
      const allOrders = snapshot.docs.map((doc) => doc.data());
      const hasUnpaid = allOrders.some((order) => order.Status !== 'Paid');

      if (!hasUnpaid) {
        await updateDoc(doc(db, 'Tables', selectedTable), {
          IsOccupied: false,
        });
        alert(`✅ All orders paid. ${tableName} is now free!`);

        // Refresh occupied table list
        const tablesSnap = await getDocs(collection(db, 'Tables'));
        const updated = tablesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOccupiedTables(updated.filter((t) => t.IsOccupied));

        setOrders([]);
        setSelectedTable('');
        setTableName('');
      } else {
        alert('Order marked paid. Some orders still unpaid.');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to mark order as paid.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-40 max-w-2xl mx-auto p-4">
        {orders.length > 0 && (
          <div className="space-y-6 mb-10">
            <h2 className="text-xl font-bold">Unpaid Orders for {tableName}</h2>

            {orders.map((order) => (
              <div
                key={order.id}
                className="border p-4 rounded shadow bg-white space-y-2"
              >
                <h3 className="font-semibold text-lg">Order ID: {order.id}</h3>
                <ul>
                  {order.Products.map((item, i) => (
                    <li key={i}>
                      {item.Name} × {item.Quantity} — €
                      {(item.Price * item.Quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p className="font-bold">Total: {order.Total}</p>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white mt-2"
                  onClick={() => handleMarkOrderPaid(order.id)}
                >
                  Mark as Paid
                </Button>
              </div>
            ))}
          </div>
        )}

        <form className="space-y-6">
          <div className="mt-10">
            <Label>Select Table to Pay Bill</Label>
            <Select
              value={selectedTable}
              onValueChange={handleLoadOrdersForTable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select occupied table" />
              </SelectTrigger>
              <SelectContent>
                {occupiedTables.length > 0 ? (
                  occupiedTables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      {table.Name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No occupied tables available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="mt-6">
          <Link to="/waiter">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              Go Back to Order Page
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default PayBill;
