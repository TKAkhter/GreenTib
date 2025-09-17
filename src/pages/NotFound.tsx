import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type NotFoundProps = {
  isAuthenticated: boolean;
};

const NotFound: React.FC<NotFoundProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl">404 - Page Not Found</CardTitle>
          <CardDescription>
            Sorry, the page you’re looking for doesn’t exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRedirect} className="w-full mt-4">
            {isAuthenticated ? "Go to Dashboard" : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
