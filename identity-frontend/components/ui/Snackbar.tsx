'use client';

import { useEffect } from 'react';

export type SnackbarVariant = 'success' | 'error' | 'warning' | 'info';

interface SnackbarProps {
  message: string;
  variant: SnackbarVariant;
  onClose: () => void;
  duration?: number;
}

const variantStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-800',
    icon: '✅',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-800',
    icon: '❌',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-800',
    icon: '⚠️',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-800',
    icon: 'ℹ️',
  },
};

export function Snackbar({ message, variant, onClose, duration = 5000 }: SnackbarProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const style = variantStyles[variant];

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 min-w-[350px] max-w-[500px] w-auto animate-slide-up shadow-lg rounded-lg border-l-4 ${style.border} ${style.bg}`}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="text-xl flex-shrink-0">{style.icon}</span>
        <p className={`flex-1 text-sm font-medium ${style.text}`}>{message}</p>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${style.text} hover:opacity-70 transition-opacity`}
          aria-label="Close notification"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-gray-200 overflow-hidden rounded-b-lg">
        <div
          className={`h-full ${style.border.replace('border-', 'bg-')} animate-shrink`}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
