import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddTaskSheet from "../components/AddTaskSheet";
import TaskItem from "../components/TaskItem";
import {
  addTask,
  deleteTask,
  getCompletedTasks,
  getOpenTasks,
  setTaskCompleted,
} from "../db/tasksRepository";
import { colors, spacing } from "../theme";
import type { NewTaskInput, Task } from "../db/types";

const appVariant = String(Constants.expoConfig?.extra?.appVariant ?? "unknown");
const appVersion = Constants.expoConfig?.version ?? "0.0.0";

export default function TodoListScreen() {
  const db = useSQLiteContext();
  const [openTasks, setOpenTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [addVisible, setAddVisible] = useState(false);

  const refresh = useCallback(async () => {
    const [open, done] = await Promise.all([
      getOpenTasks(db),
      getCompletedTasks(db),
    ]);
    setOpenTasks(open);
    setCompletedTasks(done);
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleToggle(task: Task) {
    await setTaskCompleted(db, task.id, task.completed === 0);
    refresh();
  }

  function handleDelete(task: Task) {
    Alert.alert("Delete task", `Delete "${task.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTask(db, task.id);
          refresh();
        },
      },
    ]);
  }

  async function handleAdd(input: NewTaskInput) {
    await addTask(db, input);
    refresh();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Family Tasks</Text>
          <Text style={styles.headerSubtitle}>
            v{appVersion} · {appVariant}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconButton}
            onPress={() => setShowCompleted((v) => !v)}
          >
            <Ionicons
              name="time-outline"
              size={22}
              color={colors.textPrimary}
            />
          </Pressable>
          <Pressable
            style={styles.addButton}
            onPress={() => setAddVisible(true)}
          >
            <Ionicons name="add" size={26} color={colors.accentText} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={openTasks}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        ListEmptyComponent={
          completedTasks.length === 0 ? (
            <Text style={styles.emptyText}>
              No tasks yet. Tap + to add one.
            </Text>
          ) : null
        }
        ListFooterComponent={
          showCompleted && completedTasks.length > 0 ? (
            <View style={styles.doneSection}>
              <Text style={styles.doneHeading}>DONE</Text>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </View>
          ) : null
        }
      />

      <AddTaskSheet
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSubmit={handleAdd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.xl,
  },
  doneSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.sm,
  },
  doneHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginLeft: spacing.md,
  },
});
