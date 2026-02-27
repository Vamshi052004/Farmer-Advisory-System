import { useContext } from "react";
import { FarmerContext } from "../context/FarmerContext";

export function useFarmer() {
  const context = useContext(FarmerContext);

  if (!context) {
    throw new Error("useFarmer must be used within FarmerProvider");
  }

  return context;
}