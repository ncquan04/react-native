import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import switchTheme from "react-native-theme-switch-animation";

interface Theme {
    primary_color: string,
    secondary_color: string,
    background_color: string,
    text_color: string,
    contrast_text_color: string,
}

const lightTheme: Theme = {
    primary_color: '#2a3a45',
    secondary_color: '#f2ae41',
    background_color: '#ffffff',
    text_color: '#ffffff',
    contrast_text_color: '#000000',
}

const darkTheme: Theme = {
    primary_color: '#344955',
    secondary_color: '#d9a441',
    background_color: '#182024',
    text_color: '#ffffff',
    contrast_text_color: '#ffffff',
}

interface DarkModeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    theme: Theme;
}

export const DarkModeContext = createContext<DarkModeContextType>({
    isDarkMode: false,
    toggleDarkMode: () => {},
    theme: lightTheme,
});

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const saveSetting = async () => {
        await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }

    useEffect(() => {
        const fetchDarkModeSetting = async () => {
            try {
                const value = await AsyncStorage.getItem('isDarkMode');
                if (value !== null) {
                    setIsDarkMode(JSON.parse(value));
                }
            } catch (error) {
                console.error("Error fetching dark mode setting:", error);
            }
        }
        fetchDarkModeSetting();
    }, []);

    useEffect(() => {
        const theme = isDarkMode ? darkTheme : lightTheme;
        StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
        StatusBar.setBackgroundColor(theme.background_color);
    }, [isDarkMode])

    const toggleDarkMode = () => {
        switchTheme({
          switchThemeFunction: () => setIsDarkMode((prev) => !prev),
          animationConfig: {
            type: "fade",
            duration: 1000,
          },
        });
        saveSetting();
      };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, theme: isDarkMode ? darkTheme : lightTheme }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);