
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Users,
  Shield,
  Zap,
  Clock
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Database className="w-8 h-8 text-primary" />,
      title: "Smart Schema Generation",
      description: "Automatically create the perfect database structure based on your description, with intelligent field types and relationships."
    },
    {
      icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
      title: "Custom Dashboards",
      description: "Get beautiful, functional dashboards that match your specific needs, automatically generated from your tool description."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Dynamic Visualizations",
      description: "Turn your data into insights with automatically generated charts, graphs and visual representations."
    },
    {
      icon: <Table className="w-8 h-8 text-primary" />,
      title: "Flexible Data Tables",
      description: "Create, edit and manage your data with powerful tables that include sorting, filtering and exporting capabilities."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Team Collaboration",
      description: "Share your tools with team members and collaborate in real-time with role-based permissions."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Secure Data Storage",
      description: "Your data is securely stored and encrypted with enterprise-grade security powered by Supabase."
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "AI-Powered Insights",
      description: "Get automatic summaries and insights from your data using advanced AI analysis."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Quick Deployment",
      description: "Deploy your tools instantly with zero infrastructure setup or maintenance required."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Powerful features for your <span className="text-primary">custom tools</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Transform your workflows with AI-powered tools that adapt to your specific needs.
              All the power of custom software with none of the complexity.
            </p>
            <Link to="/signup">
              <Button size="lg">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-8 border shadow-sm hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-3 bg-primary/10 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Dashboard Examples */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visualize your data your way</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from multiple visualization options to get the perfect view of your data
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl overflow-hidden border shadow-md">
              <div className="p-4 bg-primary/10 border-b">
                <h3 className="font-medium">Task Tracker Dashboard</h3>
              </div>
              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <div className="bg-muted p-4 rounded-lg text-center flex-1 mr-4">
                    <PieChart className="w-10 h-10 mb-2 mx-auto text-primary" />
                    <div className="text-2xl font-semibold">68%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center flex-1">
                    <LineChart className="w-10 h-10 mb-2 mx-auto text-primary" />
                    <div className="text-2xl font-semibold">24</div>
                    <div className="text-sm text-muted-foreground">Tasks Due Today</div>
                  </div>
                </div>
                <div className="bg-muted h-48 rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Task distribution chart</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl overflow-hidden border shadow-md">
              <div className="p-4 bg-primary/10 border-b">
                <h3 className="font-medium">Inventory Management</h3>
              </div>
              <div className="p-6">
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Low Stock Items</span>
                    <span className="text-primary font-medium">12 items</span>
                  </div>
                  <div className="h-2 bg-muted-foreground/20 rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map(item => (
                    <div key={item} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">Product {item}</div>
                        <div className="text-sm text-muted-foreground">SKU-00{item}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item * 5} units</div>
                        <div className="text-sm text-red-500">Low stock</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to build your custom tools?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of teams who have simplified their processes with Magic Tools.
            Get started for free in just a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary">
                Create Free Account
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-primary/20 hover:bg-primary/30 border-white/20">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
