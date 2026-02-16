// Modale per la modifica di una richiesta esistente.
// Gestisce selezione date con picker iOS/Android e stato approvazione con dropdown.
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { stiliModaleRichiesta } from "../../../core/style/commonStyles";
import { Colori } from "../../../core/theme/theme";
import { RichiestaFerie } from "../../../domain/entities/HolidayRequest";
import { InputAggiornamentoRichiesta } from "../services/requestsService";
import { StatoRichiesta } from "../../../domain/entities/RequestStatus";
import { useFormRichiesta } from "../hooks/useRequestForm";

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
  // Stato picker date
  const [mostraSelettoreInizio, impostaMostraSelettoreInizio] = useState(false);
  const [mostraSelettoreFine, impostaMostraSelettoreFine] = useState(false);
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
    orarioInizio,
    orarioFine,
    apriSelettoreOrario,
    gestisciCambioOrario,
    mostraSelettoreInizio: mostraSelettoreOrarioInizio,
    mostraSelettoreFine: mostraSelettoreOrarioFine,
    chiudiSelettori,
  } = useFormRichiesta({
    modalita: "modifica",
    visibile,
    dataInizio: elemento?.data_inizio ?? null,
    dataFine: elemento?.data_fine ?? null,
    idRichiesta: elemento?.id_richiesta ?? 0,
    statoIniziale: elemento?.stato_approvazione as StatoRichiesta,
    suInvio: suConferma,
  });

  // Date temporanee per iOS (conferma esplicita)
  const [dataInizioTemp, impostaDataInizioTemp] = useState<Date | null>(null);
  const [dataFineTemp, impostaDataFineTemp] = useState<Date | null>(null);

  // Reset stato quando la modale appare
  useEffect(() => {
    if (visibile) {
      impostaMostraSelettoreInizio(false);
      impostaMostraSelettoreFine(false);
      impostaDataInizioTemp(null);
      impostaDataFineTemp(null);
    }
  }, [visibile, elemento]);

  // Controlla se è richiesta per un singolo giorno
  const eGiornoSingolo = useMemo(() => {
    if (!dataInizio || !dataFine) return true;
    return (
      dataInizio.toISOString().slice(0, 10) ===
      dataFine.toISOString().slice(0, 10)
    );
  }, [dataInizio, dataFine]);

  // Gestione cambio data differenziata per piattaforma
  const gestisciCambioData = (
    tipo: "inizio" | "fine",
    _evento: DateTimePickerEvent,
    data?: Date,
  ) => {
    if (tipo === "inizio") {
      if (Platform.OS === "ios") {
        if (data) impostaDataInizioTemp(data);
      } else {
        if (data) impostaDataInizio(data);
        impostaMostraSelettoreInizio(false);
      }
    } else {
      if (Platform.OS === "ios") {
        if (data) impostaDataFineTemp(data);
      } else {
        if (data) impostaDataFine(data);
        impostaMostraSelettoreFine(false);
      }
    }
  };

  // Chiude il picker senza applicare modifiche
  const chiudiSelettore = (tipo: "inizio" | "fine") => {
    if (tipo === "inizio") {
      impostaMostraSelettoreInizio(false);
      impostaDataInizioTemp(null);
    } else {
      impostaMostraSelettoreFine(false);
      impostaDataFineTemp(null);
    }
  };

  // Conferma la data selezionata nel picker iOS
  const confermaSelettore = (tipo: "inizio" | "fine") => {
    if (tipo === "inizio") {
      if (dataInizioTemp) impostaDataInizio(dataInizioTemp);
      impostaMostraSelettoreInizio(false);
      impostaDataInizioTemp(null);
    } else {
      if (dataFineTemp) impostaDataFine(dataFineTemp);
      impostaMostraSelettoreFine(false);
      impostaDataFineTemp(null);
    }
  };

  // Renderizza il picker data per iOS o Android
  const renderizzaSelettoreData = (tipo: "inizio" | "fine") => {
    const visibileFlag =
      tipo === "inizio" ? mostraSelettoreInizio : mostraSelettoreFine;
    const valore =
      tipo === "inizio" ? (dataInizio ?? new Date()) : (dataFine ?? new Date());
    if (!visibileFlag) return null;

    if (Platform.OS === "ios") {
      const valoreTemp =
        tipo === "inizio"
          ? (dataInizioTemp ?? valore)
          : (dataFineTemp ?? valore);
      return (
        <Modal transparent animationType="fade" visible={visibileFlag}>
          <TouchableWithoutFeedback onPress={() => chiudiSelettore(tipo)}>
            <View style={stiliModaleRichiesta.sovrapposizioneSelettore} />
          </TouchableWithoutFeedback>

          <View style={stiliModaleRichiesta.foglioSelettore}>
            <View style={stiliModaleRichiesta.intestazioneSelettore}>
              <Text style={stiliModaleRichiesta.titoloSelettore}>
                Seleziona data
              </Text>
              <TouchableOpacity onPress={() => chiudiSelettore(tipo)}>
                <Text style={stiliModaleRichiesta.chiudiSelettore}>Chiudi</Text>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={valoreTemp}
              mode="date"
              display="spinner"
              onChange={(evento, data) =>
                gestisciCambioData(tipo, evento, data || valoreTemp)
              }
              style={stiliModaleRichiesta.selettoreIOS}
              textColor={Colori.testoPrimario}
            />

            <TouchableOpacity
              style={stiliModaleRichiesta.confermaSelettore}
              onPress={() => confermaSelettore(tipo)}
            >
              <Text style={stiliModaleRichiesta.testoConfermaSelettore}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    }

    return (
      <DateTimePicker
        value={valore}
        mode="date"
        display="default"
        onChange={(evento, data) =>
          gestisciCambioData(tipo, evento, data || valore)
        }
      />
    );
  };

  // Renderizza il picker orario per iOS
  const renderizzaSelettoreOrario = () => {
    if (Platform.OS !== "ios") return null;
    if (!mostraSelettoreOrarioInizio && !mostraSelettoreOrarioFine) return null;

    const eInizio = mostraSelettoreOrarioInizio;
    const valore = eInizio
      ? dataInizio || new Date()
      : dataFine || new Date();
    const tipo = eInizio ? "inizio" : "fine";

    return (
      <Modal
        transparent
        animationType="fade"
        visible={mostraSelettoreOrarioInizio || mostraSelettoreOrarioFine}
        onRequestClose={chiudiSelettori}
      >
        <TouchableWithoutFeedback onPress={chiudiSelettori}>
          <View style={stiliModaleRichiesta.sovrapposizioneSelettore}>
            <TouchableWithoutFeedback>
              <View style={stiliModaleRichiesta.foglioSelettore}>
                <View style={stiliModaleRichiesta.intestazioneSelettore}>
                  <Text style={stiliModaleRichiesta.titoloSelettore}>
                    Seleziona orario
                  </Text>
                  <TouchableOpacity onPress={chiudiSelettori}>
                    <Text style={stiliModaleRichiesta.chiudiSelettore}>
                      Chiudi
                    </Text>
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  value={valore}
                  mode="time"
                  is24Hour
                  display={Platform.OS === "ios" ? "spinner" : "clock"}
                  minuteInterval={Platform.OS === "ios" ? 30 : undefined}
                  themeVariant="light"
                  textColor={Colori.testoPrimario}
                  onChange={(evento, data) => {
                    gestisciCambioOrario(tipo, evento, data || valore);
                  }}
                  style={stiliModaleRichiesta.selettoreIOS}
                />

                <TouchableOpacity
                  style={stiliModaleRichiesta.confermaSelettore}
                  onPress={chiudiSelettori}
                >
                  <Text style={stiliModaleRichiesta.testoConfermaSelettore}>
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

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
                      onPress={() => {
                        impostaDataInizioTemp(dataInizio ?? new Date());
                        impostaMostraSelettoreInizio(true);
                      }}
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
                      onPress={() => {
                        impostaDataFineTemp(dataFine ?? new Date());
                        impostaMostraSelettoreFine(true);
                      }}
                    >
                      <Text style={stiliModaleRichiesta.valoreData}>
                        {formattaData(dataFine)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={stiliModaleRichiesta.etichetta}>Orario</Text>
                <View style={stiliModaleRichiesta.rigaOrario}>
                  <View style={stiliModaleRichiesta.casellaOrario}>
                    <Text style={stiliModaleRichiesta.etichettaData}>
                      Inizio
                    </Text>
                    <TouchableOpacity
                      style={stiliModaleRichiesta.inputOrario}
                      onPress={() => apriSelettoreOrario("inizio")}
                    >
                      <Text style={stiliModaleRichiesta.testoOrario}>
                        {orarioInizio}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={stiliModaleRichiesta.casellaOrario}>
                    <Text style={stiliModaleRichiesta.etichettaData}>
                      Fine
                    </Text>
                    <TouchableOpacity
                      style={stiliModaleRichiesta.inputOrario}
                      onPress={() => apriSelettoreOrario("fine")}
                    >
                      <Text style={stiliModaleRichiesta.testoOrario}>
                        {orarioFine}
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

                {renderizzaSelettoreData("inizio")}
                {renderizzaSelettoreData("fine")}
                {renderizzaSelettoreOrario()}
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
