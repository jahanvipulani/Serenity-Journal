import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import JournalEditor from "./pages/JournalEditor";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Breathing from "./pages/Breathing";
import Meditation from "./pages/Meditation";
import Todos from "./pages/Todos";
import Gratitude from "./pages/Gratitude";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/:id"
        element={
          <ProtectedRoute>
            <JournalEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/breathe"
        element={
          <ProtectedRoute>
            <Breathing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meditate"
        element={
          <ProtectedRoute>
            <Meditation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/todos"
        element={
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gratitude"
        element={
          <ProtectedRoute>
            <Gratitude />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
