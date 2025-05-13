
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/providers/ToolsProvider";
import { ArrowLeft, Edit, Save, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ToolHeaderProps {
  tool: Tool;
  isEditingTool: boolean;
  setIsEditingTool: (isEditing: boolean) => void;
  toolFormData: Partial<Tool>;
  setToolFormData: (data: Partial<Tool>) => void;
  handleSaveTool: () => Promise<void>;
  handleDeployTool: () => Promise<void>;
  isProcessing: boolean;
}

export function ToolHeader({
  tool,
  isEditingTool,
  setIsEditingTool,
  toolFormData,
  setToolFormData,
  handleSaveTool,
  handleDeployTool,
  isProcessing
}: ToolHeaderProps) {
  const navigate = useNavigate();
  
  const handleToolFormChange = (field: string, value: any) => {
    setToolFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <>
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
    </>
  );
}
