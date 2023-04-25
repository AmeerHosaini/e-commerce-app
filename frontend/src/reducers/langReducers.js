import {
  CHANGE_LANG_TO_EN,
  CHANGE_LANG_TO_FA,
} from "../constants/langConstants";

export const changeLangReducer = (state = { lang: "en" }, action) => {
  switch (action.type) {
    case CHANGE_LANG_TO_EN:
      return { lang: "en" };
    case CHANGE_LANG_TO_FA:
      return { lang: "fa" };
    default:
      return state;
  }
};
