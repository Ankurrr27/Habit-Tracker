// Merged into AboutPage as a tab — redirect there
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HowToUsePage() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/about", { replace: true }); }, [navigate]);
  return null;
}
