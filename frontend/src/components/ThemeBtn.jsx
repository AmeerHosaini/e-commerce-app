// import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../actions/themeActions";
// const ThemeBtn = () => {
//   // const getLocalStorageTheme = () => {
//   //   let theme = "light-theme";
//   //   if (localStorage.getItem("theme")) {
//   //     theme = localStorage.getItem("theme");
//   //   }
//   //   return theme;
//   // };
//   // const [theme, setTheme] = useState(getLocalStorageTheme());
//   // const toggleTheme = () => {
//   //   if (theme === "light-theme") {
//   //     setTheme("dark-theme");
//   //   } else {
//   //     setTheme("light-theme");
//   //   }
//   // };
//   // useEffect(() => {
//   //   // update the localstorage when theme state is changed
//   //   document.documentElement.className = theme;
//   //   localStorage.setItem("theme", theme);
//   // }, [theme]);
//   // return (
//   //   <button className="theme-btn" onClick={toggleTheme}>
//   //     {theme === "light-theme" ? (
//   //       <i className="fas fa-moon"></i>
//   //     ) : (
//   //       <i className="fas fa-sun"></i>
//   //     )}
//   //   </button>
//   // );
// };

// export default ThemeBtn;
//
