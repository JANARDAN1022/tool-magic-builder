import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolRecord } from "@/providers/ToolsProvider";
import { PieChart, LineChart, BarChart3, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchVisualizationData,
  VisualizationItem,
} from "@/services/ai-service";
import {
  BarChart,
  LineChartComponent,
  PieChartComponent,
  StatsDisplay,
} from "./ChartComponents";

interface VisualizationTabProps {
  records: ToolRecord[];
  setActiveTab: (tab: string) => void;
  setIsCreatingRecord: (isCreating: boolean) => void;
}

export function VisualizationTab({
  records,
  setActiveTab,
  setIsCreatingRecord,
}: VisualizationTabProps) {
  const [visualizationData, setVisualizationData] = useState<
    VisualizationItem[] | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (records.length > 0) {
      setLoading(true);
      fetchVisualizationData(records)
        .then((data) => setVisualizationData(data))
        .catch((error) => {
          console.error("Error fetching visualization data:", error);
          setVisualizationData(null);
        })
        .finally(() => setLoading(false));
    }
  }, [records]);

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

  if (loading) {
    return <p>Loading visualizations...</p>;
  }

  if (!visualizationData) {
    return <p>Failed to load visualizations. Please try again later.</p>;
  }

  const getChartIcon = (type: string) => {
    switch (type) {
      case "pie":
        return <PieChart className="h-5 w-5 text-muted-foreground" />;
      case "line":
        return <LineChart className="h-5 w-5 text-muted-foreground" />;
      case "bar":
        return <BarChart3 className="h-5 w-5 text-muted-foreground" />;
      default:
        return <BarChart3 className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const renderChartContent = (viz: VisualizationItem) => {
    switch (viz.type) {
      case "pie":
        return <PieChartComponent data={viz.data} />;
      case "line":
        return <LineChartComponent data={viz.data} />;
      case "bar":
        return <BarChart data={viz.data} />;
      case "stats":
        return <StatsDisplay data={viz.data} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Visualize Your Data</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visualizationData.map((viz, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{viz.title}</CardTitle>
                {getChartIcon(viz.type)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {viz.summary}
              </p>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              {renderChartContent(viz)}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
