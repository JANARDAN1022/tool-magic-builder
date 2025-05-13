
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { RouteGuard } from "@/components/RouteGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTools, Tool, ToolRecord, FieldType } from "@/providers/ToolsProvider";
import { ArrowLeft, Plus, Edit, Trash2, Save, Loader, BarChart3, PieChart, LineChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

export default function ToolDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tools, toolRecords, isLoading, updateTool, deleteTool, deployTool, createRecord, updateRecord, deleteRecord } = useTools();
  const { toast } = useToast();
  
  // States
  const [tool, setTool] = useState<Tool | null>(null);
  const [records, setRecords] = useState<ToolRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<ToolRecord | null>(null);
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);
  const [recordFormData, setRecordFormData] = useState<Record<string, any>>({});
  const [isEditingTool, setIsEditingTool] = useState(false);
  const [toolFormData, setToolFormData] = useState<Partial<Tool>>({});
  const [activeTab, setActiveTab] = useState("data");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Effects
  useEffect(() => {
    if (!id) return;
    
    const foundTool = tools.find(t => t.id === id);
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
    
    const toolRecordsList = toolRecords.filter(record => record.toolId === id);
    setRecords(toolRecordsList);
  }, [id, tools, toolRecords, navigate, toast]);
  
  // Handlers
  const handleFormChange = (field: string, value: any) => {
    setRecordFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleToolFormChange = (field: string, value: any) => {
    setToolFormData(prev => ({ ...prev, [field]: value }));
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
  
  const handleCreateRecord = async () => {
    if (!id || !tool) return;
    
    // Validate required fields
    const missingFields = tool.fields
      .filter(field => field.required && !recordFormData[field.name])
      .map(field => field.name);
    
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
      setRecords(prev => [...prev, newRecord]);
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
      const updatedRecord = await updateRecord(editingRecord.id, recordFormData);
      setRecords(prev => prev.map(record => record.id === updatedRecord.id ? updatedRecord : record));
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
      setRecords(prev => prev.filter(record => record.id !== recordId));
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
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const renderFieldInput = (field: any) => {
    const value = recordFormData[field.name] || '';
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <Input
            type={field.type}
            id={field.id}
            value={value}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );
      case 'textarea':
        return (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            rows={3}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => handleFormChange(field.name, e.target.valueAsNumber || 0)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            id={field.id}
            value={value}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
          />
        );
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(value) => handleFormChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'boolean':
        return (
          <Select
            value={value?.toString() || ''}
            onValueChange={(value) => handleFormChange(field.name, value === 'true')}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <RouteGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container max-w-7xl mx-auto px-4 py-24">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                {tool.isDeployed && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
                    Deployed
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                {tool.description}
              </p>
            </div>
            
            <div className="flex gap-2">
              {!isEditingTool ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingTool(true)}
                    disabled={isProcessing}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Tool
                  </Button>
                  
                  {!tool.isDeployed && (
                    <Button 
                      onClick={handleDeployTool}
                      disabled={isProcessing}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Deploy
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditingTool(false);
                      setToolFormData(tool);
                    }}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    onClick={handleSaveTool}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {isEditingTool ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Edit Tool</CardTitle>
                <CardDescription>
                  Update your tool's details and structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Tool Name
                  </label>
                  <Input 
                    id="name" 
                    value={toolFormData.name || ''} 
                    onChange={(e) => handleToolFormChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea 
                    id="description" 
                    value={toolFormData.description || ''} 
                    onChange={(e) => handleToolFormChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fields</label>
                  <div className="border rounded-lg divide-y">
                    {(toolFormData.fields || []).map((field, index) => (
                      <div key={field.id} className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">{field.name}</div>
                          <Badge>{field.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {field.description}
                          {field.required && (
                            <span className="ml-2 text-red-500">*</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteTool}
                  disabled={isProcessing}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Tool
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="data" className="pt-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">Records</h2>
                  
                  <Dialog
                    open={isCreatingRecord}
                    onOpenChange={(open) => {
                      setIsCreatingRecord(open);
                      if (!open) setRecordFormData({});
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Record</DialogTitle>
                        <DialogDescription>
                          Enter the details for your new record
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {tool.fields.map((field) => (
                          <div key={field.id} className="space-y-2">
                            <label htmlFor={field.id} className="text-sm font-medium block">
                              {field.name}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {renderFieldInput(field)}
                            {field.description && (
                              <p className="text-xs text-muted-foreground">
                                {field.description}
                              </p>
                            )}
                          </div>
                        ))}
                        
                        <Button 
                          className="w-full mt-2" 
                          onClick={handleCreateRecord}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Record"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog
                    open={!!editingRecord}
                    onOpenChange={(open) => {
                      if (!open) {
                        setEditingRecord(null);
                        setRecordFormData({});
                      }
                    }}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Record</DialogTitle>
                        <DialogDescription>
                          Update the details for this record
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {tool.fields.map((field) => (
                          <div key={field.id} className="space-y-2">
                            <label htmlFor={field.id} className="text-sm font-medium block">
                              {field.name}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {renderFieldInput(field)}
                            {field.description && (
                              <p className="text-xs text-muted-foreground">
                                {field.description}
                              </p>
                            )}
                          </div>
                        ))}
                        
                        <Button 
                          className="w-full mt-2" 
                          onClick={handleUpdateRecord}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Update Record"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {records.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tool.fields.map((field) => (
                            <TableHead key={field.id}>{field.name}</TableHead>
                          ))}
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records.map((record) => (
                          <TableRow key={record.id}>
                            {tool.fields.map((field) => (
                              <TableCell key={field.id}>
                                {field.type === 'boolean' 
                                  ? (record.data[field.name] ? 'Yes' : 'No')
                                  : record.data[field.name] || '-'}
                              </TableCell>
                            ))}
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => startEditingRecord(record)}
                                disabled={isProcessing}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteRecord(record.id)}
                                disabled={isProcessing}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center bg-muted/30 rounded-lg border border-dashed">
                    <h3 className="font-medium mb-2">No records yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first record to get started
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreatingRecord(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Record
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="visualization" className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Visualize Your Data</h2>
                
                {records.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>Status Distribution</CardTitle>
                          <PieChart className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">
                          Visualization will appear here once you connect to your AI provider
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>Time Trends</CardTitle>
                          <LineChart className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">
                          Visualization will appear here once you connect to your AI provider
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="lg:col-span-2">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>AI-Generated Insights</CardTitle>
                          <BarChart3 className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/30 rounded-lg p-6">
                          <p className="text-muted-foreground">
                            Connect your AI provider to generate insights from your data automatically.
                          </p>
                          <Button className="mt-4" disabled>
                            Connect AI Provider
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center bg-muted/30 rounded-lg border border-dashed">
                    <h3 className="font-medium mb-2">No data to visualize</h3>
                    <p className="text-muted-foreground mb-4">
                      Add some records first to see visualizations
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setActiveTab("data");
                        setIsCreatingRecord(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Record
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tool Settings</CardTitle>
                    <CardDescription>
                      Manage your tool configuration and options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tool Name</label>
                      <Input value={tool.name} disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea value={tool.description} disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tool ID</label>
                      <div className="flex">
                        <Input value={tool.id} disabled className="font-mono text-xs" />
                        <Button 
                          variant="outline" 
                          className="ml-2"
                          onClick={() => {
                            navigator.clipboard.writeText(tool.id);
                            toast({ title: "Copied to clipboard" });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Created</label>
                      <Input value={new Date(tool.createdAt).toLocaleString()} disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Updated</label>
                      <Input value={new Date(tool.updatedAt).toLocaleString()} disabled />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteTool}
                      disabled={isProcessing}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Tool
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </RouteGuard>
  );
}
