import { useContext } from 'react'
import { FarmerContext } from '../context/FarmerContext'

export function useFarmer() {
  return useContext(FarmerContext)
}