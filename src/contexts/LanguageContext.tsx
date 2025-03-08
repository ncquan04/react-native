import React, { createContext, useState, ReactNode, useEffect } from "react";
import en from "../languages/en.json";
import vi from "../languages/vi.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const languages: Record<string, Record<string, string>> = {
    en,
    vi,
};

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: Record<string, string>;
}

export const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    setLanguage: () => { },
    t: languages.en,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>('en');

    useEffect(() => {
        const fetchLanguage = async () => {
            const lang = await AsyncStorage.getItem('language');
            if (lang) {
                setLanguage(lang);
            }
        }

        fetchLanguage();
    }, []);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: languages[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};
