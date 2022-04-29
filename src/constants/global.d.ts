import '@react-navigation/native';

// Override the useTheme() return type from react-navigation
declare module '@react-navigation/native' {
  export type ExtendedColors = {
    primary: string;
    secondary: string;
    mango: string;
    tertiary: string;
    success: string;
    pink: string;
    gray: string;
    background: string;
    card: string;
    text: string;
    purple: string;
    border: string;
    notification: string;
    darkgrey: string;
  };

  export type ExtendedTheme = {
    colors: ExtendedColors;
  };
  export function useTheme(): ExtendedTheme;
}
