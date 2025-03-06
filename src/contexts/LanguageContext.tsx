import React, { createContext, useState, ReactNode } from "react";
import { I18nManager } from "react-native";

type LanguageKeys = "en" | "vi";

const languages: Record<LanguageKeys, Record<string, string>> = {
    en: { welcome: "Welcome", changeLanguage: "Change Language" , language: "Language", settings: "Settings" },
    vi: { welcome: "Chào mừng", changeLanguage: "Đổi ngôn ngữ" , language: "Ngôn ngữ", settings: "Cài đặt" },
};

interface LanguageContextType {
    language: LanguageKeys;
    setLanguage: (lang: LanguageKeys) => void;
    t: Record<string, string>;
}

export const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    setLanguage: () => { },
    t: languages.en,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<LanguageKeys>("en");

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: languages[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};
