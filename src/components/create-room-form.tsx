import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useCreateRoom } from '@/http/use-create-room.ts'

const createRoomSchema = z.object({
  name: z.string().min(3, 'O nome da sala é obrigatório pelo menos 3 caracteres'),
  description: z.string().optional()
})

type CreateRoomFormData = z.infer<typeof createRoomSchema>

export function CreateRoomForm() {
  const { mutateAsync: createRoom } = useCreateRoom()

  const createRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  async function handleCreateRoom({ name, description }: CreateRoomFormData) {
    await createRoom({ name, description })
    createRoomForm.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar sala</CardTitle>
        <CardDescription>Crie uma nova sala para começar a fazer perguntas e receber respostas da I.A</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...createRoomForm}>
          <form className="flex flex-col gap-4" onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}>
            <FormField control={createRoomForm.control} name="name" render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Nome da sala</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o noemda sala..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }} />
            <FormField control={createRoomForm.control} name="description" render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }} />
            <Button type="submit" className="w-full">Criar sala</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}