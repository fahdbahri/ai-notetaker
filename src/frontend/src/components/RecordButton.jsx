import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import speechToTextUtils from "../TranscribeUtilities";

export function RecordButton({ onTranscriptionUpdate, onSummaryUpdate, onTabChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [interimTranscribedData, setInterimTranscribedData] = useState("");
  const [completeTranscript, setCompleteTranscript] = useState([]);

  function handleDataReceived(data, isFinal) {
    if (isFinal) {
      setInterimTranscribedData("");
      setCompleteTranscript((oldTranscript) => [...oldTranscript, data]); // Add final transcription to complete transcript
      onTranscriptionUpdate((oldData) => [...oldData, data]); // Pass final transcription to parent
    } else {
      setInterimTranscribedData(data);
    }
  }

  function getTranscriptionConfig() {
    return {
      audio: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: selectedLanguage,
      },
      interimResults: true,
    };
  }

  function getFullTranscription() {
    return completeTranscript.join(" "); // Join the complete transcript
  }

  const handleSummarize = async () => {
    try {
      onTabChange("summary");
      const fullText = getFullTranscription();

      console.log("Full summarization", fullText);

      const response = await fetch("http://0.0.0.0:10000/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: fullText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const summaryData = await response.json();
      console.log("Summary Data Received", summaryData);

      const summary =
        summaryData.summary || // Direct summary
        (summaryData.can_summarize
          ? summaryData.message
          : "No summary available");

      if (typeof summary === "string" && summary.trim()) {
        onSummaryUpdate(summary);
      } else {
        console.warn("Received invalid summary:", summaryData);
      }
    } catch (error) {
      console.log("Error generating a summary: ", error);
    }
  };

  function onStart() {
    setIsRecording(true);
    speechToTextUtils.initRecording(
      getTranscriptionConfig(),
      handleDataReceived,
      (error) => {
        console.error("Error when transcribing", error);
      }
    );
  }

  function onStop() {
    setIsRecording(false);
    speechToTextUtils.stopRecording();

    // Add the interim transcribed data to the complete transcript
    if (interimTranscribedData) {
      setCompleteTranscript((oldTranscript) => [...oldTranscript, interimTranscribedData]);
      setInterimTranscribedData(""); // Clear the interim data after adding it to the complete transcript
    }
  }

  return (
    <div className="flex space-x-4 items-center">
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

      <Button onClick={handleSummarize}>Summarize</Button>
    </div>
  );
}