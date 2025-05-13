
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Tool } from "@/providers/ToolsProvider";

interface ToolEditFormProps {
  toolFormData: Partial<Tool>;
  handleToolFormChange: (field: string, value: any) => void;
  handleDeleteTool: () => Promise<void>;
  isProcessing: boolean;
}

export function ToolEditForm({
  toolFormData,
  handleToolFormChange,
  handleDeleteTool,
  isProcessing
}: ToolEditFormProps) {
  return (
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
            {(toolFormData.fields || []).map((field) => (
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
  );
}
