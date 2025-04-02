import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';

function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [tablesMap, setTablesMap] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'Orders'), async (snapshot) => {
      const ordersData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const order = { id: docSnap.id, ...docSnap.data() };
          return order;
        })
      );
      setOrders(
        ordersData.sort((a, b) => a.CreatedAt?.toDate() - b.CreatedAt?.toDate())
      );
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchTables = async () => {
      const tablesSnapshot = await getDocs(collection(db, 'Tables'));
      const tableData = {};
      tablesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        tableData[doc.id] = data.Number;
      });
      setTablesMap(tableData);
    };
    fetchTables();
  }, []);

  const markItemPrepared = async (orderId, index) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const updatedProducts = [...order.Products];
    updatedProducts[index].Prepared = true;

    await updateDoc(doc(db, 'Orders', orderId), {
      Products: updatedProducts,
    });
  };

  const markOrderPrepared = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const updatedProducts = order.Products.map((p) => ({
      ...p,
      Prepared: true,
    }));
    await updateDoc(doc(db, 'Orders', orderId), {
      Products: updatedProducts,
      Status: 'Completed',
    });
  };

  const filteredOrders = orders.filter((order) =>
    showCompleted ? order.Status === 'Completed' : order.Status !== 'Completed'
  );

  return (
    <>
      <Navbar />
      <div className="pt-40 px-4 max-w-screen-2xl mx-auto">
        <div className="mb-6 flex justify-center">
          <Button
            onClick={() => setShowCompleted(!showCompleted)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {showCompleted ? 'Show Active Orders' : 'Show Completed Orders'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 shadow bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Table: {tablesMap[order.Table] ?? 'Loading...'} — Order ID:{' '}
                  {order.id}
                </h2>
                <ul className="space-y-2">
                  {order.Products.map((product, index) => (
                    <li
                      key={index}
                      className="p-2 rounded border flex justify-between items-center"
                    >
                      <div>
                        <strong>
                          {product.Quantity}× {product.Name}
                        </strong>
                        {product.Notes && (
                          <p className="text-sm text-gray-600 italic">
                            {product.Notes}
                          </p>
                        )}
                      </div>
                      {!product.Prepared && (
                        <Button
                          size="sm"
                          onClick={() => markItemPrepared(order.id, index)}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          Mark Prepared
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {!order.Products.every((p) => p.Prepared) ? null : (
                <Button
                  onClick={() => markOrderPrepared(order.id)}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Mark Order Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default KitchenDashboard;
