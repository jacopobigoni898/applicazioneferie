// Hook per la gestione dello stato di modifica di una richiesta.
// Gestisce il contesto dell'elemento in modifica, lo stato di salvataggio
// e la logica di conferma con gestione errori.
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { InputAggiornamentoFerie } from "../services/requestsService";

type FunzioneAggiornamento = (
  payload: InputAggiornamentoFerie,
) => Promise<void>;

type ContestoModifica = {
  elemento: RichiestaFerie;
  funzioneAggiornamento: FunzioneAggiornamento;
};

export function useModificaRichiesta() {
  const [contesto, impostaContesto] = useState<ContestoModifica | null>(null);
  const [inSalvataggio, impostaInSalvataggio] = useState(false);

  // Apre la modale di modifica per un elemento specifico
  const apriModifica = useCallback(
    (
      elemento: RichiestaFerie,
      funzioneAggiornamento: FunzioneAggiornamento,
    ) => {
      impostaContesto({ elemento, funzioneAggiornamento });
    },
    [],
  );

  // Chiude la modale di modifica
  const chiudiModifica = useCallback(() => {
    impostaContesto(null);
  }, []);

  // Conferma la modifica e gestisce errori
  const confermaModifica = useCallback(
    async (payload: InputAggiornamentoFerie) => {
      if (!contesto) return;
      try {
        impostaInSalvataggio(true);
        await contesto.funzioneAggiornamento(payload);
        //console.log(payload);
        impostaContesto(null);
      } catch (err: unknown) {
        const messaggio =
          typeof err === "object" && err !== null
            ? (err as any)?.response?.data?.message ||
              (err as any)?.message ||
              "Errore durante l'aggiornamento"
            : "Errore durante l'aggiornamento";
        Alert.alert("Errore", messaggio);
      } finally {
        impostaInSalvataggio(false);
      }
    },
    [contesto],
  );

  return {
    elementoInModifica: contesto?.elemento ?? null,
    modaleVisibile: !!contesto,
    inSalvataggio,
    apriModifica,
    chiudiModifica,
    confermaModifica,
  } as const;
}
