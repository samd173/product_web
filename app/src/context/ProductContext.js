import { createContext, useState, useEffect } from "react";
import axios from "axios";

// 🔥 Create Context
export const ProductContext = createContext();

// 🔥 Provider
export const ProductProvider = ({ children }) => {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    // 🔥 API only once
    if (products.length === 0) {
      axios.get("https://backend-project-sa6b.onrender.com/products")
        .then(res => {
          console.log("API CALLED ✅");
          setProducts(res.data);
        })
        .catch(err => console.log("ERROR:", err));
    }

  }, []);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};