import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TextInput,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import { Colori } from "../../../core/theme/theme";
import { stiliModaleRichiesta } from "../../../core/style/commonStyles";
import { sw, sh } from "../../../core/style/responsive";
import { useFormRichiesta } from "../hooks/useRequestForm";
import {
  TipoRichiestaDTO,
  AddRichiestaPayload,
} from "../services/requestsService";

interface PropsModaleRichiesta {
  visibile: boolean; //visibilità modale
  suChiusura: () => void; //callback chiusura modale
  dataInizio: Date | null; //data inzio selezionata dal calendario
  dataFine: Date | null; // Data fine selezionata dal calendario
  tipoPrincipale: "assenza" | "straordinari";
  tipiRichiesta: TipoRichiestaDTO[]; // Lista tipi dal backend (dropdown)
  suInvio: (dati: AddRichiestaPayload) => void; // Callback di invio
}

// Modale di creazione richiesta (assenze/straordinari) che delega la logica a useFormRichiesta
const ModaleRichiesta = ({
  visibile,
  suChiusura,
  dataInizio,
  dataFine,
  tipoPrincipale,
  tipiRichiesta,
  suInvio,
}: PropsModaleRichiesta) => {
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const {
    sottoTipo,
    impostaSottoTipo,
    idTipoRichiesta,
    impostaIdTipoRichiesta,
    nota,
    impostaNota,
    codiceRichiesta,
    impostaCodiceRichiesta,
    richiedeCodice,
    richiedeDocumenti,
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
    opzioniCorrente,
    formattaData,
    apriSelettoreOrario,
    gestisciCambioOrario,
    chiudiSelettori,
    gestisciInvioCreazione,
    documento,
    pickDocumento,
    rimuoviDocumento,
  } = useFormRichiesta({
    modalita: "crea",
    visibile,
    dataInizio,
    dataFine,
    tipoPrincipale,
    tipiRichiesta,
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
      transparent={false}
      visible={visibile}
      onRequestClose={suChiusura}
    >
      <View style={stiliModaleRichiesta.sovrapposizione}>
        <View style={[stiliModaleRichiesta.intestazionePagina, { paddingTop: insets.top + sh(8) }]}>
          <TouchableOpacity
            style={stiliModaleRichiesta.pulsanteIndietro}
            onPress={suChiusura}
          >
            <Ionicons name="chevron-back" size={sw(24)} color={Colori.primario} />
            <Text style={stiliModaleRichiesta.testoIndietro}>Indietro</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={stiliModaleRichiesta.contenitoreModale}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            contentContainerStyle={stiliModaleRichiesta.contenuto}
          >
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
                  <Text style={stiliModaleRichiesta.etichettaData}>Dal:</Text>
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

              {eSelezioneGiornoSingolo ? (
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
                      thumbColor={tuttoIlGiorno ? Colori.superficie : "#f4f4f4"}
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
                Tipo Richiesta:
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
                  const parsed = Number(item.value);
                  impostaIdTipoRichiesta(Number.isNaN(parsed) ? null : parsed);
                  impostaInFocus(false);
                }}
              />

              {richiedeCodice && (
                <>
                  <Text style={stiliModaleRichiesta.etichetta}>
                    Codice Richiesta:
                  </Text>
                  <TextInput
                    style={[
                      stiliModaleRichiesta.menuATendina,
                      { paddingHorizontal: sw(12), paddingVertical: sh(10) },
                    ]}
                    placeholder="Inserisci il codice"
                    placeholderTextColor="#999"
                    value={codiceRichiesta}
                    onChangeText={impostaCodiceRichiesta}
                  />
                </>
              )}

              {richiedeDocumenti && (
                <>
                  <Text style={stiliModaleRichiesta.etichetta}>Documento:</Text>
                  <View style={{ marginBottom: sh(8) }}>
                    <TouchableOpacity
                      style={[
                        stiliModaleRichiesta.menuATendina,
                        { paddingVertical: sh(12), paddingHorizontal: sw(12) },
                      ]}
                      onPress={pickDocumento}
                    >
                      <Text style={stiliModaleRichiesta.testoSegnapostoDocumento}>
                        {documento ? documento.name : "Seleziona un PDF"}
                      </Text>
                    </TouchableOpacity>
                    {documento && (
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: sh(6) }}>
                        <Text style={{ flex: 1 }}>{documento.name}</Text>
                        <TouchableOpacity onPress={rimuoviDocumento} style={{ marginLeft: sw(8) }}>
                          <Ionicons name="close-circle" size={sw(20)} color="#999" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </>
              )}

              <Text style={stiliModaleRichiesta.etichetta}>Nota:</Text>
              <TextInput
                style={[
                  stiliModaleRichiesta.menuATendina,
                  {
                    paddingHorizontal: sw(12),
                    paddingVertical: sh(10),
                    minHeight: sh(60),
                  },
                ]}
                placeholder="Inserisci una nota (opzionale)"
                placeholderTextColor="#999"
                value={nota}
                onChangeText={impostaNota}
                multiline
                onFocus={() => {
                  setTimeout(() => {
                    scrollRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
              />
            </ScrollView>

          {/* Bottoni fissi in basso */}
          <View style={[stiliModaleRichiesta.rigaPulsanti, { paddingBottom: insets.bottom + sh(10) }]}>
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
        </KeyboardAvoidingView>
      </View>
      {renderSelettoreOrario()}
    </Modal>
  );
};

export default ModaleRichiesta;
