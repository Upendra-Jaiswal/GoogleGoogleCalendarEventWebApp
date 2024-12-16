import logo from "./logo.svg";
import "./App.css";

import { AuthProvider } from "./context/AuthContext.js";
import Dashboard from "./components/Dashboard";
import ListEvents from "./components/ListEvents";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Dashboard />
        <ListEvents />
      </div>
    </AuthProvider>
  );
}

export default App;
