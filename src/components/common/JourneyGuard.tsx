import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { httpService } from "../../services/httpService";
import { useAuth } from "../../contexts/AuthContext";
import { Spin } from "antd";

const JourneyGuard = ({ children }: { children: React.ReactNode }) => {
  const [journeyStage, setJourneyStage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    checkAuthAndJourney();
  }, []);

  const checkAuthAndJourney = async () => {
    // First check if user is authenticated
    if (!isAuthenticated()) {
      // If not authenticated and not on auth pages, redirect to login
      if (!location.pathname.startsWith("/auth/")) {
        setLoading(false);
        return;
      }
    }

    // If authenticated or on auth pages, check journey stage
    try {
      const response = await httpService.get("/journey/start");
      setJourneyStage(response.data.stage);
    } catch (error) {
      console.error("Error checking journey stage:", error);
      // If API fails and user is authenticated, assume journey is done
      if (isAuthenticated()) {
        setJourneyStage("done");
      } else {
        // If not authenticated, assume welcome stage (first time setup)
        setJourneyStage("welcome");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#ffffff",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // If not authenticated and not on auth pages, redirect to login
  if (!isAuthenticated() && !location.pathname.startsWith("/auth/")) {
    return <Navigate to="/auth/login" replace />;
  }

  // If authenticated and on auth pages, redirect to main app
  if (isAuthenticated() && location.pathname.startsWith("/auth/")) {
    return <Navigate to="/projects" replace />;
  }

  // Journey stage checks (only for non-authenticated users or setup flow)
  if (!isAuthenticated()) {
    // If journey stage is welcome and we're not on welcome page, redirect to welcome
    if (journeyStage === "welcome" && !location.pathname.includes("/welcome")) {
      return <Navigate to="/auth/welcome" replace />;
    }

    // If journey stage is done and we're on welcome page, redirect to login
    if (journeyStage === "done" && location.pathname.includes("/welcome")) {
      return <Navigate to="/auth/login" replace />;
    }
  }

  return <>{children}</>;
};

export default JourneyGuard;
