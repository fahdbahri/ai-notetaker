import { useState, useEffect } from 'react'
import { Card, CardContent } from "../components/ui/card"
import { RecordButton } from './RecordButton'
import { CaptionsAndSummary } from './CaptionSummary'

export default function AudioRecorder() {

  const [transcription, setTranscription] = useState("");


  const handleTranscription = (text) => {
    setTranscription(text);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-center mt-4">
              <RecordButton onTranscriptionUpdate={handleTranscription} />
            </div>
          </CardContent>
        </Card>
        <CaptionsAndSummary currentCaption={transcription} />
      </main>
    </div>
  )
}