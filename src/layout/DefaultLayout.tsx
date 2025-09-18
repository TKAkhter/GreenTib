import React, { useEffect } from "react";
import { Header } from "@/components/Header/Header";
import { LayoutProps } from "@/types/types";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { isTokenValid } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const DefaultLayout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!isTokenValid(token)) {
      navigate("/login");
    }
  }, [token]);

  const showBackButton = location.pathname !== "/dashboard";
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 container mx-auto">
        <>
          <div className="flex items-center my-4">
            {showBackButton && (
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-lg font-semibold">{showBackButton ? "Back" : "Dashboard"}</h1>
          </div>
          {children}
        </>
      </main>
    </div>
  );
};
