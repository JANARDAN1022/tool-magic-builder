import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { RouteGuard } from "@/components/RouteGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTools } from "@/providers/ToolsProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ChevronRight,
  Search,
  Loader,
  LayoutDashboard,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    tools,
    isLoading: toolsLoading,
    generateToolFromDescription,
  } = useTools();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleGenerateTool = async () => {
    if (!description.trim()) {
      toast({
        title: "Empty description",
        description: "Please enter a description for your tool.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const newTool = await generateToolFromDescription(description);
      setIsDialogOpen(false);
      setDescription("");
      navigate(`/tool/${newTool.id}`);
    } catch (error) {
      console.error("Error generating tool:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (toolsLoading) {
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {user?.email?.split("@")[0] || "User"}
              </h1>
              <p className="text-muted-foreground">
                Manage your custom tools and create new ones
              </p>
            </div>

            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    New Tool
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a New Tool</DialogTitle>
                    <DialogDescription>
                      Describe what tool you need and our AI will generate it
                      for you.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label
                        htmlFor="description"
                        className="text-sm font-medium mb-2 block"
                      >
                        Tool Description
                      </label>
                      <Input
                        id="description"
                        placeholder="e.g., I need a tool to track package deliveries for my drivers"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Be specific about what data you want to track and how
                        you want to visualize it.
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleGenerateTool}
                      disabled={isGenerating || !description.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Tool"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <Card
                  key={tool.id}
                  className="cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
                  onClick={() => navigate(`/tool/${tool.id}`)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="mb-1">{tool.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {tool.description}
                        </CardDescription>
                      </div>
                      {tool.isDeployed && (
                        <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded-full">
                          Deployed
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-muted-foreground">
                        {new Date(tool.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-primary">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full h-64 flex flex-col items-center justify-center bg-muted/30 rounded-lg border border-dashed">
                <LayoutDashboard className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No tools found</h3>
                <p className="text-center text-muted-foreground mb-4">
                  {searchQuery
                    ? "No tools match your search query."
                    : "You haven't created any tools yet."}
                </p>
                {!searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first tool
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
