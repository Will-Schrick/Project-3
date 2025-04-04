import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';

function WaiterDashboard() {
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [existingOrders, setExistingOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Fetch Tables and sort by Table Number (Lowest to Highest)
  useEffect(() => {
    const fetchTables = async () => {
      const snapshot = await getDocs(collection(db, 'Tables'));
      const tablesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedTables = tablesData.sort((a, b) => a.Number - b.Number); // Sort tables by number (ascending)
      setTables(sortedTables);
    };
    fetchTables();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'Products'));
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  // Fetch Categories and sort by Category ID
  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, 'Categories'));
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      categoriesData.sort((a, b) => a.ID - b.ID); // Sort categories by ID
      setCategories(categoriesData); // Set sorted categories
    };
    fetchCategories();
  }, []);

  // 🔄 Load existing orders for a table
  const handleTableSelection = async (tableId) => {
    setSelectedTable(tableId);
    setSelectedOrderId('');
    setOrderItems([]);

    const q = query(collection(db, 'Orders'), where('Table', '==', tableId));
    const snapshot = await getDocs(q);
    const activeOrders = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((order) => order.Status !== 'Paid'); // Only include orders that are not paid

    setExistingOrders(activeOrders);
  };

  // 🧾 Load a selected order into the cart
  const handleSelectOrder = (orderId) => {
    const order = existingOrders.find((o) => o.id === orderId);
    if (!order) return;

    setSelectedOrderId(orderId);
    setOrderItems(order.Products);
  };

  // Submit or update order
  const handleSubmit = async () => {
    if (!selectedTable || orderItems.length === 0) return;

    const total = orderItems.reduce(
      (sum, item) => sum + item.Price * item.Quantity,
      0
    );

    const orderData = {
      Table: selectedTable,
      Products: orderItems,
      Status: 'Pending',
      CreatedAt: new Date(),
      Total: `€${total.toFixed(2)}`,
    };

    try {
      if (selectedOrderId) {
        // Update existing order
        await updateDoc(doc(db, 'Orders', selectedOrderId), orderData);
      } else {
        // Create new order
        await addDoc(collection(db, 'Orders'), orderData);
        await updateDoc(doc(db, 'Tables', selectedTable), { IsOccupied: true });
      }
      setOrderItems([]);
      handleTableSelection(selectedTable); // reload orders
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-40 max-w-2xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Waiter Dashboard
        </h1>

        <Link to="/paybill">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-6">
            Pay Bill / Close Table
          </Button>
        </Link>

        <div className="space-y-4">
          <div>
            <Label>Select Table</Label>
            <Select value={selectedTable} onValueChange={handleTableSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {existingOrders.length > 0 && (
            <div>
              <Label>Select Existing Order</Label>
              <Select value={selectedOrderId} onValueChange={handleSelectOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="(Or start a new one)" />
                </SelectTrigger>
                <SelectContent>
                  {existingOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      Order ID: {order.id.slice(0, 6)} — {order.Products.length}{' '}
                      items
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <form className="space-y-6 mt-6">
          <div>
            <Label>Category</Label>
            <Select
              value={selectedCategory?.toString() || ''}
              onValueChange={(val) => setSelectedCategory(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.ID.toString()}>
                    {cat.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products
                  .filter((p) => p.Category === selectedCategory)
                  .sort((a, b) => a.Name.localeCompare(b.Name)) // Sort products alphabetically
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.Name} (€{p.Price})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
            />
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {selectedOrderId ? 'Update Order' : 'Submit Order'}
          </Button>
        </form>
      </div>
    </>
  );
}

export default WaiterDashboard;
