'use client';

import { useState, useRef } from 'react';
import { Video, Square, Pause, Play } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface InteractionRecorderProps {
  variant?: 'active' | 'idle';
  onRecordingStart?: () => void;
  onRecordingStop?: (recordingData: any) => void;
}

export function InteractionRecorder({ 
  variant = 'idle', 
  onRecordingStart,
  onRecordingStop 
}: InteractionRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      streamRef.current = stream;
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Permission denied:', error);
      alert('Camera and microphone permissions are required for recording.');
      return false;
    }
  };

  const startRecording = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    if (!streamRef.current) return;

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        onRecordingStop?.(
          {
            blob,
            url,
            duration: recordingTime,
            timestamp: new Date(),
          }
        );
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      onRecordingStart?.();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      setHasPermission(false);
    }
  };

  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`card-content ${variant === 'active' ? 'border-2 border-accent' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-textPrimary">
          Interaction Recorder
        </h3>
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="recording-indicator"></div>
            <span className="text-danger font-medium">REC</span>
          </div>
        )}
      </div>

      {/* Recording Status */}
      <div className="text-center mb-6">
        {isRecording ? (
          <div className="space-y-2">
            <div className="text-2xl font-mono text-textPrimary">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-textSecondary">
              {isPaused ? 'Recording Paused' : 'Recording in Progress'}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Video className="w-12 h-12 text-textSecondary mx-auto" />
            <div className="text-sm text-textSecondary">
              Ready to record interaction
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="btn-danger flex items-center space-x-2"
          >
            <Video className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        ) : (
          <>
            <button
              onClick={togglePause}
              className="btn-secondary flex items-center space-x-2"
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </>
              )}
            </button>
            
            <button
              onClick={stopRecording}
              className="btn-primary flex items-center space-x-2"
            >
              <Square className="w-5 h-5" />
              <span>Stop</span>
            </button>
          </>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-primary/30 rounded-md border-l-4 border-accent">
        <p className="text-xs text-textSecondary">
          <strong>Note:</strong> Recording laws vary by state. Ensure you understand 
          your local laws regarding recording police interactions.
        </p>
      </div>
    </div>
  );
}
