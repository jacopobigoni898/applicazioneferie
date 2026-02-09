import React from "react";

// Provider di autenticazione (segnaposto)
// Qui andrà la logica di autenticazione dell'applicazione
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return <>{children}</>;
};

// Hook per accedere al contesto di autenticazione (segnaposto)
export const useAuth = () => {
    return {};
};

export default AuthProvider;
