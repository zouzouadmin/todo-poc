import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, radii, spacing } from "../theme";
import type { NewTaskInput } from "../db/types";
import { toDateOnlyString } from "../utils/date";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: NewTaskInput) => void;
}

export default function AddTaskSheet({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [hasReminder, setHasReminder] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  function reset() {
    setTitle("");
    setNotes("");
    setDueDate(null);
    setHasReminder(false);
    setShowPicker(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSave() {
    if (!title.trim()) return;
    onSubmit({
      title,
      notes,
      dueDate: dueDate ? toDateOnlyString(dueDate) : null,
      hasReminder,
    });
    reset();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.heading}>New Task</Text>

          <TextInput
            style={styles.titleInput}
            placeholder="What needs to be done?"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <TextInput
            style={styles.notesInput}
            placeholder="Add a note (optional)"
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
          />

          <View style={styles.optionsRow}>
            <Pressable
              style={styles.optionChip}
              onPress={() => setShowPicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.textPrimary}
              />
              <Text style={styles.optionText}>
                {dueDate ? toDateOnlyString(dueDate) : "Due date"}
              </Text>
            </Pressable>
            {dueDate && (
              <Pressable
                style={styles.clearChip}
                onPress={() => setDueDate(null)}
              >
                <Ionicons name="close" size={14} color={colors.textSecondary} />
              </Pressable>
            )}

            <Pressable
              style={[
                styles.optionChip,
                hasReminder && styles.optionChipActive,
              ]}
              onPress={() => setHasReminder((v) => !v)}
            >
              <Ionicons
                name={hasReminder ? "notifications" : "notifications-outline"}
                size={16}
                color={hasReminder ? colors.accentText : colors.textPrimary}
              />
              <Text
                style={[
                  styles.optionText,
                  hasReminder && styles.optionTextActive,
                ]}
              >
                Remind me
              </Text>
            </Pressable>
          </View>

          {showPicker && (
            <DateTimePicker
              value={dueDate ?? new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(_event, selected) => {
                setShowPicker(Platform.OS === "ios");
                if (selected) setDueDate(selected);
              }}
            />
          )}

          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.saveButton,
                !title.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!title.trim()}
            >
              <Text style={styles.saveText}>Add Task</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(58, 46, 36, 0.35)",
  },
  sheetWrapper: {
    justifyContent: "flex-end",
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radii.round,
    backgroundColor: colors.divider,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  titleInput: {
    fontSize: 16,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  notesInput: {
    fontSize: 14,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.round,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  optionChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  clearChip: {
    padding: spacing.xs,
  },
  optionText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  optionTextActive: {
    color: colors.accentText,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  cancelText: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
  saveButton: {
    flex: 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    alignItems: "center",
    backgroundColor: colors.accent,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    color: colors.accentText,
    fontWeight: "700",
  },
});
