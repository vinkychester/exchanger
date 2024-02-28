import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [theme, setTheme] = useState("light");
  const [mountedComponent, setMountedComponent] = useState(false);

  const setMode = mode => {
    window.localStorage.setItem("theme", mode);
    setTheme(mode);
  };

  const themeToggler = () => {
    theme === "light" ? setMode("dark") : setMode("light");
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (localTheme === null && colorScheme) {
      setTheme("dark");
    } else {
      localTheme ? setTheme(localTheme) : setTheme("light");
    }
    setMountedComponent(true);
  }, []);

  return [theme, themeToggler, mountedComponent];
};