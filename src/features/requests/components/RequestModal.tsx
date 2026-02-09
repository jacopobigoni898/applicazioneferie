import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { Colori } from "../../../core/theme/theme";
import { stiliModaleRichiesta } from "../../../core/style/commonStyles";
import { useFormRichiesta } from "../hooks/useRequestForm";
import { PayloadRichiesta } from "../services/requestsService";

interface PropsModaleRichiesta {
  visibile: boolean;
  suChiusura: () => void;
  dataInizio: Date | null;
  dataFine: Date | null;
  tipoPrincipale: "assenza" | "straordinari";
  idUtente: number | null;
  suInvio: (dati: PayloadRichiesta) => void;
}

// Modale di creazione richiesta (assenze/straordinari) che delega la logica a useFormRichiesta
const ModaleRichiesta = ({
  visibile,
  suChiusura,
  dataInizio,
  dataFine,
  tipoPrincipale,
  idUtente,
  suInvio,
}: PropsModaleRichiesta) => {
  const {
    sottoTipo,
    impostaSottoTipo,
    inFocus,
    impostaInFocus,
    dataInizio: dataInizioForm,
    dataFine: dataFineForm,
    orarioInizio,
    orarioFine,
    mostraSelettoreInizio,
    mostraSelettoreFine,
    tuttoIlGiorno,
    impostaTuttoIlGiorno,
    eSelezioneGiornoSingolo,
    eRichiestaMalattia,
    opzioniCorrente,
    formattaData,
    apriSelettoreOrario,
    gestisciCambioOrario,
    chiudiSelettori,
    gestisciInvioCreazione,
  } = useFormRichiesta({
    modalita: "crea",
    visibile,
    dataInizio,
    dataFine,
    tipoPrincipale,
    idUtente,
    suInvio,
  });

  // Componente selettore orario per iOS
  const renderSelettoreOrario = () => {
    if (Platform.OS !== "ios") return null;
    if (!mostraSelettoreInizio && !mostraSelettoreFine) return null;

    const eInizio = mostraSelettoreInizio;
    const valore = eInizio
      ? dataInizioForm || new Date()
      : dataFineForm || new Date();
    const tipo = eInizio ? "inizio" : "fine";

    return (
      <Modal
        transparent
        animationType="fade"
        visible={mostraSelettoreInizio || mostraSelettoreFine}
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
      transparent={true}
      visible={visibile}
      onRequestClose={suChiusura}
    >
      <TouchableWithoutFeedback onPress={suChiusura}>
        <View style={stiliModaleRichiesta.sovrapposizione}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={stiliModaleRichiesta.contenitoreModale}
            >
              <View style={stiliModaleRichiesta.contenuto}>
                <View style={stiliModaleRichiesta.indicatoreManiglia} />

                <Text style={stiliModaleRichiesta.titoloIntestazione}>
                  Nuova Richiesta
                </Text>
                <Text style={stiliModaleRichiesta.sottointestazione}>
                  {tipoPrincipale === "assenza"
                    ? "Assenza / Permesso"
                    : "Straordinario"}
                </Text>

                <View style={stiliModaleRichiesta.rigaDate}>
                  <View style={stiliModaleRichiesta.casellaData}>
                    <Text style={stiliModaleRichiesta.etichettaData}>
                      Dal:
                    </Text>
                    <Text style={stiliModaleRichiesta.valoreData}>
                      {formattaData(dataInizioForm)}
                    </Text>
                  </View>
                  <View style={stiliModaleRichiesta.casellaData}>
                    <Text style={stiliModaleRichiesta.etichettaData}>Al:</Text>
                    <Text style={stiliModaleRichiesta.valoreData}>
                      {formattaData(dataFineForm)}
                    </Text>
                  </View>
                </View>

                {eRichiestaMalattia ? null : eSelezioneGiornoSingolo ? (
                  <>
                    <View style={stiliModaleRichiesta.rigaInterruttore}>
                      <Text style={stiliModaleRichiesta.etichettaInterruttore}>
                        Tutto il giorno
                      </Text>
                      <Switch
                        value={tuttoIlGiorno}
                        onValueChange={impostaTuttoIlGiorno}
                        trackColor={{
                          false: "#d3d6dc",
                          true: Colori.primario,
                        }}
                        thumbColor={
                          tuttoIlGiorno ? Colori.superficie : "#f4f4f4"
                        }
                        ios_backgroundColor="#d3d6dc"
                      />
                    </View>

                    {!tuttoIlGiorno && (
                      <>
                        <Text style={stiliModaleRichiesta.etichetta}>
                          Orario (solo se 1 giorno)
                        </Text>
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
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={stiliModaleRichiesta.etichetta}>
                      Orario primo/ultimo giorno
                    </Text>
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
                  </>
                )}

                <Text style={stiliModaleRichiesta.etichetta}>
                  Motivazione:
                </Text>
                <Dropdown
                  style={[
                    stiliModaleRichiesta.menuATendina,
                    inFocus && { borderColor: Colori.primario },
                  ]}
                  placeholderStyle={stiliModaleRichiesta.stileSegnaposto}
                  selectedTextStyle={stiliModaleRichiesta.stileTestoSelezionato}
                  data={opzioniCorrente}
                  labelField="label"
                  valueField="value"
                  placeholder="Seleziona..."
                  value={sottoTipo}
                  onFocus={() => impostaInFocus(true)}
                  onBlur={() => impostaInFocus(false)}
                  onChange={(item) => {
                    impostaSottoTipo(item.value);
                    impostaInFocus(false);
                  }}
                />
                <View style={stiliModaleRichiesta.rigaPulsanti}>
                  <TouchableOpacity
                    style={stiliModaleRichiesta.pulsanteAnnulla}
                    onPress={suChiusura}
                  >
                    <Text style={stiliModaleRichiesta.testoPulsanteAnnulla}>
                      Annulla
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      stiliModaleRichiesta.pulsanteConferma,
                      !sottoTipo && stiliModaleRichiesta.pulsanteDisabilitato,
                    ]}
                    onPress={gestisciInvioCreazione}
                    disabled={!sottoTipo}
                  >
                    <Text style={stiliModaleRichiesta.testoPulsanteConferma}>
                      Invia
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 20 }} />
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      {renderSelettoreOrario()}
    </Modal>
  );
};

export default ModaleRichiesta;
