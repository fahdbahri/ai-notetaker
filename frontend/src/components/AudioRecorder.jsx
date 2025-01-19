
import { useState, useEffect } from 'react'
import { Card, CardContent } from "../components/ui/card"
import { Sidebar } from './SideBar'
import { Header } from './Header'
import { AudioVisualizer } from './AudioVisualize'
import { RecordButton } from './RecordButton'
import { CaptionsAndSummary } from './CaptionSummary'

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentCaption, setCurrentCaption] = useState("")

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setCurrentCaption(prev => prev + " " + generateRandomWord())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRecording])

  const generateRandomWord = () => {
    const words = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog']
    return words[Math.floor(Math.random() * words.length)]
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
        <Header />
        <Card className="mb-6">
          <CardContent className="p-4">
            <AudioVisualizer isRecording={isRecording} />
            <div className="flex justify-center mt-4">
              <RecordButton isRecording={isRecording} onClick={toggleRecording} />
            </div>
          </CardContent>
        </Card>
        <CaptionsAndSummary currentCaption={currentCaption} />
      </main>
    </div>
  )
}

