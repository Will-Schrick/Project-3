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

function WaiterDashboard() {
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const [orderItems, setOrderItems] = useState([]);

  // Fetch unoccupied tables
  useEffect(() => {
    const fetchTables = async () => {
      const q = query(
        collection(db, 'Tables'),
        where('IsOccupied', '==', false)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.Number - b.Number);
      setTables(data);
    };
    fetchTables();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'Products'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // Fetch categories
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
    };
    setOrderItems((prev) => [...prev, item]);
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTable || orderItems.length === 0) return;

    const total = orderItems.reduce(
      (sum, item) => sum + item.Price * item.Quantity,
      0
    );

    const order = {
      Table: selectedTable,
      Products: orderItems.map(({ ProductID, Quantity, Price }) => ({
        ProductID,
        Quantity,
        Price,
      })),
      Notes: notes,
      Status: 'Pending',
      CreatedAt: new Date(),
      Total: `€${total.toFixed(2)}`,
    };

    const orderRef = await addDoc(collection(db, 'Orders'), order);

    await updateDoc(doc(db, 'Tables', selectedTable), {
      IsOccupied: true,
      Orders: [orderRef.id],
    });

    setSelectedTable('');
    setSelectedCategory('');
    setSelectedProduct('');
    setQuantity(1);
    setNotes('');
    setOrderItems([]);
    alert('Order submitted!');
  };

  return (
    <>
      <Navbar />
      <div className="pt-40 max-w-2xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Waiter Dashboard
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Table Selector */}
          <div>
            <Label>Table</Label>
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

          {/* Category Selector */}
          <div>
            <Label>Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.ID}>
                    {cat.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Selector */}
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

          {/* Quantity & Add Item */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <Button type="button" onClick={handleAddItem} className="mt-6">
              Add Item
            </Button>
          </div>

          {/* Cart Preview */}
          {orderItems.length > 0 && (
            <div className="border p-4 rounded bg-gray-50">
              <h3 className="font-bold mb-2">Order Items</h3>
              <ul className="space-y-2">
                {orderItems.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {item.Name} × {item.Quantity}
                    </span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Submit Order
          </Button>
        </form>

        <div className="mt-10 text-center">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}

export default WaiterDashboard;
