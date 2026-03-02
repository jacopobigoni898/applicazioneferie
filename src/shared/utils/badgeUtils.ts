// Funzioni di utilità per il calcolo del colore dei badge di stato.
import { Colori } from "../../core/theme/theme";

// Determina il colore del badge in base allo stato della richiesta
export function calcolaColoreBadge(stato: string): string {
  const statoMinuscolo = (stato || "").toLowerCase();
  if (
    statoMinuscolo.includes("approv") ||
    statoMinuscolo.includes("valid") ||
    statoMinuscolo === "validata"
  ) {
    return Colori.badgeApprovato;
  }
  if (statoMinuscolo.includes("rifiut") || statoMinuscolo.includes("annull")) {
    return Colori.badgeRifiutato;
  }
  return Colori.badgeInAttesa;
}
