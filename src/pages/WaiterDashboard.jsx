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
      const snapshot = await getDocs(collection(db, 'Tables'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sortedData = data.sort((a, b) => a.Number - b.Number);
      setTables(sortedData.filter((t) => !t.IsOccupied));
      setOccupiedTables(sortedData.filter((t) => t.IsOccupied));
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'Products'));
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
    (p) => p.Category === selectedCategory
  );

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;
    const product = products.find((p) => p.id === selectedProduct);
    const newItem = {
      ProductID: product.id,
      Name: product.Name,
      Quantity: quantity,
      Price: product.Price,
      Notes: notes,
      Prepared: false,
    };
    if (editIndex !== null) {
      const updated = [...orderItems];
      updated[editIndex] = newItem;
      setOrderItems(updated);
      setEditIndex(null);
    } else {
      setOrderItems((prev) => [...prev, newItem]);
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
    const q = query(collection(db, 'Orders'), where('Table', '==', tableId));
    const snapshot = await getDocs(q);
    const orders = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.CreatedAt?.toDate() - a.CreatedAt?.toDate());

    if (orders.length > 0) {
      const latest = orders[0];
      setActiveOrderId(latest.id);
      setSelectedTable(latest.Table);
      setOrderItems(latest.Products);
    } else {
      alert('No order found for this table.');
    }
  };

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
      if (activeOrderId) {
        await updateDoc(doc(db, 'Orders', activeOrderId), orderData);
        alert('Order updated!');
      } else {
        const orderRef = await addDoc(collection(db, 'Orders'), orderData);
        await updateDoc(doc(db, 'Tables', selectedTable), {
          IsOccupied: true,
          Orders: [orderRef.id],
        });
        alert('Order submitted!');
      }

      setSelectedCategory(null);
      setSelectedProduct('');
      setQuantity(1);
      setNotes('');
      setOrderItems([]);
      setActiveOrderId(null);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-40 max-w-2xl mx-auto p-4">
        {orderItems.length > 0 && (
          <div className="text-center mb-4">
            <Button
              variant="destructive"
              onClick={handleSubmit}
              className="px-6"
            >
              {activeOrderId ? 'Update Order' : 'Submit Order'}
            </Button>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-6 text-center">
          Waiter Dashboard
        </h1>
        <div></div>

        <Link to="/paybill">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            Pay Bill / Close Table
          </Button>
        </Link>

        <form className="space-y-6">
          <div></div>

          <div>
            <Label>Place Order at a New Table</Label>
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
                {filteredProducts.map((p) => (
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
            onClick={handleAddItem}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {editIndex !== null ? 'Update Item' : 'Add Item to Cart'}
          </Button>

          {orderItems.length > 0 && (
            <div className="border p-4 rounded bg-gray-100">
              <h3 className="font-bold mb-2">Order Items</h3>
              <ul className="space-y-2">
                {orderItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-start">
                    <div>
                      {item.Name} × {item.Quantity}
                      {item.Notes && (
                        <p className="text-sm text-gray-600 italic">
                          {item.Notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditItem(idx)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveItem(idx)}
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
