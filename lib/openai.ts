import OpenAI from 'openai';
import { GeneratedContent, InteractionType } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateRightsContent(
  state: string,
  interactionType: InteractionType
): Promise<GeneratedContent> {
  try {
    const prompt = `Generate comprehensive rights information for a ${interactionType.replace('-', ' ')} in ${state}. 

Please provide:
1. A list of specific constitutional rights that apply
2. A clear, calm script for what to say to police
3. Important tips for staying safe during the interaction
4. Critical warnings about what NOT to do

Format the response as JSON with the following structure:
{
  "rights": ["right 1", "right 2", ...],
  "script": "What to say to the officer...",
  "tips": ["tip 1", "tip 2", ...],
  "warnings": ["warning 1", "warning 2", ...]
}

Keep language clear, concise, and legally accurate for ${state} state law.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a legal expert specializing in constitutional rights and police interactions. Provide accurate, state-specific legal information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    return JSON.parse(content) as GeneratedContent;
  } catch (error) {
    console.error('Error generating rights content:', error);
    
    // Fallback content
    return {
      rights: [
        'You have the right to remain silent',
        'You have the right to refuse searches without a warrant',
        'You have the right to ask if you are free to go',
        'You have the right to record the interaction'
      ],
      script: "Officer, I'm exercising my right to remain silent. I do not consent to any searches. Am I free to go?",
      tips: [
        'Stay calm and keep your hands visible',
        'Do not argue or resist physically',
        'Ask for a lawyer if arrested',
        'Remember details for later'
      ],
      warnings: [
        'Do not run or make sudden movements',
        'Do not lie or provide false information',
        'Do not consent to searches',
        'Do not sign anything without a lawyer'
      ]
    };
  }
}
