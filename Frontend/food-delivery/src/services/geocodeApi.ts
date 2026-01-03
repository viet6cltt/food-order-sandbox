import apiClient from './apiClient'

export type GeocodeResult = {
  lat: number
  lng: number
  formatted?: string
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const res = await apiClient.post('/geocode', { address })
  return (res.data?.data ?? res.data) as GeocodeResult
}
