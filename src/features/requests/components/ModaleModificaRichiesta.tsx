// Modale per la modifica di una richiesta esistente.
// Gestisce selezione date con SelettoreDataPiattaforma e stato approvazione con dropdown.
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { stiliModaleRichiesta } from "../../../core/style/commonStyles";
import { Colori } from "../../../core/theme/theme";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { InputAggiornamentoFerie } from "../services/requestsService";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import { useFormRichiesta } from "../hooks/useRequestForm";
import { useSelettoreDataModifica } from "../hooks/useSelettoreDataModifica";
import SelettoreDataPiattaforma from "./SelettoreDataPiattaforma";

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
  suConferma: (payload: InputAggiornamentoFerie) => void;
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

  // Stato apertura/chiusura selettori data
  const selettori = useSelettoreDataModifica(visibile);

  // Controlla se è richiesta per un singolo giorno
  const eGiornoSingolo = useMemo(() => {
    if (!dataInizio || !dataFine) return true;
    return (
      dataInizio.toISOString().slice(0, 10) ===
      dataFine.toISOString().slice(0, 10)
    );
  }, [dataInizio, dataFine]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visibile}
      onRequestClose={suChiusura}
    >
      <TouchableWithoutFeedback onPress={suChiusura}>
        <View style={stiliModaleRichiesta.sovrapposizione}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={stiliModaleRichiesta.contenitoreModale}
            >
              <View style={stiliModaleRichiesta.contenuto}>
                <View style={stiliModaleRichiesta.indicatoreManiglia} />
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
                      onPress={selettori.apriInizio}
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
                      onPress={selettori.apriFine}
                    >
                      <Text style={stiliModaleRichiesta.valoreData}>
                        {formattaData(dataFine)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={stiliModaleRichiesta.etichetta}>
                  Stato approvazione
                </Text>
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
                      inSalvataggio &&
                        stiliModaleRichiesta.pulsanteDisabilitato,
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
                  visibile={selettori.mostraInizio}
                  valore={dataInizio ?? new Date()}
                  suConferma={(data) => {
                    impostaDataInizio(data);
                    selettori.chiudiInizio();
                  }}
                  suChiusura={selettori.chiudiInizio}
                />
                <SelettoreDataPiattaforma
                  visibile={selettori.mostraFine}
                  valore={dataFine ?? new Date()}
                  suConferma={(data) => {
                    impostaDataFine(data);
                    selettori.chiudiFine();
                  }}
                  suChiusura={selettori.chiudiFine}
                />
                <View style={{ height: 20 }} />
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModaleModificaRichiesta;
