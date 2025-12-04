import { AlertTriangle, Trash2 } from "lucide-react";

function AlertModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="modal-content rounded-2xl p-5 w-full max-w-sm animate-scale-in">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-primary">{title}</h2>
            <p className="text-secondary text-sm mt-1">{message}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2 btn-secondary rounded-lg font-medium text-sm"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 btn-danger rounded-lg font-medium text-sm flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
