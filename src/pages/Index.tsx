
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Check, LayoutDashboard, Table, PieChart } from "lucide-react";

export default function Index() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Create custom tools with <span className="text-primary">just a description</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Transform your ideas into functional tools in seconds. No coding required.
                Perfect for teams that need quick solutions to everyday problems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/signup">
                  <Button size="lg" className="group">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 animate-fade-in">
              <div 
                className="relative rounded-xl overflow-hidden border shadow-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="bg-gradient-to-r from-primary/10 to-secondary/20 p-4">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-background rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground mb-2">Describe what you need:</p>
                    <div className="font-medium bg-muted p-3 rounded-md mb-4">
                      "I need a tool to track package deliveries for my drivers with status and location updates."
                    </div>
                    <div className={`transition-all duration-500 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                      <div className="mt-4 space-y-1">
                        <p className="text-sm font-semibold">Your tool is ready!</p>
                        <p className="text-sm">📦 Package Tracker</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Tracking ID</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Status</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Driver</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Location</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Delivery Time</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From description to functional tool in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <LayoutDashboard className="w-10 h-10 mb-4 text-primary" />,
                title: "Describe Your Need",
                description: "Tell us what tool you need in plain language. No technical specifications required."
              },
              {
                icon: <Table className="w-10 h-10 mb-4 text-primary" />,
                title: "AI Creates Structure",
                description: "Our AI analyzes your description and generates the perfect data structure and interface."
              },
              {
                icon: <PieChart className="w-10 h-10 mb-4 text-primary" />,
                title: "Deploy & Use",
                description: "Your tool is ready to use immediately. Add data, collaborate, and visualize results."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-background rounded-xl p-8 text-center border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why teams love MagicTools</h2>
              <div className="space-y-4">
                {[
                  "No coding skills required",
                  "From idea to tool in seconds",
                  "Customizable to your needs",
                  "Share and collaborate with your team",
                  "Visual dashboards and reports",
                  "Secure data storage"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/signup">
                  <Button>Start Building</Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 lg:order-1">
              <div className="bg-muted rounded-xl p-6 md:p-8 border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Customer Support Tracker",
                    "Inventory Management",
                    "Team Task Allocator",
                    "Event Planning Tool"
                  ].map((tool, index) => (
                    <div key={index} className="bg-background rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{tool}</span>
                        <span className="text-xs text-white bg-primary px-2 py-1 rounded-full">Live</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <span className="text-muted-foreground text-sm">
                    + 100s more tools created by our users
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your workflow?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of teams who have simplified their processes with MagicTools.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
