
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
    // Define the system prompt for tool generation with more specific instructions
    const systemPrompt = `
      You are a helpful assistant that generates detailed tool configurations based on user descriptions.
      Generate a JSON schema for a business tool with the following structure:
      {
        "name": "Tool Name (Be specific and descriptive)",
        "description": "Detailed description of what the tool does and its purpose",
        "fields": [
          {
            "id": "unique-id",
            "name": "Field Name",
            "type": "text|number|date|select|boolean|email|url|textarea",
            "required": true|false,
            "options": ["Option 1", "Option 2"] // Only for select type
            "description": "Detailed field description"
          }
        ]
      }
      
      IMPORTANT GUIDELINES:
      1. Create 5-8 relevant fields specific to the described tool's purpose
      2. Include a mix of field types appropriate for the data
      3. For delivery/logistics tools, include fields like:
         - Package/Order ID
         - Customer Name
         - Delivery Address
         - Status (with options like "Pending", "In Transit", "Delivered", "Failed")
         - Driver Assignment
         - Delivery Date/Time
         - Notes/Comments
         - Priority Level
      4. For customer service tools, include fields like:
         - Ticket/Issue ID
         - Customer Information
         - Issue Category
         - Priority/Urgency
         - Status tracking
         - Resolution notes
      5. Name the tool something specific that clearly communicates its purpose
      
      Make the response detailed, practical, and immediately useful for business applications.
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
        temperature: 0.7,
        max_tokens: 1500,
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
    
    // Return more specific fallback data based on the description
    if (description.toLowerCase().includes('package') || 
        description.toLowerCase().includes('delivery') || 
        description.toLowerCase().includes('drivers')) {
      // Delivery tracking specific fallback
      return {
        name: "Package Delivery Tracker",
        description: "Track and manage package deliveries across your driver fleet",
        fields: [
          {
            id: generateId(),
            name: 'Package ID',
            type: 'text',
            required: true,
            description: 'Unique identifier for the package'
          },
          {
            id: generateId(),
            name: 'Customer Name',
            type: 'text',
            required: true,
            description: 'Name of the customer receiving the package'
          },
          {
            id: generateId(),
            name: 'Delivery Address',
            type: 'textarea',
            required: true,
            description: 'Full delivery address'
          },
          {
            id: generateId(),
            name: 'Driver',
            type: 'select',
            required: true,
            options: ['John D.', 'Sarah M.', 'Miguel R.', 'Aisha K.', 'Unassigned'],
            description: 'Driver assigned to the delivery'
          },
          {
            id: generateId(),
            name: 'Status',
            type: 'select',
            required: true,
            options: ['Pending', 'In Transit', 'Delivered', 'Failed', 'Rescheduled'],
            description: 'Current delivery status'
          },
          {
            id: generateId(),
            name: 'Delivery Date',
            type: 'date',
            required: true,
            description: 'Scheduled or actual delivery date'
          },
          {
            id: generateId(),
            name: 'Priority',
            type: 'select',
            required: false,
            options: ['Normal', 'Express', 'Same-day', 'Overnight'],
            description: 'Delivery priority level'
          },
          {
            id: generateId(),
            name: 'Notes',
            type: 'textarea',
            required: false,
            description: 'Additional delivery instructions or notes'
          }
        ]
      };
    } else {
      // Generic fallback
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
}
