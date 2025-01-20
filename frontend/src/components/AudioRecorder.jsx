import { useState, useEffect } from 'react'
import { Card, CardContent } from "../components/ui/card"
import { Sidebar } from './SideBar'
import { RecordButton } from './RecordButton'
import { CaptionsAndSummary } from './CaptionSummary'

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentCaption, setCurrentCaption] = useState("")

  // Add handler for new transcriptions
  const handleTranscription = (text) => {
    setCurrentCaption(prev => prev + " " + text);
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setCurrentCaption("")
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-center mt-4">
              <RecordButton 
                isRecording={isRecording} 
                onTranscription={handleTranscription} 
                onClick={toggleRecording} 
              />
            </div>
          </CardContent>
        </Card>
        <CaptionsAndSummary currentCaption={currentCaption} />
      </main>
    </div>
  )
}