'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setUnsavedChanges: (value: boolean) => void;
  triggerShake: () => void;
  saveChanges: () => void;
  discardChanges: () => void;
  confirmNavigation: (url: string) => void;
  setSaveCallback: (callback: () => void) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export const UnsavedChangesProvider = ({ children }: { children: ReactNode }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [shake, setShake] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [saveCallback, setSaveCallback] = useState<(() => void) | null>(null); // Add save callback


  const router = useRouter();

  const triggerShake = useCallback(() => {
    if (hasUnsavedChanges) {
      setShake(true);
      setTimeout(() => setShake(false), 500); // Reset shake animation
    }
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Shows the browser confirmation dialog
      }
    };

    const handlePopState = () => {
      if (hasUnsavedChanges) {
        triggerShake(); // Show the shake animation or notification
        window.history.pushState(null, '', window.location.href); // Re-block navigation
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState); // Handle back/forward navigation

    // Push the current state to history to handle navigation
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges, triggerShake]);




  const saveChanges = useCallback(() => {
    if (saveCallback) {
      saveCallback();
    }
    setHasUnsavedChanges(false); // Reset unsaved changes
    if (pendingNavigation) {
      router.push(pendingNavigation); // Proceed with pending navigation
      setPendingNavigation(null);
    }
  }, [saveCallback, pendingNavigation, router]);



  const discardChanges = useCallback(() => {
    setHasUnsavedChanges(false); // Reset unsaved changes
    if (pendingNavigation) {
      router.push(pendingNavigation); // Proceed with pending navigation
      setPendingNavigation(null);
    }
  }, [pendingNavigation, router]);

  const confirmNavigation = useCallback(
    (url: string) => {
      if (hasUnsavedChanges) {
        triggerShake();
        setPendingNavigation(url); // Save pending navigation
        window.history.pushState(null, '', window.location.href); // Block navigation
      } else {
        router.push(url); // Navigate immediately
      }
    },
    [hasUnsavedChanges, router, triggerShake]
  );

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        setUnsavedChanges: setHasUnsavedChanges,
        triggerShake,
        saveChanges,
        discardChanges,
        confirmNavigation,
        setSaveCallback,
      }}
    >
      {children}
      {hasUnsavedChanges && (
        <div
          className={`fixed top-0 left-0 w-full bg-gray-100 p-4 shadow-lg flex justify-between items-center transition-transform ${shake ? 'shake-animation' : ''
            }`}
        >
          <p className="text-gray-800">You have unsaved changes</p>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              onClick={discardChanges}
            >
              Discard
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
              onClick={saveChanges} // Ensure this triggers saveChanges
            >
              Save
            </button>

          </div>
        </div>
      )}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error('useUnsavedChanges must be used within a UnsavedChangesProvider');
  }
  return context;
};
