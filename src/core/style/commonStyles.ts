import { StyleSheet } from "react-native";
import { Colors, Spacing, Typography } from "../theme/theme";

// Stili riutilizzabili di base
export const commonStyles = StyleSheet.create({
  screenPadding: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  shadowLight: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

// Stili del calendario centralizzati
export const calendarStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 54,
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.light,
    textAlign: "left",
    color: Colors.textSecondary,
    paddingBottom: 10,
    paddingLeft: 5,
  },
  dropdown: {
    marginBottom: Spacing.xl,
    height: 50,
    borderColor: Colors.border,
    borderWidth: 1.25,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iosPicker: {
    paddingHorizontal: 16,
  },
  dropdownFocus: {
    borderColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  placeholderStyle: { fontSize: 16, color: "#999" },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.textPrimary || "#000",
    fontWeight: Typography.weight.medium,
  },
  iconStyle: { width: 20, height: 20 },
  inputSearchStyle: { height: 40, fontSize: 16 },
  pullDownContainer: {
    position: "relative",
    zIndex: 20,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pullDownMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderColor: Colors.border,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden",
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  menuItemPressed: { backgroundColor: Colors.primary },
  menuItemText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  calendarWrapper: { flex: 1 },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  buttonDisabled: { backgroundColor: "#CCCCCC" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

// Stili condivisi per il pull-down iOS
export const pullDownStyles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderColor: Colors.border,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden",
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemPressed: { backgroundColor: Colors.primary },
  menuItemText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
});

// Stili condivisi per la modale di richiesta
export const requestModalStyles = StyleSheet.create({
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
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: Spacing.md + 4,
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
    color: Colors.textPrimary,
  },
  subHeader: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  dateValue: { fontSize: 16, fontWeight: "bold", color: Colors.textPrimary },
  label: { marginBottom: 8, fontWeight: "500", color: Colors.textPrimary },
  dropdown: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  placeholderStyle: { fontSize: 16, color: "#999" },
  selectedTextStyle: { fontSize: 16, color: Colors.textPrimary },
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
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  confirmButtonText: { color: "white", fontWeight: "bold" },
  disabledButton: { backgroundColor: "#CCC" },
});

// Stili per la schermata Calendario (tab wrapper)
export const calendarScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.top,
  },
  title: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.medium,
    borderBottomWidth: 4,
    borderBottomColor: Colors.primary,
    paddingBottom: Spacing.xs,
  },
  titleBlock: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
    marginLeft: Spacing.titleleft,
    paddingTop: Spacing.title,
  },
  header: {
    backgroundColor: Colors.top,
  },
  top: {
    flex: 1,
  },
});
