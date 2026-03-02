// Colori del brand e dell'interfaccia
export const Colori = {
  primario: "#F7B458",
  secondario: "#f0f0f0",
  accento: "#ff6b6b",
  evidenza: "#deba67",
  intestazione: "#ffffff",
  sfondo: "#ffffff",
  superficie: "#f9f9f9",
  superficiecard: "#ffefd9",
  testoPrimario: "#000000",
  testoSecondario: "#808080",
  testoDisabilitato: "#999999",
  segnaposto: "#666666",
  errore: "#d32f2f",
  successo: "#388e3c",
  bordo: "#e0e0e0",
  ombra: "#000000",
  bianco: "#ffffff",
  disabilitato: "#CCCCCC",
  interruttoreOff: "#d3d6dc",
  interruttoreThumb: "#f4f4f4",
  sfondoInput: "#F5F5F5",
  testoRiga: "#6b7280",

  // Colori badge stato
  badgeApprovato: "#16a34a",
  badgeRifiutato: "#dc2626",
  badgeInAttesa: "#f59e0b",
  badgeValidata: "#D1FAE5",
  badgeAutorizzata: "#DBEAFE",
  badgeRifiutataChiara: "#FEE2E2",
  badgeInAttesaChiara: "#FEF3C7",

  // Colori azioni
  azioneModificaSfondo: "#eff6ff",
  azioneModificaTesto: "#2563eb",
  azioneEliminaSfondo: "#fef2f2",
  azioneEliminaTesto: "#dc2626",
  azioneAutorizzaSfondo: "#f0fdf4",
  azioneAutorizzaTesto: "#16a34a",
  azioneValidaSfondo: "#3b82f6",

  // Colori login
  loginSfondo: "#0e1a2b",
  loginScheda: "#13233a",
  loginTesto: "#c7d2e5",
  loginPulsante: "#2f7cf6",
};

// Tipografia dell'applicazione
export const Tipografia = {
  dimensione: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  peso: {
    regolare: "400" as const,
    grassetto: "700" as const,
    sottile: "110" as const,
    leggero: "300" as const,
    medio: "500" as const,
  },
};

// Spaziatura dell'interfaccia
export const Spaziatura = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  titolo: 28,
  titoloSinistra: 16,
  margineFondoTitolo: 30,
};
