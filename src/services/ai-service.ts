
import { GROQ_API_KEY, DEFAULT_MODEL } from '@/lib/ai-config';

// Type for AI generation responses
type AIResponse = {
  name: string;
  description: string;
  fields: Array<{
    id: string;
    name: string;
    type: string;
    required: boolean;
    options?: string[];
    description?: string;
  }>;
};

// Function to generate a unique ID (for client-side only)
const generateId = () => Math.random().toString(36).substring(2, 15);

// Function to generate tool schema from description using Groq
export async function generateToolSchema(description: string): Promise<AIResponse> {
  try {
    // Define the system prompt for tool generation
    const systemPrompt = `
      You are a helpful assistant that generates tool configurations based on user descriptions.
      Generate a JSON schema for a tool with the following structure:
      {
        "name": "Tool Name",
        "description": "Description of what the tool does",
        "fields": [
          {
            "id": "unique-id",
            "name": "Field Name",
            "type": "text|number|date|select|boolean|email|url|textarea",
            "required": true|false,
            "options": ["Option 1", "Option 2"] // Only for select type
            "description": "Field description"
          }
        ]
      }
      
      Make sure to include appropriate fields that would be needed for the tool based on the user's description.
      Keep the response concise and useful for business applications.
    `;

    // Make request to Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: description }
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from API');
    }
    
    // Extract JSON from potential markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]+?})\s*```/) || content.match(/{[\s\S]+?}/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;
    
    // Parse the JSON
    const parsedData = JSON.parse(jsonStr);
    
    // Ensure each field has an ID
    const fieldsWithIds = parsedData.fields.map((field: any) => ({
      ...field,
      id: field.id || generateId(),
    }));
    
    return {
      ...parsedData,
      fields: fieldsWithIds
    };
  } catch (error) {
    console.error("Error generating tool schema:", error);
    
    // Return fallback data if API fails
    return {
      name: `${description.split(' ').slice(0, 3).join(' ')} Tool`,
      description: description,
      fields: [
        {
          id: generateId(),
          name: 'Name',
          type: 'text',
          required: true,
          description: 'Name of the item'
        },
        {
          id: generateId(),
          name: 'Status',
          type: 'select',
          required: true,
          options: ['Pending', 'In Progress', 'Completed'],
          description: 'Current status'
        },
        {
          id: generateId(),
          name: 'Date',
          type: 'date',
          required: true,
          description: 'Date of the event'
        },
        {
          id: generateId(),
          name: 'Notes',
          type: 'textarea',
          required: false,
          description: 'Additional notes'
        }
      ]
    };
  }
}
