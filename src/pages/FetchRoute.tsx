import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FetchRouteProps } from "../global.d";

export default function FetchRoute({ children }: FetchRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_FETCH_API_URL}/dogs/breeds`, {
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
