import {
  CHANGE_LANG_TO_EN,
  CHANGE_LANG_TO_FA,
} from "../constants/langConstants";

export const changeLanguage = (language) => (dispatch) => {
  // const languageJSON = JSON.stringify(language); // Convert language object to JSON string because ls only stores strings
  // localStorage.setItem("language", languageJSON);
  if (language === "en") {
    dispatch({ type: CHANGE_LANG_TO_EN });
  } else if (language === "fa") {
    dispatch({ type: CHANGE_LANG_TO_FA });
  }
};
