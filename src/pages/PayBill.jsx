import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase/firebaseConfig';
import { Link } from 'react-router-dom';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label'; // Ensure Label is imported
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory in react-router-dom v6+

function PayBill() {
  const [occupiedTables, setOccupiedTables] = useState([]); // Holds the list of tables
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableName, setTableName] = useState(''); // To store the table name
  const [activeOrder, setActiveOrder] = useState(null);

  const navigate = useNavigate(); // Access useNavigate hook to programmatically navigate

  useEffect(() => {
    const fetchOccupiedTables = async () => {
      const snapshot = await getDocs(collection(db, 'Tables'));
      const tablesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort tables by their number in ascending order
      setOccupiedTables(
        tablesData
          .filter((t) => t.IsOccupied)
          .sort((a, b) => a.Number - b.Number)
      );
    };
    fetchOccupiedTables();
  }, []);

  // Load existing order data based on table id (passed from props or other means)
  const handleLoadOrder = async (tableId) => {
    const ordersSnapshot = await getDocs(collection(db, 'Orders'));
    const orders = ordersSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((order) => order.Table === tableId);

    if (orders.length > 0) {
      const latest = orders[0];
      setActiveOrderId(latest.id);
      setSelectedTable(latest.Table);
      setActiveOrder(latest);

      // Fetch the table name
      const tableSnapshot = await getDoc(doc(db, 'Tables', tableId));
      setTableName(tableSnapshot.data().Name); // Store table name to display
    } else {
      alert('No order found for this table.');
    }
  };

  const handleGenerateBill = async () => {
    if (!activeOrderId || !selectedTable) {
      console.log(
        'Exiting early due to missing activeOrderId or selectedTable'
      );
      return;
    }

    const confirmed = window.confirm(
      'Mark this order as paid and free the table?'
    );
    if (!confirmed) return;

    try {
      console.log('Closing bill for table:', tableName); // Use tableName here
      await updateDoc(doc(db, 'Orders', activeOrderId), {
        Status: 'Paid',
      });
      await updateDoc(doc(db, 'Tables', selectedTable), {
        IsOccupied: false,
      });

      alert('Bill closed and table marked free!');
      setActiveOrder(null); // Reset active order
      setSelectedTable(''); // Reset selected table
      setActiveOrderId(null);
      setTableName('');

      // Refresh the dropdown (resetting the occupied tables)
      const snapshot = await getDocs(collection(db, 'Tables'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOccupiedTables(data.filter((t) => t.IsOccupied)); // Reset the list of occupied tables
    } catch (error) {
      console.error('Error generating bill:', error);
      alert(`Failed to generate bill: ${error.message}`);
    }
  };

  // Go back to WaiterDashboard page when the button is clicked
  const handleReturnToOrderPage = () => {
    navigate('/waiter-dashboard'); // Navigate to WaiterDashboard page
  };

  return (
    <>
      <Navbar />
      <div className="pt-40 max-w-2xl mx-auto p-4">
        {activeOrder && (
          <div className="border p-4 rounded bg-white shadow mb-6">
            <h2 className="text-xl font-bold mb-2">Bill for Table</h2>
            <p className="mb-2">Table: {tableName}</p>
            <ul className="mb-2">
              {activeOrder.Products.map((item, i) => (
                <li key={i}>
                  {item.Name} × {item.Quantity} — €{item.Price * item.Quantity}
                </li>
              ))}
            </ul>
            <p className="font-bold">Total: {activeOrder.Total}</p>
            <Button
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleGenerateBill}
            >
              Close Bill
            </Button>
          </div>
        )}

        <form className="space-y-6">
          <div className="mt-10">
            {' '}
            {/* Added margin-top to push the dropdown further down */}
            <Label>Select Table to Pay Bill</Label>
            <Select value={selectedTable} onValueChange={handleLoadOrder}>
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

        {/* Return Button to go back to the Waiter Dashboard */}
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
