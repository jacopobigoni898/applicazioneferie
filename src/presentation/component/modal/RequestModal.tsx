import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "../../../core/theme/theme";

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
    data: ExtraordinaryRequest | HolidayRequest | PermitsRequest | SickRequest
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
      `[RequestModal] Invio richiesta tipo: ${mainType} - ${subType}`
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
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
            >
              <View style={styles.content}>
                <View style={styles.handleIndicator} />

                <Text style={styles.headerTitle}>Nuova Richiesta</Text>
                <Text style={styles.subHeader}>
                  {mainType === "assenza"
                    ? "Assenza / Permesso"
                    : "Straordinario"}
                </Text>

                <View style={styles.dateRow}>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateLabel}>Dal:</Text>
                    <Text style={styles.dateValue}>
                      {formatDate(startDate)}
                    </Text>
                  </View>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateLabel}>Al:</Text>
                    <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
                  </View>
                </View>

                <Text style={styles.label}>Motivazione:</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderColor: Colors.primary },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
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
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                  >
                    <Text style={styles.cancelButtonText}>Annulla</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      !subType && styles.disabledButton,
                    ]}
                    onPress={handleSubmit}
                    disabled={!subType}
                  >
                    <Text style={styles.confirmButtonText}>Invia</Text>
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
  },
  content: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  handleIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
  },
  dateBox: { alignItems: "center", width: "45%" },
  dateLabel: { fontSize: 12, color: "#888" },
  dateValue: { fontSize: 16, fontWeight: "bold", color: "#333" },
  label: { marginBottom: 8, fontWeight: "500", color: "#333" },
  dropdown: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  placeholderStyle: { fontSize: 16, color: "#999" },
  selectedTextStyle: { fontSize: 16, color: "#333" },
  buttonRow: { flexDirection: "row", marginTop: 10 },
  cancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  cancelButtonText: { color: "#666", fontWeight: "bold" },
  confirmButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary || "orange",
    alignItems: "center",
  },
  confirmButtonText: { color: "white", fontWeight: "bold" },
  disabledButton: { backgroundColor: "#CCC" },
});

export default RequestModal;
