import {
  CHANGE_LANG_TO_EN,
  CHANGE_LANG_TO_FA,
} from "../constants/langConstants";

export const changeLanguage = (language) => (dispatch) => {
  if (language === "en") {
    dispatch({ type: CHANGE_LANG_TO_EN });
  } else if (language === "fa") {
    dispatch({ type: CHANGE_LANG_TO_FA });
  }
};
