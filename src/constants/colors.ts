import { useContext } from "react";
import { DarkModeContext } from "../contexts/DarkModeContext"

export const useColors = () => {
    const { isDarkMode } = useContext(DarkModeContext);
    
    return {
        primary: '#305b69',
        secondary: '#f2ae41',
        background_color: isDarkMode ? '#222222' : '#ffffff',
        text_color: isDarkMode ? '#ffffff' : '#000000',
    };
}

export default {
    primary: '#305b69',
    secondary: '#f2ae41',
    background_color: '#ffffff',
    text_color: '#000000',
}