
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolRecord } from "@/providers/ToolsProvider";
import { PieChart, LineChart, BarChart3, Plus } from "lucide-react";

interface VisualizationTabProps {
  records: ToolRecord[];
  setActiveTab: (tab: string) => void;
  setIsCreatingRecord: (isCreating: boolean) => void;
}

export function VisualizationTab({ 
  records, 
  setActiveTab, 
  setIsCreatingRecord 
}: VisualizationTabProps) {
  if (records.length === 0) {
    return (
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
    );
  }
  
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Visualize Your Data</h2>
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
    </>
  );
}
