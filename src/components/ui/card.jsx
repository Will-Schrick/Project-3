// src/components/ui/card.jsx

import React from 'react';

export const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-lg p-6">{children}</div>
);

export const CardHeader = ({ children }) => (
  <div className="border-b pb-4 mb-4">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-2xl font-bold">{children}</h3>
);

export const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-600">{children}</p>
);

export const CardContent = ({ children }) => (
  <div className="mt-4">{children}</div>
);

export const CardFooter = ({ children }) => (
  <div className="mt-6 border-t pt-4">{children}</div>
);
