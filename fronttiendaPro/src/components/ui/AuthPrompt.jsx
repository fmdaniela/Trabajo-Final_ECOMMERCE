import { useNavigate } from "react-router-dom";

const AuthPrompt = ({ mensaje }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-pink-50 border border-pink-200 text-pink-700 px-3 py-2 rounded mb-3 flex items-center gap-2 text-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 text-pink-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M12 9v2m0 4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
        />
      </svg>
      <span>
        {mensaje}{" "}
        <span
          onClick={() => navigate("/login")}
          className="font-semibold cursor-pointer hover:underline"
        >
          iniciar sesión
        </span>
        .
      </span>
    </div>
  );
};

export default AuthPrompt;
