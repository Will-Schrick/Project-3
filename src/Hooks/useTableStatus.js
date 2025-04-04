import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig'; // Ensure the path is correct
import { collection, onSnapshot } from 'firebase/firestore'; // For real-time updates

const useTableStatus = () => {
  const [tableData, setTableData] = useState({
    occupied: 0,
    unoccupied: 0,
  });

  useEffect(() => {
    // Subscribe to the Tables collection in Firestore for real-time updates
    const unsubscribe = onSnapshot(collection(db, 'Tables'), (snapshot) => {
      let occupiedCount = 0;
      let unoccupiedCount = 0;

      snapshot.forEach((doc) => {
        const table = doc.data();
        const isOccupied = table.IsOccupied; // Check the IsOccupied field for the status of the table

        // Count tables based on their occupancy status
        if (isOccupied) {
          occupiedCount++;
        } else {
          unoccupiedCount++;
        }
      });

      // Logging the counts to ensure the data is updating
      console.log('Occupied: ', occupiedCount); // For debugging
      console.log('Unoccupied: ', unoccupiedCount); // For debugging

      // Update the state with the new counts
      setTableData({
        occupied: occupiedCount,
        unoccupied: unoccupiedCount,
      });
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures the effect runs once when component mounts

  // Debugging log to ensure tableData is updated correctly
  useEffect(() => {
    console.log('Updated Table Data:', tableData); // Will log whenever the data changes
  }, [tableData]);

  return tableData;
};

export default useTableStatus;
