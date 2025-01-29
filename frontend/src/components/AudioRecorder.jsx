import { useState } from 'react';
import { Card, CardContent } from "../components/ui/card";
import { RecordButton } from './RecordButton';
import { CaptionsAndSummary } from './CaptionSummary';

export default function AudioRecorder() {
  const [transcription, setTranscription] = useState([]);
  const [activeTab, setActiveTab] = useState("captions");
  const [summary, setSummary] = useState("");

  const handleTranscription = (text) => {
    setTranscription(text);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSummaryUpdate = (newSummary) => {
    setSummary(newSummary);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-center mt-4">
              <RecordButton 
                onTranscriptionUpdate={handleTranscription}
                onTabChange={handleTabChange}
                onSummaryUpdate={handleSummaryUpdate}
              />
            </div>
          </CardContent>
        </Card>
        <CaptionsAndSummary 
          currentCaption={transcription.join(' ')}
          summary={summary}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </main>
    </div>
  );
}