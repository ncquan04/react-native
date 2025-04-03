import { createContext, useState } from "react";

interface DarkModeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export const DarkModeContext = createContext<DarkModeContextType>({
    isDarkMode: false,
    toggleDarkMode: () => {},
});

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};