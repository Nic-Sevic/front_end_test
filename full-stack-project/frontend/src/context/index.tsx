import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StateType {
    // Define the shape of your state here
    [key: string]: any;
}

interface AppContextType {
    state: StateType;
    setState: React.Dispatch<React.SetStateAction<StateType>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [state, setState] = useState<StateType>({});

    return (
        <AppContext.Provider value={{ state, setState }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

