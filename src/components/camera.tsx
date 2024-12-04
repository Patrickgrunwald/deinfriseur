import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from './ui/button';
import { Camera, Upload, FlipHorizontal } from 'lucide-react';
import { getBase64FromWebcam } from '@/lib/utils';

interface CameraProps {
  onCapture: (base64Image: string) => void;
}

export function CameraComponent({ onCapture }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const toggleCamera = useCallback(() => {
    setFacingMode(current => current === 'user' ? 'environment' : 'user');
  }, []);


  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Convert data URL to blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      // Convert blob to base64
      const base64 = await getBase64FromWebcam(blob);
      onCapture(base64);
    }
    setError(null);
  }, [webcamRef, onCapture]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await getBase64FromWebcam(file);
        onCapture(base64);
        setError(null);
      } catch (err) {
        setError('Failed to process the image. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {isCameraActive ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: facingMode
            }}
            className="rounded-lg shadow-lg w-full max-w-2xl"
            onUserMediaError={() => {
              setError('Kein Zugriff auf die Kamera. Bitte überprüfen Sie die Berechtigungen.');
              setIsCameraActive(false);
            }}
          />
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <Button onClick={capture} size="lg">
              <Camera className="mr-2 h-4 w-4" />
              Foto aufnehmen
            </Button>
            <Button 
              onClick={toggleCamera}
              variant="secondary"
              size="lg"
            >
              <FlipHorizontal className="mr-2 h-4 w-4" />
              {facingMode === 'user' ? 'Zur Rückkamera wechseln' : 'Zur Frontkamera wechseln'}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button 
            onClick={() => setIsCameraActive(true)} 
            size="lg"
          >
            <Camera className="mr-2 h-4 w-4" />
            Kamera starten
          </Button>
          <label>
            <Button asChild>
              <div className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Foto hochladen
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </Button>
          </label>
        </div>
      )}
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg w-full">
          {error === 'Failed to access camera. Please check permissions.' 
            ? 'Kein Zugriff auf die Kamera. Bitte überprüfen Sie die Berechtigungen.' 
            : 'Fehler beim Verarbeiten des Bildes. Bitte versuchen Sie es erneut.'}
        </div>
      )}
    </div>
  );
}