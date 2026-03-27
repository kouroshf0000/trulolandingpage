import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/salesteam", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f7f4]">
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-[#475569]">Redirecting…</p>
      </div>
    </div>
  );
}
