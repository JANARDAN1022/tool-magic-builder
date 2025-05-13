import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { RouteGuard } from "@/components/RouteGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTools, Tool, ToolRecord } from "@/providers/ToolsProvider";
import { useToast } from "@/hooks/use-toast";
import { ToolHeader } from "@/components/tool-details/ToolHeader";
import { ToolEditForm } from "@/components/tool-details/ToolEditForm";
import { DataTab } from "@/components/tool-details/DataTab";
import { VisualizationTab } from "@/components/tool-details/VisualizationTab";
import { SettingsTab } from "@/components/tool-details/SettingsTab";

export default function ToolDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    tools,
    toolRecords,
    isLoading,
    updateTool,
    deleteTool,
    deployTool,
    createRecord,
    updateRecord,
    deleteRecord,
  } = useTools();
  const { toast } = useToast();

  const [tool, setTool] = useState<Tool | null>(null);
  const [records, setRecords] = useState<ToolRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<ToolRecord | null>(null);
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);
  const [recordFormData, setRecordFormData] = useState<Record<string, any>>({});
  const [isEditingTool, setIsEditingTool] = useState(false);
  const [toolFormData, setToolFormData] = useState<Partial<Tool>>({});
  const [activeTab, setActiveTab] = useState("data");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;

    const foundTool = tools.find((t) => t.id === id);
    if (foundTool) {
      setTool(foundTool);
      setToolFormData(foundTool);
    } else {
      toast({
        title: "Tool not found",
        description: "The requested tool could not be found.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }

    const toolRecordsList = toolRecords.filter(
      (record) => record.toolId === id
    );
    setRecords(toolRecordsList);
  }, [id, tools, toolRecords, navigate, toast]);

  // Handlers for tool operations
  const handleToolFormChange = (field: string, value: any) => {
    setToolFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveTool = async () => {
    if (!id || !tool) return;

    try {
      setIsProcessing(true);
      await updateTool(id, toolFormData);
      setIsEditingTool(false);
    } catch (error) {
      console.error("Error updating tool:", error);
      toast({
        title: "Error",
        description: "Failed to save tool changes.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeployTool = async () => {
    if (!id || !tool) return;

    try {
      setIsProcessing(true);
      await deployTool(id);
      toast({
        title: "Tool deployed",
        description: "Your tool is now live and can be accessed by your team.",
      });
    } catch (error) {
      console.error("Error deploying tool:", error);
      toast({
        title: "Error",
        description: "Failed to deploy tool.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTool = async () => {
    if (!id || !tool) return;

    try {
      setIsProcessing(true);
      await deleteTool(id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting tool:", error);
      toast({
        title: "Error",
        description: "Failed to delete tool.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handlers for record operations
  const handleCreateRecord = async () => {
    if (!id || !tool) return;

    // Validate required fields
    const missingFields = tool.fields
      .filter((field) => field.required && !recordFormData[field.name])
      .map((field) => field.name);

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const newRecord = await createRecord(id, recordFormData);

      setRecords((prev) => {
        if (prev.some((record) => record.id === newRecord.id)) {
          console.warn("Duplicate record ID detected, skipping addition.");
          return prev;
        }
        return [...prev, newRecord];
      });

      setRecordFormData({});
      setIsCreatingRecord(false);
    } catch (error) {
      console.error("Error creating record:", error);
      toast({
        title: "Error",
        description: "Failed to create record.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateRecord = async () => {
    if (!editingRecord) return;

    try {
      setIsProcessing(true);
      const updatedRecord = await updateRecord(
        editingRecord.id,
        recordFormData
      );
      setRecords((prev) =>
        prev.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record
        )
      );
      setEditingRecord(null);
      setRecordFormData({});
    } catch (error) {
      console.error("Error updating record:", error);
      toast({
        title: "Error",
        description: "Failed to update record.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      setIsProcessing(true);
      await deleteRecord(recordId);
      setRecords((prev) => prev.filter((record) => record.id !== recordId));
    } catch (error) {
      console.error("Error deleting record:", error);
      toast({
        title: "Error",
        description: "Failed to delete record.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startEditingRecord = (record: ToolRecord) => {
    setEditingRecord(record);
    setRecordFormData(record.data);
  };

  // Loading state
  if (isLoading || !tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-4 border-secondary border-b-transparent animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 container max-w-7xl mx-auto px-4 py-24">
          <ToolHeader
            tool={tool}
            isEditingTool={isEditingTool}
            setIsEditingTool={setIsEditingTool}
            toolFormData={toolFormData}
            setToolFormData={setToolFormData}
            handleSaveTool={handleSaveTool}
            handleDeployTool={handleDeployTool}
            isProcessing={isProcessing}
          />

          {isEditingTool ? (
            <ToolEditForm
              toolFormData={toolFormData}
              handleToolFormChange={handleToolFormChange}
              handleDeleteTool={handleDeleteTool}
              isProcessing={isProcessing}
            />
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="data" className="pt-6">
                <DataTab
                  tool={tool}
                  records={records}
                  handleCreateRecord={handleCreateRecord}
                  handleUpdateRecord={handleUpdateRecord}
                  handleDeleteRecord={handleDeleteRecord}
                  startEditingRecord={startEditingRecord}
                  isCreatingRecord={isCreatingRecord}
                  setIsCreatingRecord={setIsCreatingRecord}
                  recordFormData={recordFormData}
                  setRecordFormData={setRecordFormData}
                  editingRecord={editingRecord}
                  setEditingRecord={setEditingRecord}
                  isProcessing={isProcessing}
                />
              </TabsContent>

              <TabsContent value="visualization" className="pt-6">
                <VisualizationTab
                  records={records}
                  setActiveTab={setActiveTab}
                  setIsCreatingRecord={setIsCreatingRecord}
                />
              </TabsContent>

              <TabsContent value="settings" className="pt-6">
                <SettingsTab
                  tool={tool}
                  handleDeleteTool={handleDeleteTool}
                  isProcessing={isProcessing}
                />
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </RouteGuard>
  );
}
