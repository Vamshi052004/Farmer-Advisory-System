import { createContext, useState } from 'react'

export const FarmerContext = createContext()

export function FarmerProvider({ children }) {
  const [farmer, setFarmer] = useState(null)

  const updateFarmer = (data) => setFarmer(data)

  return (
    <FarmerContext.Provider value={{ farmer, updateFarmer }}>
      {children}
    </FarmerContext.Provider>
  )
}