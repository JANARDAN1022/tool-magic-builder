import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateToolSchema } from "@/services/ai-service";

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "boolean"
  | "email"
  | "url"
  | "textarea";

export type ToolField = {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  description?: string;
};

export type Tool = {
  id: string;
  name: string;
  description: string;
  fields: ToolField[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  isDeployed: boolean;
};

export type ToolRecord = {
  id: string;
  toolId: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

type ToolsContextType = {
  tools: Tool[];
  isLoading: boolean;
  currentTool: Tool | null;
  toolRecords: ToolRecord[];
  setCurrentTool: (tool: Tool | null) => void;
  createTool: (toolInput: Partial<Tool>) => Promise<Tool>;
  updateTool: (id: string, toolInput: Partial<Tool>) => Promise<Tool>;
  deleteTool: (id: string) => Promise<void>;
  deployTool: (id: string) => Promise<Tool>;
  generateToolFromDescription: (description: string) => Promise<Tool>;
  createRecord: (
    toolId: string,
    data: Record<string, any>
  ) => Promise<ToolRecord>;
  updateRecord: (id: string, data: Record<string, any>) => Promise<ToolRecord>;
  deleteRecord: (id: string) => Promise<void>;
  getToolRecords: (toolId: string) => Promise<ToolRecord[]>;
};

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

export function ToolsProvider({ children }: { children: React.ReactNode }) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [currentTool, setCurrentTool] = useState<Tool | null>(null);
  const [toolRecords, setToolRecords] = useState<ToolRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load tools from localStorage on mount
  useEffect(() => {
    const loadTools = () => {
      try {
        const savedTools = localStorage.getItem("magic-tools");
        if (savedTools) {
          setTools(JSON.parse(savedTools));
        }

        const savedRecords = localStorage.getItem("magic-tool-records");
        if (savedRecords) {
          setToolRecords(JSON.parse(savedRecords));
        }
      } catch (error) {
        console.error("Error loading tools from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTools();
  }, []);

  // Save tools to localStorage whenever they change
  useEffect(() => {
    if (tools.length) {
      localStorage.setItem("magic-tools", JSON.stringify(tools));
    }
  }, [tools]);

  // Save records to localStorage whenever they change
  useEffect(() => {
    if (toolRecords.length) {
      localStorage.setItem("magic-tool-records", JSON.stringify(toolRecords));
    }
  }, [toolRecords]);

  const createTool = async (toolInput: Partial<Tool>): Promise<Tool> => {
    const now = new Date().toISOString();
    const newTool: Tool = {
      id: generateId(),
      name: toolInput.name || "Untitled Tool",
      description: toolInput.description || "",
      fields: toolInput.fields || [],
      createdAt: now,
      updatedAt: now,
      userId: "user-123", // This will be replaced with actual user ID
      isDeployed: false,
    };

    setTools((prev) => [...prev, newTool]);

    toast({
      title: "Tool created",
      description: `${newTool.name} was created successfully.`,
    });

    return newTool;
  };

  const updateTool = async (
    id: string,
    toolInput: Partial<Tool>
  ): Promise<Tool> => {
    const updatedTools = tools.map((tool) => {
      if (tool.id === id) {
        const updatedTool = {
          ...tool,
          ...toolInput,
          updatedAt: new Date().toISOString(),
        };
        return updatedTool;
      }
      return tool;
    });

    setTools(updatedTools);

    const updatedTool = updatedTools.find((tool) => tool.id === id);

    if (!updatedTool) {
      throw new Error("Tool not found");
    }

    if (currentTool?.id === id) {
      setCurrentTool(updatedTool);
    }

    toast({
      title: "Tool updated",
      description: `${updatedTool.name} was updated successfully.`,
    });

    return updatedTool;
  };

  const deleteTool = async (id: string): Promise<void> => {
    const toolToDelete = tools.find((tool) => tool.id === id);
    if (!toolToDelete) {
      throw new Error("Tool not found");
    }

    const updatedTools = tools.filter((tool) => tool.id !== id);
    setTools(updatedTools);

    // Also clean up associated records
    const updatedRecords = toolRecords.filter((record) => record.toolId !== id);
    setToolRecords(updatedRecords);

    if (currentTool?.id === id) {
      setCurrentTool(null);
    }

    toast({
      title: "Tool deleted",
      description: `${toolToDelete.name} was deleted successfully.`,
    });
  };

  const deployTool = async (id: string): Promise<Tool> => {
    const updatedTools = tools.map((tool) => {
      if (tool.id === id) {
        return {
          ...tool,
          isDeployed: true,
          updatedAt: new Date().toISOString(),
        };
      }
      return tool;
    });

    setTools(updatedTools);

    const deployedTool = updatedTools.find((tool) => tool.id === id);

    if (!deployedTool) {
      throw new Error("Tool not found");
    }

    if (currentTool?.id === id) {
      setCurrentTool(deployedTool);
    }

    toast({
      title: "Tool deployed",
      description: `${deployedTool.name} was deployed successfully.`,
    });

    return deployedTool;
  };

  // Generate a tool from description using the AI service
  const generateToolFromDescription = async (
    description: string
  ): Promise<Tool> => {
    setIsLoading(true);

    try {
      // Call the AI service to generate a tool schema
      const aiResponse = await generateToolSchema(description);

      // Make sure the generated fields have valid FieldType values
      const validatedFields: ToolField[] = aiResponse.fields.map((field) => ({
        ...field,
        type: validateFieldType(field.type),
      }));

      // Create the new tool using the AI response with validated fields
      const newTool = await createTool({
        name: aiResponse.name,
        description: aiResponse.description,
        fields: validatedFields,
      });

      return newTool;
    } catch (error) {
      console.error("Error generating tool:", error);
      toast({
        title: "Error generating tool",
        description: "Failed to process your description. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate field types
  const validateFieldType = (type: string): FieldType => {
    const validTypes: FieldType[] = [
      "text",
      "number",
      "date",
      "select",
      "boolean",
      "email",
      "url",
      "textarea",
    ];

    if (validTypes.includes(type as FieldType)) {
      return type as FieldType;
    }

    // Default to 'text' if the type is not valid
    console.warn(`Invalid field type "${type}" detected, defaulting to "text"`);
    return "text";
  };

  const createRecord = async (
    toolId: string,
    data: Record<string, any>
  ): Promise<ToolRecord> => {
    const tool = tools.find((t) => t.id === toolId);
    if (!tool) {
      throw new Error("Tool not found");
    }

    const now = new Date().toISOString();
    const newRecord: ToolRecord = {
      id: generateId(),
      toolId,
      data,
      createdAt: now,
      updatedAt: now,
    };

    // Check for duplicate IDs before adding
    setToolRecords((prev) => {
      if (prev.some((record) => record.id === newRecord.id)) {
        console.warn("Duplicate record ID detected, skipping addition.");
        return prev;
      }
      return [...prev, newRecord];
    });

    toast({
      title: "Record created",
      description: `New record added to ${tool.name}.`,
    });

    return newRecord;
  };

  const updateRecord = async (
    id: string,
    data: Record<string, any>
  ): Promise<ToolRecord> => {
    const updatedRecords = toolRecords.map((record) => {
      if (record.id === id) {
        return {
          ...record,
          data,
          updatedAt: new Date().toISOString(),
        };
      }
      return record;
    });

    setToolRecords(updatedRecords);

    const updatedRecord = updatedRecords.find((record) => record.id === id);

    if (!updatedRecord) {
      throw new Error("Record not found");
    }

    toast({
      title: "Record updated",
      description: "Record was updated successfully.",
    });

    return updatedRecord;
  };

  const deleteRecord = async (id: string): Promise<void> => {
    const updatedRecords = toolRecords.filter((record) => record.id !== id);
    setToolRecords(updatedRecords);

    toast({
      title: "Record deleted",
      description: "Record was deleted successfully.",
    });
  };

  const getToolRecords = async (toolId: string): Promise<ToolRecord[]> => {
    return toolRecords.filter((record) => record.toolId === toolId);
  };

  const value = {
    tools,
    currentTool,
    toolRecords,
    isLoading,
    setCurrentTool,
    createTool,
    updateTool,
    deleteTool,
    deployTool,
    generateToolFromDescription,
    createRecord,
    updateRecord,
    deleteRecord,
    getToolRecords,
  };

  return (
    <ToolsContext.Provider value={value}>{children}</ToolsContext.Provider>
  );
}

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error("useTools must be used within a ToolsProvider");
  }
  return context;
};
