import { useState, useEffect } from "react";
import { FarmerContext } from "./FarmerContext";

export function FarmerProvider({ children }) {
  const [farmer, setFarmer] = useState(null);

  useEffect(() => {
    const storedFarmer = localStorage.getItem("farmer");
    if (storedFarmer) {
      try {
        setFarmer(JSON.parse(storedFarmer));
      } catch {
        localStorage.removeItem("farmer");
      }
    }
  }, []);

  const updateFarmer = (data) => {
    setFarmer(data);
    localStorage.setItem("farmer", JSON.stringify(data));
  };

  return (
    <FarmerContext.Provider value={{ farmer, updateFarmer }}>
      {children}
    </FarmerContext.Provider>
  );
}