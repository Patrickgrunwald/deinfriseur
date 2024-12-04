const API_KEY = 'AIzaSyBzlzqA6bJZebAsnnfG3gAvXunbOnql8II';

export interface HairAnalysisParams {
  photo: string;
}

export async function analyzeHairPhoto(params: HairAnalysisParams) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          { 
            parts: [
              { text: "Analysiere dieses Haarbild und erstelle eine detaillierte Analyse. Bitte beschreibe nur die Haare, nicht die Person. Gib die Analyse in folgenden Kategorien aus, ohne Sternchen oder andere Sonderzeichen zu verwenden:\n\n1. Haartyp und Struktur (inkl. geschätzter Feuchtigkeitsgehalt in Prozent)\n2. Haarzustand und Gesundheit (inkl. geschätzte Schuppigkeit in Prozent)\n3. Pflegeempfehlungen\n\nWichtig: Gib bei der Analyse auch konkrete Prozentangaben für Feuchtigkeitsgehalt und Schuppigkeit an." },
              { inlineData: { mimeType: "image/jpeg", data: params.photo } }
            ] 
          } 
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          stopSequences: ["*"]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Details:', errorData);
      throw new Error('Fehler bei der Haaranalyse');
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Ungültiges Antwortformat von der API');
    }
    
    const analysisText = data.candidates[0].content.parts[0].text;
    
    // Extract moisture and scaliness percentages from the analysis text
    const moistureMatch = analysisText.match(/Feuchtigkeitsgehalt[^0-9]*?(\d+)/i);
    const scalinessMatch = analysisText.match(/Schuppigkeit[^0-9]*?(\d+)/i);
    
    const moistureContent = moistureMatch ? parseInt(moistureMatch[1]) : 50;
    const scalinessLevel = scalinessMatch ? parseInt(scalinessMatch[1]) : 50;

    return {
      analysis: analysisText,
      parameters: {
        scalinessLevel,
        moistureContent
      }
    };
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error 
      ? error.message 
      : 'Fehler bei der Haaranalyse. Bitte versuchen Sie es erneut.');
  }
}