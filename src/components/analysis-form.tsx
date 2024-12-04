import { Button } from "@/components/ui/button"
import { analyzeHairPhoto } from "@/lib/api"
import { useState } from "react"
import { Progress } from "./ui/progress"
import { Sparkles } from "lucide-react"

interface AnalysisFormProps {
  photoBase64: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onAnalysisComplete: (results: any) => void;
}

export function AnalysisForm({ photoBase64, isLoading, setIsLoading, onAnalysisComplete }: AnalysisFormProps) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function startAnalysis() {
    setIsLoading(true);
    setProgress(0);
    setError(null);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const results = await analyzeHairPhoto({
        photo: photoBase64,
      });

      setProgress(100);
      if (results?.analysis) {
        onAnalysisComplete({
          analysis: results.analysis,
          parameters: results.parameters
        });
      } else {
        throw new Error('Ungültige Analyseergebnisse erhalten');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Fehler bei der Analyse. Bitte versuchen Sie es erneut.');
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {progress > 0 && progress < 100 ? (
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            <p className="text-sm text-gray-600">KI analysiert Ihre Haare...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Button 
            onClick={startAnalysis}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-6 text-lg font-medium" 
            disabled={isLoading || progress > 0}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {isLoading ? 'Wird verarbeitet...' : 'KI-Analyse starten'}
          </Button>
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-4 rounded-lg border border-red-100">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}