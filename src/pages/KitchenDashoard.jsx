import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import LogoutButton from '../components/LogoutButton';
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
  getDoc,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [tablesMap, setTablesMap] = useState({});

  useEffect(() => {
    const fetchTables = async () => {
      const snapshot = await collection(db, 'Tables');
      const unsubscribe = onSnapshot(snapshot, (querySnapshot) => {
        const tableData = {};
        querySnapshot.forEach((doc) => {
          tableData[doc.id] = doc.data().Name;
        });
        setTablesMap(tableData);
      });
      return unsubscribe;
    };
    fetchTables();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'Orders'), where('Status', '==', 'Pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.CreatedAt.toDate() - b.CreatedAt.toDate());
      setOrders(data);
    });
    return () => unsubscribe();
  }, []);

  const toggleItemPrepared = async (orderId, index) => {
    const orderRef = doc(db, 'Orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return;

    const orderData = orderSnap.data();
    const updatedProducts = [...orderData.Products];
    updatedProducts[index].Prepared = !updatedProducts[index].Prepared;

    await updateDoc(orderRef, {
      Products: updatedProducts,
    });
  };

  const markOrderAsReady = async (orderId) => {
    const orderRef = doc(db, 'Orders', orderId);
    await updateDoc(orderRef, {
      Status: 'Ready',
    });
  };

  return (
    <>
      <Navbar />
      <div className="pt-32 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-lg p-4 border border-slate-200"
          >
            <div className="mb-2">
              <h2 className="font-bold text-lg">
                🧾 Order ID: <span className="text-sm">{order.id}</span>
              </h2>
              <Badge className="mt-1">
                Table: {tablesMap[order.Table] || 'Loading...'}
              </Badge>
            </div>

            <ul className="divide-y divide-slate-200">
              {order.Products.map((item, index) => (
                <li
                  key={index}
                  className="py-2 flex justify-between items-start"
                >
                  <div>
                    <p
                      className={`font-medium ${
                        item.Prepared ? 'line-through text-green-500' : ''
                      }`}
                    >
                      {item.Name} × {item.Quantity}
                    </p>
                    {item.Notes && (
                      <p className="text-sm italic text-gray-500">
                        {item.Notes}
                      </p>
                    )}
                  </div>
                  <Button
                    variant={item.Prepared ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => toggleItemPrepared(order.id, index)}
                  >
                    {item.Prepared ? 'Undo' : 'Mark Prepared'}
                  </Button>
                </li>
              ))}
            </ul>

            <Button
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => markOrderAsReady(order.id)}
            >
              Mark Order As Ready
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}

export default KitchenDashboard;
