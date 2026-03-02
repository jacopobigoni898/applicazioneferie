// Funzioni di utilità per la manipolazione delle stringhe.

// Restituisce la stringa con la prima lettera di ogni parola maiuscola
export function capitalizza(testo?: string): string {
  if (!testo) return "";
  return testo
    .toLowerCase()
    .split(" ")
    .map((parola) => parola.charAt(0).toUpperCase() + parola.slice(1))
    .join(" ");
}
