import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../theme";
import type { Task } from "../db/types";
import { formatDueDate } from "../utils/date";

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const completed = task.completed === 1;
  const dueLabel = formatDueDate(task.due_date);

  return (
    <Pressable
      style={styles.row}
      onLongPress={() => onDelete(task)}
      onPress={() => onToggle(task)}
    >
      <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
        {completed && (
          <Ionicons name="checkmark" size={14} color={colors.accentText} />
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.title, completed && styles.titleCompleted]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {!!task.notes && (
          <Text
            style={[styles.notes, completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {task.notes}
          </Text>
        )}
      </View>

      {!completed && (dueLabel || task.has_reminder === 1) && (
        <View style={styles.meta}>
          {!!dueLabel && <Text style={styles.dueDate}>{dueLabel}</Text>}
          {task.has_reminder === 1 && (
            <Ionicons name="notifications" size={16} color={colors.reminder} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: colors.checkboxBorder,
    marginRight: spacing.md,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  titleCompleted: {
    color: colors.strike,
    textDecorationLine: "line-through",
  },
  notes: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  dueDate: {
    fontSize: 13,
    color: colors.due,
    fontWeight: "500",
  },
});
