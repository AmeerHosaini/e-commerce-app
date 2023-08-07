import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "../locales/en/translation.json";
import translationFA from "../locales/fa/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  fa: {
    translation: translationFA,
  },
};

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources,
//     lng: "en", // set as en as default
//     fallbackLng: "en",
//     debug: true,
//     interpolation: {
//       escapeValue: false,
//     },
//   });

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem("i18nextLng") || "en",
    // lng: "en",
    resources,
    // backend: {
    //   loadPath: `http://127.0.0.1:5000/locales/{{lng}}/{{ns}}.json`,
    // },
    fallbackLng: "en",
    debug: false,
    keySeparator: false,
    // react: {
    //   useSuspense: true,
    // },
    interpolation: {
      escapeValue: true,
      formatSeparator: ",",
    },
    ns: ["translation"],
    defaultNS: ["translation"],
  });
export default i18n;
