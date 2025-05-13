
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tool } from "@/providers/ToolsProvider";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsTabProps {
  tool: Tool;
  handleDeleteTool: () => Promise<void>;
  isProcessing: boolean;
}

export function SettingsTab({ tool, handleDeleteTool, isProcessing }: SettingsTabProps) {
  const { toast } = useToast();
  
  return (
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
  );
}
