import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Switch,
  TextInput,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Colori } from "../../../core/theme/theme";
import { stiliModaleRichiesta } from "../../../core/style/commonStyles";
import { useFormRichiesta } from "../hooks/useRequestForm";
import {
  TipoRichiestaDTO,
  AddRichiestaPayload,
} from "../services/requestsService";
import InvolucroModale from "../../../shared/components/InvolucroModale";
import SelettoreOrarioPiattaforma from "../../../shared/components/SelettoreOrarioPiattaforma";
import RigaSelettoriOrario from "../../../shared/components/RigaSelettoriOrario";

interface PropsModaleRichiesta {
  visibile: boolean;
  suChiusura: () => void;
  dataInizio: Date | null;
  dataFine: Date | null;
  tipoPrincipale: "assenza" | "straordinari";
  tipiRichiesta: TipoRichiestaDTO[];
  suInvio: (dati: AddRichiestaPayload) => void;
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
  const {
    sottoTipo,
    impostaSottoTipo,
    idTipoRichiesta,
    impostaIdTipoRichiesta,
    nota,
    impostaNota,
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
  } = useFormRichiesta({
    modalita: "crea",
    visibile,
    dataInizio,
    dataFine,
    tipoPrincipale,
    tipiRichiesta,
    suInvio,
  });

  // Determina quale selettore è aperto e il suo valore
  const eInizio = mostraSelettoreInizio;
  const valoreOrario = eInizio
    ? dataInizioForm || new Date()
    : dataFineForm || new Date();
  const tipoOrario = eInizio ? "inizio" : "fine";

  return (
    <InvolucroModale
      visibile={visibile}
      suChiusura={suChiusura}
      suPressioneContenuto={Keyboard.dismiss}
      contenutoEsterno={
        <SelettoreOrarioPiattaforma
          visibile={mostraSelettoreInizio || mostraSelettoreFine}
          valore={valoreOrario}
          suCambio={(evento, data) =>
            gestisciCambioOrario(tipoOrario, evento, data || valoreOrario)
          }
          suChiudi={chiudiSelettori}
        />
      }
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
              trackColor={{ false: "#d3d6dc", true: Colori.primario }}
              thumbColor={tuttoIlGiorno ? Colori.superficie : "#f4f4f4"}
              ios_backgroundColor="#d3d6dc"
            />
          </View>

          {!tuttoIlGiorno && (
            <>
              <Text style={stiliModaleRichiesta.etichetta}>
                Orario (solo se 1 giorno)
              </Text>
              <RigaSelettoriOrario
                orarioInizio={orarioInizio}
                orarioFine={orarioFine}
                suPressioneInizio={() => apriSelettoreOrario("inizio")}
                suPressioneFine={() => apriSelettoreOrario("fine")}
              />
            </>
          )}
        </>
      ) : (
        <>
          <Text style={stiliModaleRichiesta.etichetta}>
            Orario primo/ultimo giorno
          </Text>
          <RigaSelettoriOrario
            orarioInizio={orarioInizio}
            orarioFine={orarioFine}
            suPressioneInizio={() => apriSelettoreOrario("inizio")}
            suPressioneFine={() => apriSelettoreOrario("fine")}
          />
        </>
      )}

      <Text style={stiliModaleRichiesta.etichetta}>Tipo Richiesta:</Text>
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

      <Text style={stiliModaleRichiesta.etichetta}>Nota:</Text>
      <TextInput
        style={[
          stiliModaleRichiesta.menuATendina,
          { paddingHorizontal: 12, paddingVertical: 10 },
        ]}
        placeholder="Inserisci una nota (opzionale)"
        placeholderTextColor="#999"
        value={nota}
        onChangeText={impostaNota}
        multiline
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
    </InvolucroModale>
  );
};

export default ModaleRichiesta;
