import { useQuery } from '@tanstack/react-query'
import type { GetRoomQuestionsResponse } from '@/http/types/get-rom-questions-response.ts'

export function useRoomQuestions(roomId: string) {
  return useQuery({
    queryKey: ['get-questions', roomId],
    queryFn: async () => {
      const resnponse = await fetch(`http://localhost:3333/rooms/${roomId}/questions`)
      const result: GetRoomQuestionsResponse = await resnponse.json()
      return result
    }
  })
}