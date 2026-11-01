"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Import translations
import en from "@/locales/en.json";
import bn from "@/locales/bn.json";

const translations = { en, bn };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Bangla is the default; English is only used if chosen during this browser session
  const [language, setLanguageState] = useState("bn");
  const [isLoaded, setIsLoaded] = useState(false);

  const applyToDocument = (lang) => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
    // Apply Bengali font globally when Bengali is selected
    document.body.classList.toggle("font-bengali", lang === "bn");
  };

  // On mount: restore this session's choice (if any), otherwise stay on Bangla
  useEffect(() => {
    let lang = "bn";
    try {
      // Drop the old persistent preference so a new visit always starts in Bangla
      localStorage.removeItem("language");
      const saved = sessionStorage.getItem("language");
      if (saved === "en" || saved === "bn") lang = saved;
    } catch (error) {
      console.error("Error loading language preference:", error);
    }
    setLanguageState(lang);
    applyToDocument(lang);
    setIsLoaded(true);
  }, []);

  // Save language choice for the current session only (cleared when the tab/browser is closed)
  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      sessionStorage.setItem("language", lang);
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
    applyToDocument(lang);
  }, []);

  // Translation function with nested key support (e.g., "navbar.home")
  const t = useCallback(
    (key, fallback = "") => {
      const keys = key.split(".");
      let result = translations[language];

      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = result[k];
        } else {
          // Fallback to English if key not found in current language
          let enResult = translations.en;
          for (const enK of keys) {
            if (enResult && typeof enResult === "object" && enK in enResult) {
              enResult = enResult[enK];
            } else {
              return fallback || key;
            }
          }
          return typeof enResult === "string" ? enResult : fallback || key;
        }
      }

      return (typeof result === "string" || Array.isArray(result) || (result && typeof result === "object")) ? result : fallback || key;
    },
    [language]
  );

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "bn" : "en");
  }, [language, setLanguage]);

  const value = {
    language,
    setLanguage,
    t,
    toggleLanguage,
    isLoaded,
    isBengali: language === "bn",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
