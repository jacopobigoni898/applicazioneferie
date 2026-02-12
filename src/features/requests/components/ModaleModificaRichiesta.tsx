// Modale per la modifica di una richiesta esistente.
// Gestisce selezione date con picker iOS/Android e stato approvazione con dropdown.
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { stiliModaleRichiesta } from "../../../core/style/commonStyles";
import { Colori } from "../../../core/theme/theme";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { InputAggiornamentoRichiesta } from "../services/requestsService";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import { useFormRichiesta } from "../hooks/useRequestForm";
import InvolucroModale from "../../../shared/components/InvolucroModale";
import SelettoreDataPiattaforma from "../../../shared/components/SelettoreDataPiattaforma";
import { useSelettoreDataModifica } from "../../../shared/hooks/useSelettoreDataModifica";

// Opzioni dropdown per lo stato di approvazione
const OPZIONI_STATO = [
  { etichetta: "Approvato", valore: StatoRichiesta.APPROVATO },
  { etichetta: "Non validato", valore: StatoRichiesta.IN_ATTESA },
  { etichetta: "Annullato", valore: StatoRichiesta.RIFIUTATO },
];

export interface PropsModaleModifica {
  visibile: boolean;
  elemento: RichiestaFerie | null;
  suChiusura: () => void;
  suConferma: (payload: InputAggiornamentoRichiesta) => void;
  inSalvataggio?: boolean;
}

const ModaleModificaRichiesta = ({
  visibile,
  elemento,
  suChiusura,
  suConferma,
  inSalvataggio = false,
}: PropsModaleModifica) => {
  const [inFocus, impostaInFocus] = useState(false);

  // Hook del form in modalità modifica
  const {
    dataInizio,
    dataFine,
    impostaDataInizio,
    impostaDataFine,
    stato,
    impostaStato,
    formattaData,
    gestisciInvioModifica,
  } = useFormRichiesta({
    modalita: "modifica",
    visibile,
    dataInizio: elemento?.data_inizio ?? null,
    dataFine: elemento?.data_fine ?? null,
    idRichiesta: elemento?.id_richiesta ?? 0,
    statoIniziale: elemento?.stato_approvazione as StatoRichiesta,
    suInvio: suConferma,
  });

  // Hook per la gestione dei selettori data
  const selettore = useSelettoreDataModifica({
    visibile,
    dataInizio,
    dataFine,
    impostaDataInizio,
    impostaDataFine,
  });

  // Controlla se è richiesta per un singolo giorno
  const eGiornoSingolo = useMemo(() => {
    if (!dataInizio || !dataFine) return true;
    return (
      dataInizio.toISOString().slice(0, 10) ===
      dataFine.toISOString().slice(0, 10)
    );
  }, [dataInizio, dataFine]);

  return (
    <InvolucroModale visibile={visibile} suChiusura={suChiusura}>
      <Text style={stiliModaleRichiesta.titoloIntestazione}>
        Modifica richiesta
      </Text>
      {elemento?.tipo_permesso ? (
        <Text style={stiliModaleRichiesta.sottointestazione}>
          {elemento.tipo_permesso}
        </Text>
      ) : null}

      <Text style={stiliModaleRichiesta.etichetta}>Periodo</Text>
      <View style={stiliModaleRichiesta.rigaDate}>
        <View style={stiliModaleRichiesta.casellaData}>
          <Text style={stiliModaleRichiesta.etichettaData}>Dal:</Text>
          <TouchableOpacity
            style={stiliModaleRichiesta.inputOrario}
            onPress={() => selettore.apriSelettore("inizio")}
          >
            <Text style={stiliModaleRichiesta.valoreData}>
              {formattaData(dataInizio)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={stiliModaleRichiesta.casellaData}>
          <Text style={stiliModaleRichiesta.etichettaData}>Al:</Text>
          <TouchableOpacity
            style={stiliModaleRichiesta.inputOrario}
            onPress={() => selettore.apriSelettore("fine")}
          >
            <Text style={stiliModaleRichiesta.valoreData}>
              {formattaData(dataFine)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={stiliModaleRichiesta.etichetta}>Stato approvazione</Text>
      <Dropdown
        style={[
          stiliModaleRichiesta.menuATendina,
          inFocus && { borderColor: Colori.primario },
        ]}
        placeholderStyle={stiliModaleRichiesta.stileSegnaposto}
        selectedTextStyle={stiliModaleRichiesta.stileTestoSelezionato}
        data={OPZIONI_STATO}
        labelField="etichetta"
        valueField="valore"
        placeholder="Seleziona..."
        value={stato}
        onFocus={() => impostaInFocus(true)}
        onBlur={() => impostaInFocus(false)}
        onChange={(voce) => {
          impostaStato(voce.valore as StatoRichiesta);
          impostaInFocus(false);
        }}
      />

      <Text style={stiliModaleRichiesta.sottointestazione}>
        {eGiornoSingolo
          ? "Richiesta singolo giorno"
          : "Richiesta multi giorno"}
      </Text>

      <View style={stiliModaleRichiesta.rigaPulsanti}>
        <TouchableOpacity
          style={stiliModaleRichiesta.pulsanteAnnulla}
          onPress={suChiusura}
          disabled={inSalvataggio}
        >
          <Text style={stiliModaleRichiesta.testoPulsanteAnnulla}>
            Annulla
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            stiliModaleRichiesta.pulsanteConferma,
            inSalvataggio && stiliModaleRichiesta.pulsanteDisabilitato,
          ]}
          onPress={gestisciInvioModifica}
          disabled={inSalvataggio}
        >
          <Text style={stiliModaleRichiesta.testoPulsanteConferma}>
            {inSalvataggio ? "Salvataggio..." : "Salva"}
          </Text>
        </TouchableOpacity>
      </View>

      <SelettoreDataPiattaforma
        visibile={selettore.mostraSelettoreInizio}
        valore={dataInizio ?? new Date()}
        valoreTemp={selettore.dataInizioTemp ?? undefined}
        suCambio={(e, d) => selettore.gestisciCambioData("inizio", e, d)}
        suChiudi={() => selettore.chiudiSelettore("inizio")}
        suConferma={() => selettore.confermaSelettore("inizio")}
      />
      <SelettoreDataPiattaforma
        visibile={selettore.mostraSelettoreFine}
        valore={dataFine ?? new Date()}
        valoreTemp={selettore.dataFineTemp ?? undefined}
        suCambio={(e, d) => selettore.gestisciCambioData("fine", e, d)}
        suChiudi={() => selettore.chiudiSelettore("fine")}
        suConferma={() => selettore.confermaSelettore("fine")}
      />
    </InvolucroModale>
  );
};

export default ModaleModificaRichiesta;
