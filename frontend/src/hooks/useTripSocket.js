import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useTripSocket = (tripId, onTripUpdate) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Establish connection to the server
    socketRef.current = io('http://127.0.0.1:5000');

    // Event listener for when the connection is established
    socketRef.current.on('connect', () => {
      console.log('Socket connected! Joining room:', tripId);
      socketRef.current.emit('join_trip_room', { trip_id: tripId });
    });

    // Event listener for receiving updates for this trip
    socketRef.current.on('trip_updated', (updateData) => {
      console.log('Received FULL trip update from server:', updateData);
      // Call the function passed from the component to update its state
      onTripUpdate(updateData);
    });

    // Clean up by disconnecting when the component is no longer on screen
    return () => {
      console.log('Disconnecting socket...');
      socketRef.current.disconnect();
    };
  }, [tripId, onTripUpdate]); // Dependencies for the effect

  // This hook doesn't need to return anything for now
};