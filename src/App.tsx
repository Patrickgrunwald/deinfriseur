import { useState } from 'react'
import { CameraComponent } from './components/camera'
import { AnalysisForm } from './components/analysis-form'
import { AnalysisResults } from './components/analysis-results'

function App() {
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">KI-Haaranalyse</h1>
          <p className="text-lg text-gray-600">
            Erhalten Sie personalisierte Haarpflegeempfehlungen durch KI-Analyse
          </p>
        </header>

        <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg">
          {!photoBase64 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Foto aufnehmen oder hochladen</h2>
              <CameraComponent 
                onCapture={(base64) => {
                  setIsLoading(true);
                  setPhotoBase64(base64);
                  setIsLoading(false);
                }} 
              />
            </div>
          ) : !analysisResults ? (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-800">Überprüfen Sie Ihr Foto</h2>
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={`data:image/jpeg;base64,${photoBase64}`}
                  alt="Aufgenommenes Haar"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <AnalysisForm
                photoBase64={photoBase64}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onAnalysisComplete={setAnalysisResults}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Analyseergebnisse</h2>
              <AnalysisResults
                analysis={analysisResults.analysis}
                parameters={analysisResults.parameters}
                onReset={() => {
                  setPhotoBase64(null);
                  setAnalysisResults(null);
                  setIsLoading(false);
                }}
              />
            </div>
          )}
          {isLoading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-700">Wird verarbeitet...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App