import { Button } from "@/components/ui/button"
import { Video, Users } from 'lucide-react'

export function Header() {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Audio Recorder</h1>
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Users className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

