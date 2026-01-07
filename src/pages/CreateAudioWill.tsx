import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  MicOff,
  Pause,
  Play,
  RotateCcw,
  Check,
  Shield,
  FileText,
} from "lucide-react";
import Header from "@/components/layout/Header";

const CreateAudioWill = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setHasRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setHasRecording(false);
  };

  const prompts = [
    "Start by introducing yourself and stating your full name and date.",
    "Describe your wishes for your personal belongings.",
    "Specify any special instructions for your digital assets.",
    "Share any final messages for your loved ones.",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Back Button */}
          <Link to="/create" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Method Selection
          </Link>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`progress-step ${step === 2 ? "progress-step-active" : step < 2 ? "progress-step-completed" : "progress-step-pending"}`}>
                  {step < 2 ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 4 && <div className="w-8 h-0.5 bg-border" />}
              </div>
            ))}
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="heading-section text-foreground mb-4">
              Record Your Audio Will
            </h1>
            <p className="body-large max-w-xl mx-auto">
              Speak naturally and share your wishes. We'll transcribe everything for you.
            </p>
          </motion.div>

          {/* Recording Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-elevated text-center mb-8"
          >
            {/* Recording Button */}
            <div className="relative inline-block mb-6">
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? "bg-destructive recording-pulse"
                    : "bg-gradient-to-br from-gold to-gold-light shadow-gold hover:scale-105"
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-12 h-12 text-destructive-foreground" />
                ) : (
                  <Mic className="w-12 h-12 text-primary" />
                )}
              </button>
            </div>

            {/* Timer */}
            <p className="font-mono text-4xl font-semibold text-foreground mb-4">
              {formatTime(recordingTime)}
            </p>

            {/* Status Text */}
            <p className="text-muted-foreground mb-6">
              {isRecording 
                ? isPaused 
                  ? "Recording paused" 
                  : "Recording in progress..."
                : hasRecording 
                  ? "Recording complete" 
                  : "Tap to start recording"
              }
            </p>

            {/* Controls */}
            {(isRecording || hasRecording) && (
              <div className="flex items-center justify-center gap-4">
                {isRecording && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePauseResume}
                    className="gap-2"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </Button>
              </div>
            )}
          </motion.div>

          {/* Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-elevated mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-gold" />
              <h3 className="font-serif text-lg font-semibold text-foreground">Suggested Topics</h3>
            </div>
            <ul className="space-y-3">
              {prompts.map((prompt, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  {prompt}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <Link to="/create">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Encrypted
              </p>
              <Link to="/assets">
                <Button variant="gold" className="gap-2" disabled={!hasRecording}>
                  Continue to Assets
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreateAudioWill;
