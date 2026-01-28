import React, { createContext, useState } from "react";

export const BagContext = createContext();

export function BagProvider({ children }) {
  const [bagItems, setBagItems] = useState([]);

  // ADD TO BAG
  const addToBag = (item, qty = 1) => {
    if (!item || !item.id) return;

    setBagItems((prev) => {
      const exists = prev.find(
        (el) => el.id === item.id && el.selectedSize === item.selectedSize
      );

      if (exists) {
        return prev.map((el) =>
          el.id === item.id && el.selectedSize === item.selectedSize
            ? { ...el, qty: el.qty + qty }
            : el
        );
      }

      return [...prev, { ...item, qty }];
    });
  };

  // CHANGE SIZE IN BAG
  const updateSize = (id, oldSize, newSize) => {
    setBagItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === oldSize
          ? { ...item, selectedSize: newSize }
          : item
      )
    );
  };

  // INCREASE QTY
  const increaseQty = (id, size) => {
    setBagItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === size
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  // DECREASE QTY
  const decreaseQty = (id, size) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.selectedSize === size
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // REMOVE FROM BAG
  const removeFromBag = (id, size) => {
  setBagItems(prev =>
    prev.filter(item => !(item.id === id && item.selectedSize === size))
  );
};

  return (
    <BagContext.Provider
      value={{
        bagItems,
        addToBag,
        increaseQty,
        decreaseQty,
        removeFromBag,
        updateSize,
      }}
    >
      {children}
    </BagContext.Provider>
  );
}
