import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateRightsContent(
  state: string,
  interactionType: string
): Promise<{ content: string; script: string }> {
  try {
    const prompt = `Generate specific legal rights information and a script for a ${interactionType} in ${state}. 
    
    Please provide:
    1. A concise summary of relevant rights (2-3 sentences)
    2. A short, practical script the person can use (1-2 sentences)
    
    Focus on constitutional rights and state-specific laws. Keep it practical and easy to remember under stress.
    
    Format as JSON with "content" and "script" fields.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a legal rights expert who provides accurate, practical advice for police encounters. Always emphasize constitutional rights and de-escalation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      const parsed = JSON.parse(response);
      return {
        content: parsed.content || 'Rights information not available.',
        script: parsed.script || 'I am exercising my right to remain silent.'
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        content: response.split('\n')[0] || 'Rights information not available.',
        script: 'I am exercising my right to remain silent.'
      };
    }
  } catch (error) {
    console.error('Error generating rights content:', error);
    return {
      content: 'Unable to generate specific rights information at this time.',
      script: 'I am exercising my right to remain silent.'
    };
  }
}

export async function generateEducationalContent(topic: string): Promise<string> {
  try {
    const prompt = `Provide educational content about ${topic} in police encounters. 
    Keep it concise, practical, and focused on constitutional rights and safety.
    Limit to 3-4 key points in simple language.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are an educational content creator focused on civil rights and police encounter safety.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    return completion.choices[0]?.message?.content || 'Educational content not available.';
  } catch (error) {
    console.error('Error generating educational content:', error);
    return 'Educational content not available at this time.';
  }
}
