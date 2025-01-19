import { Button } from "@/components/ui/button"
import { Mic, StopCircle } from 'lucide-react'

export function RecordButton({ isRecording, onClick }) {
  return (
    <Button onClick={onClick} variant={isRecording ? "destructive" : "default"}>
      {isRecording ? <StopCircle className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
      {isRecording ? "Stop Recording" : "Start Recording"}
    </Button>
  )
}

