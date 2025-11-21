'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, SnackbarVariant } from '../components/ui/Snackbar';

interface SnackbarMessage {
  id: string;
  message: string;
  variant: SnackbarVariant;
}

interface SnackbarContextType {
  showSnackbar: (message: string, variant: SnackbarVariant) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const showSnackbar = useCallback((message: string, variant: SnackbarVariant) => {
    const id = Date.now().toString();
    setSnackbars((prev) => [...prev, { id, message, variant }]);
  }, []);

  const showSuccess = useCallback((message: string) => {
    showSnackbar(message, 'success');
  }, [showSnackbar]);

  const showError = useCallback((message: string) => {
    showSnackbar(message, 'error');
  }, [showSnackbar]);

  const showWarning = useCallback((message: string) => {
    showSnackbar(message, 'warning');
  }, [showSnackbar]);

  const showInfo = useCallback((message: string) => {
    showSnackbar(message, 'info');
  }, [showSnackbar]);

  const removeSnackbar = useCallback((id: string) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      {/* Render snackbars - stack them from bottom */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {snackbars.map((snackbar, index) => (
          <div
            key={snackbar.id}
            className="pointer-events-auto"
            style={{
              transform: `translateY(-${index * 8}px)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <Snackbar
              message={snackbar.message}
              variant={snackbar.variant}
              onClose={() => removeSnackbar(snackbar.id)}
            />
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};
