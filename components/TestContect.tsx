import React, { useContext, useState, createContext } from "react";

const ThemeConent = createContext({});
const ThemeUpdate = createContext({});

export const ThemeProvider = ({children}:{children:JSX.Element}) => {
    const [dark, setDark] = useState(true);


    const toggleTheme = () => {
        console.log('toggleTheme');
        setDark(prev => !prev);
    }
    return(
        <ThemeConent.Provider value={dark}>
            <ThemeUpdate.Provider value={toggleTheme}>
                {children}
            </ThemeUpdate.Provider>
        </ThemeConent.Provider>
    )
}

export const useTheme = () => {
    return useContext(ThemeConent);
}

export const useThemeUpdate = () => {
    return useContext(ThemeUpdate);
}