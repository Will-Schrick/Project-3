import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import LogoutButton from '../components/LogoutButton';
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDoc,
} from 'firebase/firestore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

function WaiterDashboard() {
  const [tables, setTables] = useState([]);
  const [occupiedTables, setOccupiedTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      const allTables = await getDocs(collection(db, 'Tables'));
      const data = allTables.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTables(
        data.filter((t) => !t.IsOccupied).sort((a, b) => a.Number - b.Number)
      );
      setOccupiedTables(
        data.filter((t) => t.IsOccupied).sort((a, b) => a.Number - b.Number)
      );
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'Products'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, 'Categories'));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.ID - b.ID);
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(
    (product) => product.Category === selectedCategory
  );

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;
    const product = products.find((p) => p.id === selectedProduct);
    const item = {
      ProductID: product.id,
      Name: product.Name,
      Quantity: quantity,
      Price: product.Price,
      Notes: notes,
    };
    if (editIndex !== null) {
      const updated = [...orderItems];
      updated[editIndex] = item;
      setOrderItems(updated);
      setEditIndex(null);
    } else {
      setOrderItems((prev) => [...prev, item]);
    }
    setSelectedProduct('');
    setQuantity(1);
    setNotes('');
  };

  const handleEditItem = (index) => {
    const item = orderItems[index];
    setSelectedProduct(item.ProductID);
    setQuantity(item.Quantity);
    setNotes(item.Notes);
    setEditIndex(index);
  };

  const handleRemoveItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLoadExistingOrder = async (tableId) => {
    const q = query(
      collection(db, 'Orders'),
      where('Table', '==', tableId),
      where('Status', '==', 'Pending')
    );
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (orders.length > 0) {
      const order = orders[orders.length - 1];
      setActiveOrderId(order.id);
      setSelectedTable(order.Table);
      setOrderItems(order.Products);
    } else {
      alert('No open order found for this table.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedTable || orderItems.length === 0) return;

    // Get table name before submitting
    const tableDoc = await getDoc(doc(db, 'Tables', selectedTable));
    const tableName = tableDoc.exists()
      ? tableDoc.data().Name
      : 'Unknown Table';

    const total = orderItems.reduce(
      (sum, item) => sum + item.Price * item.Quantity,
      0
    );

    const orderData = {
      Table: tableName, // ✅ Submit the table name, not the ID
      Products: orderItems,
      Status: 'Pending',
      CreatedAt: new Date(),
      Total: `€${total.toFixed(2)}`,
    };

    if (activeOrderId) {
      await updateDoc(doc(db, 'Orders', activeOrderId), orderData);
    } else {
      const orderRef = await addDoc(collection(db, 'Orders'), orderData);
      await updateDoc(doc(db, 'Tables', selectedTable), {
        IsOccupied: true,
        Orders: [orderRef.id],
      });
    }

    setSelectedCategory(null);
    setSelectedProduct('');
    setQuantity(1);
    setNotes('');
    setOrderItems([]);
    setActiveOrderId(null);
    alert('Order submitted!');
  };

  return (
    <>
      <Navbar />
      <div className="pt-40 max-w-2xl mx-auto p-4 relative">
        {orderItems.length > 0 && (
          <div className="text-center mb-4">
            <Button
              variant="destructive"
              size="lg"
              onClick={handleSubmit}
              className="px-8"
            >
              {activeOrderId ? 'Update Order' : 'Submit Order'}
            </Button>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-6 text-center">
          Waiter Dashboard
        </h1>

        <form className="space-y-6">
          <div>
            <Label>Edit Existing Table Order</Label>
            <Select onValueChange={handleLoadExistingOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Select occupied table" />
              </SelectTrigger>
              <SelectContent>
                {occupiedTables.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>New Table</Label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
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

          <div>
            <Label>Category</Label>
            <Select
              value={selectedCategory?.toString() || ''}
              onValueChange={(value) => setSelectedCategory(Number(value))}
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
                {filteredProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.Name} (€{product.Price})
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
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
            />
          </div>

          <Button
            type="button"
            onClick={handleAddItem}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {editIndex !== null ? 'Update Item' : 'Add Item to Cart'}
          </Button>

          {orderItems.length > 0 && (
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold mb-2">Order Items</h3>
              <ul className="space-y-2">
                {orderItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-start gap-4"
                  >
                    <div>
                      <p>
                        {item.Name} × {item.Quantity}
                      </p>
                      {item.Notes && (
                        <p className="text-sm text-gray-600 italic">
                          {item.Notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditItem(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default WaiterDashboard;
