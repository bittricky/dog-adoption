import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function FetchRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(import.meta.env.VITE_FETCH_API_URL, {
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        toast.error("Please login first");
        navigate("/");
      }
    });
  }, [navigate]);

  return <>{children}</>;
}
