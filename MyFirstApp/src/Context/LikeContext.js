// src/Context/LikeContext.js
import React, { createContext, useState } from "react";

export const LikeContext = createContext();

export function LikeProvider({ children }) {
  const [likedItems, setLikedItems] = useState([]);

 // LikeContext.js
const toggleLike = (product, category) => {
  const exists = likedItems.find((p) => p.id === product.id);

  if (exists) {
    setLikedItems(prev => prev.filter(p => p.id !== product.id));
  } else {
    // STORE THE CATEGORY HERE
    setLikedItems(prev => [...prev, { ...product, category }]);
  }
};


  const isLiked = (id) => likedItems.some((p) => p.id === id);

  return (
    <LikeContext.Provider value={{ likedItems, toggleLike, isLiked }}>
      {children}
    </LikeContext.Provider>
  );
}
