import Navbar from '../components/Navbar';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts'; // Import Pie chart from recharts
import { Line } from 'react-chartjs-2'; // Importing Line chart from react-chartjs-2
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import useTableStatus from '../Hooks/useTableStatus'; // Import the custom hook

// Registering necessary components for Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [orderData, setOrderData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [selectedDays, setSelectedDays] = useState(7); // Default to 7 days

  // Fetch order data from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, 'Orders'));
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrderData(orders);
      setTotalOrders(orders.length);
      setCompletedOrders(
        orders.filter((order) => order.Status === 'Completed').length
      );
      setActiveOrders(
        orders.filter((order) => order.Status !== 'Completed').length
      );
    };

    fetchOrders();
  }, []);

  // Function to filter order totals by selected days
  const getFilteredOrderData = (days) => {
    const today = new Date();
    const filteredOrders = orderData.filter((order) => {
      const orderDate = new Date(order.CreatedAt.seconds * 1000); // Convert Firebase Timestamp to JS Date
      const differenceInDays = Math.floor(
        (today - orderDate) / (1000 * 60 * 60 * 24)
      );
      return differenceInDays <= days;
    });

    return filteredOrders;
  };

  // Prepare data for the Line Chart based on the selected days
  const chartData = getFilteredOrderData(selectedDays).map((order) => ({
    date: order.CreatedAt.toDate().toLocaleDateString(),
    total: parseFloat(order.Total.slice(1)), // Assuming Total is like "€100"
  }));

  // Chart.js data structure
  const data = {
    labels: chartData.map((data) => data.date),
    datasets: [
      {
        label: 'Order Totals (€)',
        data: chartData.map((data) => data.total),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Order Totals for Last ${selectedDays} Days`,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total (€)',
        },
      },
    },
  };

  // Use the custom hook to get real-time table occupancy data
  const { occupied, unoccupied } = useTableStatus(); // Hook to get table data

  // Pie chart data for occupied vs unoccupied tables
  const chartDataPie = [
    { name: 'Occupied', value: occupied, fill: '#34D399' }, // Green (Occupied)
    { name: 'Unoccupied', value: unoccupied, fill: '#F97316' }, // Orange (Unoccupied)
  ];

  return (
    <div>
      <Navbar />
      <div className="pt-40 text-center px-5 sm:px-10">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg">
          Manage the restaurant settings, users, and reports here.
        </p>

        <div className="mt-6 space-y-6">
          {/* Table Occupancy Pie Chart */}
          <Card>
            <CardHeader className="items-center pb-0">
              <CardTitle>Table Occupancy</CardTitle>
              <CardDescription>Occupied vs Unoccupied Tables</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              {/* Pie chart container */}
              <div className="mx-auto max-h-[250px] max-w-[250px] md:max-h-[300px] md:max-w-[300px] pb-0">
                <PieChart width={300} height={300}>
                  <Pie
                    data={chartDataPie}
                    dataKey="value"
                    label
                    nameKey="name"
                    outerRadius={120} // Optional: Adjust size of the pie chart
                    stroke="#fff" // Optional: To add a white border around each section
                  >
                    {chartDataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              {/* Display table counts below the pie chart */}
              <div className="mt-2 text-lg">
                <p>Occupied: {occupied}</p>
                <p>Unoccupied: {unoccupied}</p>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="leading-none text-muted-foreground">
                Real-time table occupancy data
              </div>
            </CardFooter>
          </Card>

          {/* Orders Overview */}
          <div className="mt-6">
            <div className="mb-6">
              <Select
                value={selectedDays.toString()}
                onValueChange={(value) => setSelectedDays(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`Select Last ${selectedDays} Days`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 1 Day</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="14">Last 14 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders Overview */}
            <div className="flex justify-between mb-6 flex-wrap gap-4">
              <div className="flex-1 sm:flex-none">
                <h3 className="text-xl">Total Orders: {totalOrders}</h3>
              </div>
              <div className="flex-1 sm:flex-none">
                <h3 className="text-xl">Active Orders: {activeOrders}</h3>
              </div>
              <div className="flex-1 sm:flex-none">
                <h3 className="text-xl">Completed Orders: {completedOrders}</h3>
              </div>
            </div>

            {/* Line Chart for Order Totals */}
            <Card>
              <CardHeader>
                <CardTitle>Order Totals</CardTitle>
                <CardDescription>
                  Showing order totals for the last {selectedDays} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full max-w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
                  <Line data={data} options={options} />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      Trending up by 5.2% this month
                    </div>
                    <div className="flex items-center gap-2 leading-none text-muted-foreground">
                      {selectedDays} Days Data
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
