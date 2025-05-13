import { GROQ_API_KEY, DEFAULT_MODEL } from "@/lib/ai-config";
import { ToolRecord } from "@/providers/ToolsProvider";

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

// Type for visualization data
export type VisualizationItem = {
  title: string;
  type: "pie" | "line" | "bar" | "stats";
  summary: string;
  data?: any;
};

// Function to generate a unique ID (for client-side only)
const generateId = () => Math.random().toString(36).substring(2, 15);

// Function to generate tool schema from description using Groq
export async function generateToolSchema(
  description: string
): Promise<AIResponse> {
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
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: description },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from API");
    }

    // Extract JSON from potential markdown code blocks
    const jsonMatch =
      content.match(/```(?:json)?\s*({[\s\S]+?})\s*```/) ||
      content.match(/{[\s\S]+?}/);
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
      fields: fieldsWithIds,
    };
  } catch (error) {
    console.error("Error generating tool schema:", error);

    // Return more specific fallback data based on the description
    if (
      description.toLowerCase().includes("package") ||
      description.toLowerCase().includes("delivery") ||
      description.toLowerCase().includes("drivers")
    ) {
      // Delivery tracking specific fallback
      return {
        name: "Package Delivery Tracker",
        description:
          "Track and manage package deliveries across your driver fleet",
        fields: [
          {
            id: generateId(),
            name: "Package ID",
            type: "text",
            required: true,
            description: "Unique identifier for the package",
          },
          {
            id: generateId(),
            name: "Customer Name",
            type: "text",
            required: true,
            description: "Name of the customer receiving the package",
          },
          {
            id: generateId(),
            name: "Delivery Address",
            type: "textarea",
            required: true,
            description: "Full delivery address",
          },
          {
            id: generateId(),
            name: "Driver",
            type: "select",
            required: true,
            options: [
              "John D.",
              "Sarah M.",
              "Miguel R.",
              "Aisha K.",
              "Unassigned",
            ],
            description: "Driver assigned to the delivery",
          },
          {
            id: generateId(),
            name: "Status",
            type: "select",
            required: true,
            options: [
              "Pending",
              "In Transit",
              "Delivered",
              "Failed",
              "Rescheduled",
            ],
            description: "Current delivery status",
          },
          {
            id: generateId(),
            name: "Delivery Date",
            type: "date",
            required: true,
            description: "Scheduled or actual delivery date",
          },
          {
            id: generateId(),
            name: "Priority",
            type: "select",
            required: false,
            options: ["Normal", "Express", "Same-day", "Overnight"],
            description: "Delivery priority level",
          },
          {
            id: generateId(),
            name: "Notes",
            type: "textarea",
            required: false,
            description: "Additional delivery instructions or notes",
          },
        ],
      };
    } else {
      // Generic fallback
      return {
        name: `${description.split(" ").slice(0, 3).join(" ")} Tool`,
        description: description,
        fields: [
          {
            id: generateId(),
            name: "Name",
            type: "text",
            required: true,
            description: "Name of the item",
          },
          {
            id: generateId(),
            name: "Status",
            type: "select",
            required: true,
            options: ["Pending", "In Progress", "Completed"],
            description: "Current status",
          },
          {
            id: generateId(),
            name: "Date",
            type: "date",
            required: true,
            description: "Date of the event",
          },
          {
            id: generateId(),
            name: "Notes",
            type: "textarea",
            required: false,
            description: "Additional notes",
          },
        ],
      };
    }
  }
}

// Helper function to get field values from records
const getFieldValues = (records: ToolRecord[], fieldName: string) => {
  return records
    .map((record) => record.data[fieldName])
    .filter((value) => value !== undefined && value !== null);
};

// Helper function to count occurrences of values
const countOccurrences = (values: any[]) => {
  return values.reduce((acc: Record<string, number>, value: any) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};

// Function to generate visualization data from records
export async function fetchVisualizationData(
  records: ToolRecord[]
): Promise<VisualizationItem[]> {
  try {
    if (!records || records.length === 0) {
      return [];
    }

    // Get field names from the first record
    const fieldNames = Object.keys(records[0].data || {});

    const visualizations: VisualizationItem[] = [];

    // Look for status or category fields for pie chart
    const statusField = fieldNames.find(
      (field) =>
        field.toLowerCase().includes("status") ||
        field.toLowerCase().includes("category") ||
        field.toLowerCase().includes("type") ||
        field.toLowerCase().includes("priority")
    );

    if (statusField) {
      const statusValues = getFieldValues(records, statusField);
      const statusCounts = countOccurrences(statusValues);

      visualizations.push({
        title: `${statusField} Distribution`,
        type: "pie",
        summary: `Overview of records by ${statusField.toLowerCase()}`,
        data: Object.entries(statusCounts).map(([label, value]) => ({
          label,
          value,
        })),
      });
    }

    // Look for date fields for timeline/trend analysis
    const dateField = fieldNames.find(
      (field) =>
        field.toLowerCase().includes("date") ||
        field.toLowerCase().includes("time") ||
        field.toLowerCase().includes("created") ||
        field.toLowerCase().includes("deadline")
    );

    if (dateField) {
      // Group records by date (just using month for simplicity)
      const dateValues = getFieldValues(records, dateField)
        .filter((date) => date && date.includes("-"))
        .map((date) => {
          try {
            const dateObj = new Date(date);
            return dateObj.toISOString().slice(0, 7); // YYYY-MM format
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const dateCounts = countOccurrences(dateValues);

      if (Object.keys(dateCounts).length > 0) {
        visualizations.push({
          title: "Records Timeline",
          type: "line",
          summary: "Record volume over time",
          data: Object.entries(dateCounts)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, count]) => ({
              date,
              count,
            })),
        });
      }
    }

    // Create a bar chart for another categorical field
    const otherCategoricalField = fieldNames.find(
      (field) =>
        field !== statusField &&
        (field.toLowerCase().includes("driver") ||
          field.toLowerCase().includes("assigned") ||
          field.toLowerCase().includes("owner") ||
          field.toLowerCase().includes("department") ||
          field.toLowerCase().includes("customer"))
    );

    if (otherCategoricalField) {
      const values = getFieldValues(records, otherCategoricalField);
      const counts = countOccurrences(values);

      visualizations.push({
        title: `Records by ${otherCategoricalField}`,
        type: "bar",
        summary: `Distribution of records by ${otherCategoricalField.toLowerCase()}`,
        data: Object.entries(counts).map(([category, count]) => ({
          category,
          count,
        })),
      });
    }

    // Add a simple stats card
    visualizations.push({
      title: "Summary Statistics",
      type: "stats",
      summary: "Key metrics from your data",
      data: {
        totalRecords: records.length,
        fieldsPerRecord: fieldNames.length,
        lastUpdated: new Date().toISOString().split("T")[0],
      },
    });

    // If no useful visualizations could be generated, create some fallbacks
    if (visualizations.length <= 1) {
      // Basic record count by created date (using record id instead)
      visualizations.push({
        title: "Record Growth",
        type: "line",
        summary: "Records added over time",
        data: records.map((record, index) => ({
          index,
          count: index + 1,
        })),
      });

      // Random categorical visualization
      if (fieldNames.length > 0) {
        const randomField = fieldNames[0];
        const values = getFieldValues(records, randomField);
        const counts = countOccurrences(values);

        visualizations.push({
          title: `${randomField} Analysis`,
          type: "bar",
          summary: `Distribution of ${randomField} values`,
          data: Object.entries(counts).map(([category, count]) => ({
            category,
            count,
          })),
        });
      }
    }

    return visualizations.slice(0, 4); // Return at most 4 visualizations
  } catch (error) {
    console.error("Error generating visualization data:", error);

    // Return fallback visualizations
    return [
      {
        title: "Records Overview",
        type: "pie",
        summary: "Distribution of records by status",
        data: [
          { label: "Completed", value: Math.floor(records.length * 0.6) },
          { label: "In Progress", value: Math.floor(records.length * 0.3) },
          {
            label: "Pending",
            value: Math.max(
              1,
              records.length - Math.floor(records.length * 0.9)
            ),
          },
        ],
      },
      {
        title: "Activity Timeline",
        type: "line",
        summary: "Record activity over time",
        data: Array.from({ length: 6 }, (_, i) => ({
          date: `2025-${String(i + 1).padStart(2, "0")}`,
          count: Math.floor(Math.random() * 10) + 1,
        })),
      },
    ];
  }
}
