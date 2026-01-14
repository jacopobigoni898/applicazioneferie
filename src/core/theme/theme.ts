export const Colors = {
  // Brand colors
  primary: "#F7B458", // Il colore del tuo calendario
  secondary: "#f0f0f0",
  accent: "#ff6b6b",
  evidence: "#deba67",
  top: "#ffe786", //colore per il titolo
  // UI colors
  background: "#ffffff",
  surface: "#f9f9f9", // Per card o modali
  textPrimary: "#000000",
  textSecondary: "#808080",

  // Feedback
  error: "#d32f2f",
  success: "#388e3c",

  // Bordi
  border: "#e0e0e0",
};

export const Typography = {
  size: {
    sm: 12,
    md: 16, // Body standard
    lg: 20,
    xl: 24, // Titoli
    xxl: 32,
  },
  weight: {
    regular: "400" as const, // "as const" serve a TypeScript
    bold: "700" as const,
    thin: "110" as const,
    light: "300" as const,
    medium: "500" as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16, // Standard padding
  lg: 24,
  xl: 32,
  title: 28, //titolo paddingo top
  titleleft: 16, //margin left per il titolo della pagina
  marginbottomtitle: 30,
};
