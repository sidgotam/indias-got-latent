import React from 'react';

export default function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map((toast) => {
        const iconClass = toast.type === 'success' 
          ? 'fa-solid fa-circle-check' 
          : 'fa-solid fa-circle-info';
        return (
          <div 
            key={toast.id} 
            className={`toast toast-${toast.type || 'info'}`}
          >
            <i className={iconClass}></i>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
