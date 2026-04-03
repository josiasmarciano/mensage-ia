import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { category, relationship, tone, length, context } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) throw new Error('API Key não configurada.')

    // Prompt refinado e mais direto
    const prompt = `
      Crie 3 mensagens de ${category} para um(a) ${relationship}.
      O tom deve ser ${tone} e o tamanho ${length}.
      ${context ? `Use este contexto: ${context}` : ''}
      
      IMPORTANTE: Retorne APENAS um JSON no formato: {"messages": ["texto 1", "texto 2", "texto 3"]}
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          response_mime_type: "application/json"
        }
      })
    });

    const data = await response.json();
    
    // Debug: Se o Gemini deu erro estrutural
    if (data.error) {
      throw new Error(`Erro do Gemini: ${data.error.message}`);
    }

    try {
      const rawText = data.candidates[0].content.parts[0].text;
      const aiResponse = JSON.parse(rawText);
      
      return new Response(JSON.stringify(aiResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (e) {
      // Fallback amigável se a estrutura do Gemini mudar
      return new Response(JSON.stringify({ 
        messages: [
          `Parabéns especial para seu ${relationship}! Que todos os seus sonhos se realizem hoje e sempre. ✨`,
          `Desejo muita saúde, paz e alegria no seu dia, ${relationship}! Você merece o mundo.`,
          `Feliz aniversário! Aproveite cada segundo deste momento único em sua caminhada.`
        ] 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
