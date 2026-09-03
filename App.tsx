import { StatusBar } from "expo-status-bar";
import { SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { initializeDatabase } from "./src/db/schema";
import TodoListScreen from "./src/screens/TodoListScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="todo.db" onInit={initializeDatabase}>
        <TodoListScreen />
        <StatusBar style="dark" />
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
