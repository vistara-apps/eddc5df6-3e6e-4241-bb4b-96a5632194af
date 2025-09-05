'use client';

import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Square, Play, Pause } from 'lucide-react';

interface InteractionRecorderProps {
  variant?: 'active' | 'idle';
  onRecordingStart?: () => void;
  onRecordingStop?: (recordingData: Blob) => void;
}

export function InteractionRecorder({ 
  variant = 'idle', 
  onRecordingStart, 
  onRecordingStop 
}: InteractionRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video'>('audio');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkPermissions();
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const audioPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      const videoPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      setHasPermissions(
        audioPermission.state === 'granted' || 
        videoPermission.state === 'granted'
      );
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestPermissions = async (type: 'audio' | 'video') => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasPermissions(true);
      return stream;
    } catch (error) {
      console.error('Permission denied:', error);
      alert('Camera/microphone permission is required for recording.');
      return null;
    }
  };

  const startRecording = async () => {
    const stream = streamRef.current || await requestPermissions(recordingType);
    if (!stream) return;

    try {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { 
          type: recordingType === 'video' ? 'video/webm' : 'audio/webm' 
        });
        onRecordingStop?.(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      onRecordingStart?.();

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check your device permissions.');
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
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
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

  const isActive = variant === 'active' || isRecording;

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-textPrimary mb-2">
          Interaction Recorder
        </h3>
        <p className="text-sm text-textSecondary">
          Discreetly record your interaction for safety and documentation
        </p>
      </div>

      {/* Recording Type Selection */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setRecordingType('audio')}
          disabled={isRecording}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
            recordingType === 'audio'
              ? 'bg-accent text-white'
              : 'bg-surface text-textSecondary hover:text-textPrimary'
          }`}
        >
          <Mic className="h-4 w-4" />
          <span>Audio</span>
        </button>
        <button
          onClick={() => setRecordingType('video')}
          disabled={isRecording}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
            recordingType === 'video'
              ? 'bg-accent text-white'
              : 'bg-surface text-textSecondary hover:text-textPrimary'
          }`}
        >
          <Video className="h-4 w-4" />
          <span>Video</span>
        </button>
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${
            isPaused ? 'bg-orange-500/20 text-orange-400' : 'bg-danger/20 text-danger'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isPaused ? 'bg-orange-400' : 'bg-danger animate-pulse'
            }`} />
            <span className="text-sm font-medium">
              {isPaused ? 'PAUSED' : 'RECORDING'}
            </span>
          </div>
          <div className="text-2xl font-mono text-textPrimary">
            {formatTime(recordingTime)}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 bg-danger text-white px-6 py-3 rounded-lg font-medium hover:bg-danger/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {recordingType === 'video' ? (
              <Video className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            <span>Start Recording</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={pauseRecording}
              className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-600 transition-all duration-200"
            >
              {isPaused ? (
                <Play className="h-5 w-5" />
              ) : (
                <Pause className="h-5 w-5" />
              )}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200"
            >
              <Square className="h-5 w-5" />
              <span>Stop</span>
            </button>
          </div>
        )}
      </div>

      {/* Permissions Notice */}
      {!hasPermissions && (
        <div className="bg-orange-500/20 border border-orange-500/30 rounded-md p-4">
          <p className="text-sm text-orange-400 text-center">
            Camera and microphone permissions are required for recording. 
            Click "Start Recording" to grant permissions.
          </p>
        </div>
      )}

      {/* Legal Notice */}
      <div className="border-t border-gray-700 pt-4">
        <p className="text-xs text-textSecondary text-center">
          Recording laws vary by state. In some states, all parties must consent to recording. 
          You are responsible for complying with local laws.
        </p>
      </div>
    </div>
  );
}
