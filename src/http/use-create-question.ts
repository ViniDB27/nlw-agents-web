import crypto from 'node:crypto'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateQuestionRequest } from '@/http/types/create-question-request.ts'
import type { CreateQuestionResponse } from '@/http/types/create-question-response.ts'
import type { GetRoomQuestionsResponse } from '@/http/types/get-rom-questions-response.ts'

export function useCreateQuestion(roomId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateQuestionRequest) => {
      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      if (!response.ok) {
        throw new Error('Failed to create question')
      }
      const result: CreateQuestionResponse = await response.json()
      return result
    },
    // onSuccess: () => queryClient.invalidateQueries(({ queryKey: ['get-questions', roomId] }))
    onMutate: ({ question }: CreateQuestionRequest) => {
      const questions = queryClient.getQueryData<GetRoomQuestionsResponse>([
        'get-questions',
        roomId
      ])
      const questionsArray = questions ?? []
      const newQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true
      }
      queryClient.setQueryData<GetRoomQuestionsResponse>(
        ['get-questions', roomId],
        [newQuestion, ...questionsArray]
      )
      return { newQuestion, questions }
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData<GetRoomQuestionsResponse>(
        ['get-questions', roomId],
        (questions) => {
          if (!questions) {
            return questions
          }
          if (!context.newQuestion) {
            return questions
          }
          return questions.map((question) => {
            if (question.id === context.newQuestion.id) {
              return {
                ...question,
                id: data.questionId,
                answer: data.answer,
                isGeneratingAnswer: false
              }
            }
            return question
          })
        }
      )
    },
    onError: (_error, _variables, context) => {
      if (context?.questions) {
        queryClient.setQueryData<GetRoomQuestionsResponse>(
          ['get-questions', roomId],
          [...context.questions]
        )
      }
    }
  })
}
