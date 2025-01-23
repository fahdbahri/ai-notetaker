import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

export function RecordButton({ onTranscriptionUpdate }) {
  const [isRecording, setIsRecording] = useState(false);
  const [fullTranscript, setFullTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

  function onStart() {
    setIsRecording(true);
    const SpeachRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const newRecognition = new SpeachRecognition();

    newRecognition.intermResults = true;
    newRecognition.continuous = true;

    newRecognition.onresult = async function (event) {
      const finalTranscripts = Array.from(event.results)
        .filter((result) => result.isFinal)
        .map((result) => result[0].transcript);

      // If there are final transcripts, update the full transcript

      if (finalTranscripts.length > 0) {
        const updatedTranscript =
          fullTranscript + finalTranscripts.join(" ") + " ";

        setFullTranscript(updatedTranscript);

        onTranscriptionUpdate(updatedTranscript);
      }
    };

    newRecognition.onerror = function (event) {
      console.log("Speach recognition error detected: " + event.error);
    };

    newRecognition.start();
    setRecognition(newRecognition);
  }
  function onStop() {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  }

  async function summarizeLecture(){
    try {
      const response = await fetch("http://localhost:8000/summarize", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({transcript: fullTranscript}),
      });

      if (!response.ok){
        console.log("Network response was not OK")

      }

      const data = await response.json();
      setSummary(data.summary);

    } catch (error) {
      console.error("Error summarizing lecture:", error);
    }
  }

  return (
    <>
      <Button
        onClick={isRecording ? onStop : onStart}
        variant={isRecording ? "destructive" : "default"}
      >
        {isRecording ? (
          <StopCircle className="mr-2 h-4 w-4" />
        ) : (
          <Mic className="mr-2 h-4 w-4" />
        )}
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      <Button onClick={summarizeLecture}>Summarize Lecture</Button>
    </>
  );
}
