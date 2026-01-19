import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "../../../core/theme/theme";
import { requestModalStyles } from "../../../core/style/commonStyles";

import {
  ABSENCE_OPTIONS,
  OVERTIME_OPTIONS,
} from "../../../domain/entities/TypeRequest";

// Assicurati che il percorso di importazione sia corretto in base alla tua struttura file
import { RequestStatus } from "../../../domain/entities/RequestStatus";
// Importiamo le interfacce specifiche per costruire l'oggetto giusto
import { HolidayRequest } from "../../../domain/entities/HolidayRequest";
import { SickRequest } from "../../../domain/entities/SickRequest";
import { PermitsRequest } from "../../../domain/entities/PermitsRequest";
import { ExtraordinaryRequest } from "../../../domain/entities/RequestExtraordinary";

interface RequestModalProps {
  visible: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  mainType: "assenza" | "straordinari";
  onSubmit: (
    data: ExtraordinaryRequest | HolidayRequest | PermitsRequest | SickRequest,
  ) => void;
}

const RequestModal = ({
  visible,
  onClose,
  startDate,
  endDate,
  mainType,
  onSubmit,
}: RequestModalProps) => {
  const [subType, setSubType] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (visible) {
      setSubType(null);
    }
  }, [visible]);

  const currentOptions =
    mainType === "straordinari" ? OVERTIME_OPTIONS : ABSENCE_OPTIONS;

  // --- MODIFICA: LOGICA DI COSTRUZIONE OGGETTI ---
  const handleSubmit = () => {
    if (!subType) {
      alert("Seleziona una motivazione!");
      return;
    }

    if (!startDate || !endDate) {
      alert("Date non valide!");
      return;
    }

    // DATI COMUNI (Mock: id_utente e stato andrebbero presi dal contesto auth/backend)
    const MOCK_USER_ID = 1;
    const NEW_REQUEST_ID = 0; // Il backend genererà l'ID reale
    // Assumiamo che RequestStatus sia un Enum, usiamo un valore di default (es. PENDING/1)
    // Se RequestStatus è una stringa, metti "In Attesa"
    const DEFAULT_STATUS = RequestStatus.PENDING;

    let requestPayload:
      | ExtraordinaryRequest
      | HolidayRequest
      | PermitsRequest
      | SickRequest;

    // 1. GESTIONE STRAORDINARI
    if (mainType === "straordinari") {
      const extraRequest: ExtraordinaryRequest = {
        id_richiesta: NEW_REQUEST_ID,
        id_utente: MOCK_USER_ID,
        data_inizio: startDate,
        data_fine: endDate,
        stato_approvazione: DEFAULT_STATUS,
      };
      requestPayload = extraRequest;
    }
    // 2. GESTIONE ASSENZE (Ferie, Malattia, Permessi)
    else {
      // Normalizziamo la stringa per il confronto (dipende dai valori nel tuo ABSENCE_OPTIONS)
      const typeLower = subType.toLowerCase();

      if (typeLower.includes("ferie")) {
        // --- FERIE ---
        const holidayRequest: HolidayRequest = {
          id_richiesta: NEW_REQUEST_ID,
          id_utente: MOCK_USER_ID,
          data_inizio: startDate,
          data_fine: endDate,
          stato_approvazione: DEFAULT_STATUS,
        };
        requestPayload = holidayRequest;
      } else if (typeLower.includes("malattia")) {
        // --- MALATTIA ---
        const sickRequest: SickRequest = {
          id_richiesta: NEW_REQUEST_ID,
          id_utente: MOCK_USER_ID,
          data_inizio: startDate,
          data_fine: endDate,
          stato_approvazione: DEFAULT_STATUS,
          certificato_medico: "", // Placeholder: Manca input file nella UI
        };
        requestPayload = sickRequest;
      } else {
        // --- ALTRI PERMESSI (ROL, EX-FEST, ecc.) ---
        const permitsRequest: PermitsRequest = {
          id_richiesta: NEW_REQUEST_ID,
          id_utente: MOCK_USER_ID,
          tipo_permesso: subType, // Passiamo la stringa specifica (es. "ROL")
          data_inizio: startDate,
          data_fine: endDate,
          stato_approvazione: DEFAULT_STATUS,
        };
        requestPayload = permitsRequest;
      }
    }

    // Log per debug
    console.log("--------------------------------------------------");
    console.log(
      `[RequestModal] Invio richiesta tipo: ${mainType} - ${subType}`,
    );
    console.log(JSON.stringify(requestPayload, null, 2));
    console.log("--------------------------------------------------");

    // Invio al padre
    onSubmit(requestPayload);
  };

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString("it-IT") : "--/--/----";
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={requestModalStyles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={requestModalStyles.modalContainer}
            >
              <View style={requestModalStyles.content}>
                <View style={requestModalStyles.handleIndicator} />

                <Text style={requestModalStyles.headerTitle}>
                  Nuova Richiesta
                </Text>
                <Text style={requestModalStyles.subHeader}>
                  {mainType === "assenza"
                    ? "Assenza / Permesso"
                    : "Straordinario"}
                </Text>

                <View style={requestModalStyles.dateRow}>
                  <View style={requestModalStyles.dateBox}>
                    <Text style={requestModalStyles.dateLabel}>Dal:</Text>
                    <Text style={requestModalStyles.dateValue}>
                      {formatDate(startDate)}
                    </Text>
                  </View>
                  <View style={requestModalStyles.dateBox}>
                    <Text style={requestModalStyles.dateLabel}>Al:</Text>
                    <Text style={requestModalStyles.dateValue}>
                      {formatDate(endDate)}
                    </Text>
                  </View>
                </View>

                <Text style={requestModalStyles.label}>Motivazione:</Text>
                <Dropdown
                  style={[
                    requestModalStyles.dropdown,
                    isFocus && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={requestModalStyles.placeholderStyle}
                  selectedTextStyle={requestModalStyles.selectedTextStyle}
                  data={currentOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Seleziona..."
                  value={subType}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setSubType(item.value);
                    setIsFocus(false);
                  }}
                />
                <View style={requestModalStyles.buttonRow}>
                  <TouchableOpacity
                    style={requestModalStyles.cancelButton}
                    onPress={onClose}
                  >
                    <Text style={requestModalStyles.cancelButtonText}>
                      Annulla
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      requestModalStyles.confirmButton,
                      !subType && requestModalStyles.disabledButton,
                    ]}
                    onPress={handleSubmit}
                    disabled={!subType}
                  >
                    <Text style={requestModalStyles.confirmButtonText}>
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
    </Modal>
  );
};

export default RequestModal;
