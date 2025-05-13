
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Page not found</h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button size="lg">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
