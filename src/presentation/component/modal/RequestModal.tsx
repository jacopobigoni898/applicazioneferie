import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Colors, Typography } from "../../../core/theme/theme"; // Assicurati che il percorso sia giusto

// Dati per i menu a tendina
const absenceTypes = [
  { label: "Ferie Annuali", value: "ferie" },
  { label: "Malattia", value: "malattia" },
  { label: "Permesso ROL", value: "rol" },
  { label: "Congedo Matrimoniale", value: "congedo" },
];

const overtimeTypes = [
  { label: "Straordinario Diurno", value: "diurno" },
  { label: "Straordinario Notturno", value: "notturno" },
  { label: "Straordinario Festivo", value: "festivo" },
  { label: "Banca Ore", value: "banca_ore" },
];

interface RequestModalProps {
  visible: boolean;
  onClose: () => void;
  startDate: string | null;
  endDate: string | null;
  mainType: string; // 'assenza' o 'straordinari'
  onSubmit: (data: any) => void;
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
  const [notes, setNotes] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  // Resetta i campi ogni volta che la modale si apre
  useEffect(() => {
    if (visible) {
      setSubType(null);
      setNotes("");
    }
  }, [visible]);

  // Seleziona la lista giusta in base a cosa hai scelto nel calendario
  const currentOptions =
    mainType === "straordinari" ? overtimeTypes : absenceTypes;

  const handleSubmit = () => {
    if (!subType) {
      // Piccolo controllo di sicurezza
      alert("Per favore seleziona una specifica (es. Ferie)");
      return;
    }

    // Impacchetta i dati
    const requestData = {
      startDate,
      endDate,
      mainType,
      subType,
      notes,
    };

    onSubmit(requestData);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Cliccare fuori chiude la tastiera */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Cliccare sulla modale NON deve chiuderla */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
            >
              <View style={styles.content}>
                {/* Intestazione */}
                <Text style={styles.headerTitle}>Completa Richiesta</Text>
                <Text style={styles.subHeader}>
                  {mainType === "assenza"
                    ? "Nuova Assenza"
                    : "Nuovo Straordinario"}
                </Text>

                {/* Riepilogo Date */}
                <View style={styles.dateRow}>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateLabel}>Dal:</Text>
                    <Text style={styles.dateValue}>
                      {startDate?.split("-").reverse().join("/")}
                    </Text>
                  </View>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateLabel}>Al:</Text>
                    <Text style={styles.dateValue}>
                      {endDate?.split("-").reverse().join("/")}
                    </Text>
                  </View>
                </View>

                {/* Dropdown Scelta Tipo */}
                <Text style={styles.label}>Specifica il motivo:</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && { borderColor: Colors.primary || "orange" },
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={currentOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Seleziona..." : "..."}
                  value={subType}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setSubType(item.value);
                    setIsFocus(false);
                  }}
                />

                {/* Campo Note */}
                <Text style={styles.label}>Note aggiuntive (opzionale):</Text>
                <TextInput
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={3}
                  placeholder="Scrivi qui eventuali dettagli..."
                  value={notes}
                  onChangeText={setNotes}
                />

                {/* Bottoni */}
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
                    <Text style={styles.confirmButtonText}>
                      Invia Richiesta
                    </Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: "rgba(0,0,0,0.5)", // Sfondo nero semi-trasparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    // Ombre
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 12,
  },
  dateBox: {
    alignItems: "center",
    width: "45%",
  },
  dateLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
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
  textArea: {
    height: 80,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 12,
    textAlignVertical: "top",
    marginBottom: 20,
    backgroundColor: "#FAFAFA",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary || "#FF9800", // Usa il colore del tuo tema
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RequestModal;
