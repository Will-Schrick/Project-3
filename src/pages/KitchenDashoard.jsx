import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [tablesMap, setTablesMap] = useState({});

  useEffect(() => {
    const fetchTables = async () => {
      const snapshot = await getDocs(collection(db, 'Tables'));
      const tableMap = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        tableMap[data.Name] = data.Number;
      });
      setTablesMap(tableMap);
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'Orders'),
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((order) => order.Status === 'Pending')
          .sort((a, b) => a.CreatedAt?.toDate() - b.CreatedAt?.toDate());
        setOrders(data);
      },
      (error) => console.error('Order snapshot error:', error)
    );
    return () => unsub();
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-32 px-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">
          Kitchen Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">
                  🧾 Order ID: <span className="text-gray-700">{order.id}</span>
                </span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  Table: #{tablesMap[order.Table] || '...'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {order.Products.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">
                        {item.Name} × {item.Quantity}
                      </p>
                      {item.Notes && (
                        <p className="text-sm italic text-gray-500">
                          {item.Notes}
                        </p>
                      )}
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1">
                      Mark Prepared
                    </Button>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Mark Order As Ready
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default KitchenDashboard;
