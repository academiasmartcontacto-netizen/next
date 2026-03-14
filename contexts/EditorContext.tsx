'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

// TODO: Define strong types for the store state
interface StoreState {
    [key: string]: any;
}

interface EditorContextType {
    store: StoreState;
    updateStore: (field: string, value: any) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children, initialStoreData }: { children: ReactNode, initialStoreData: StoreState }) {
    const [store, setStore] = useState<StoreState>(initialStoreData);

    const debouncedUpdate = useDebouncedCallback(async (newStoreState) => {
        try {
            await fetch('/api/editor/store', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStoreState),
            });
            // TODO: Add user feedback (e.g., a toast notification)
        } catch (error) {
            console.error("Failed to save store data", error);
            // TODO: Handle error state
        }
    }, 1000); // Debounce time of 1 second

    const updateStore = (field: string, value: any) => {
        const newStore = { ...store, [field]: value };
        setStore(newStore);
        debouncedUpdate(newStore);
    };

    return (
        <EditorContext.Provider value={{ store, updateStore }}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
}
