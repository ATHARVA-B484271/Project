import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle size={20} color="#2dd4bf" />}
          {toast.type === 'error' && <AlertCircle size={20} color="#fca5a5" />}
          {toast.type === 'info' && <Info size={20} color="#818cf8" />}
          
          <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: '500' }}>
            {toast.message}
          </span>
          
          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
