import React from "react";
import { useEffect } from 'react';

export const UserContext = React.createContext(null);



export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div className={`fixed top-5 right-5 ${colors[type]} px-6 py-4 rounded-lg shadow-lg transform transition duration-300 ease-in-out`}>
      {message}
    </div>
  );
}
