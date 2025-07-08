import { useQuery } from '@tanstack/react-query'
import type { GetRoomsResponse } from '@/http/types/get-roms-response.ts'

export function useRooms() {
  return useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const resnponse = await fetch('http://localhost:3333/rooms')
      const result: GetRoomsResponse = await resnponse.json()
      return result
    }
  })
}