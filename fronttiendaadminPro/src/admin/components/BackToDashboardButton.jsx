import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BackToDashboardButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/admin/dashboard")}
      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      <ChevronLeft className="h-4 w-4 mr-1" /> Dashboard
    </button>
  );
};

export default BackToDashboardButton;
