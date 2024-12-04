import { CircleSlash, Droplets, RotateCcw, Sparkles, Scissors, Heart } from 'lucide-react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  analysis: string;
  parameters: {
    scalinessLevel: number;
    moistureContent: number;
  };
  onReset: () => void;
}

export function AnalysisResults({ analysis, parameters, onReset }: AnalysisResultsProps) {
  // Split analysis text into sections based on numbered points
  const sections = analysis.split(/\d\./).filter(Boolean).map(s => s.trim());

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <CircleSlash className="h-5 w-5 text-orange-500" />
            <h3 className="font-medium text-gray-900">Schuppigkeit</h3>
          </div>
          <Progress 
            value={parameters.scalinessLevel} 
            className="mb-2 h-3"
          />
          <p className="text-sm text-gray-600">
            {parameters.scalinessLevel}% Schuppigkeitsgrad
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium text-gray-900">Feuchtigkeit</h3>
          </div>
          <Progress 
            value={parameters.moistureContent} 
            className="mb-2 h-3"
          />
          <p className="text-sm text-gray-600">
            {parameters.moistureContent}% Feuchtigkeitsgehalt
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1">
        {sections.map((section, index) => {
          const cardStyles = cn(
            "p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200",
            index === 0 && "bg-gradient-to-br from-purple-50 to-purple-100",
            index === 1 && "bg-gradient-to-br from-pink-50 to-pink-100",
            index === 2 && "bg-gradient-to-br from-teal-50 to-teal-100"
          );

          return (
            <div key={index} className={cardStyles}>
              {index === 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium text-gray-900">Haartyp und Struktur</h3>
                </div>
              )}
              {index === 1 && (
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <h3 className="font-medium text-gray-900">Haarzustand und Gesundheit</h3>
                </div>
              )}
              {index === 2 && (
                <div className="flex items-center gap-3 mb-4">
                  <Scissors className="h-5 w-5 text-teal-500" />
                  <h3 className="font-medium text-gray-900">Pflegeempfehlungen</h3>
                </div>
              )}
              <p className="text-gray-600 leading-relaxed">
                {section}
              </p>
            </div>
          );
        })}
      </div>

      <Button
        onClick={onReset}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        size="lg"
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Neue Analyse starten
      </Button>
    </div>
  );
}