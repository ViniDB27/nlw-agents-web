import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

type GetRoomsResponse = Array<{
  id: string
  name: string
}>

export function CreateRoom() {
  const { data, isLoading } = useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const resnponse = await fetch('http://localhost:3333/rooms')
      const result: GetRoomsResponse = await resnponse.json()
      return result
    },
  })

  return (
    <div>
      {isLoading && <p>Carregando...</p>}
      <div className="flex flex-col gap-1">
        {data?.map((room) => (
          <Link key={room.id} to={`/room/${room.id}`}>
            {room.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
