import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

function Snackbar({ message, type = "success", isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const styles = {
    success: "snackbar-success",
    error: "snackbar-error",
    info: "snackbar-info",
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-slide-up">
      <div
        className={`${styles[type]} px-4 py-3 rounded-xl shadow-lg flex items-center gap-3`}
      >
        {icons[type]}
        <span className="font-medium text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-1 text-white/70 hover:text-white transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default Snackbar;
