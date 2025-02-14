import { Link, Outlet } from "react-router-dom";
import "./App.css";
import { useAuth } from "./contexts/AuthProvider";

function App() {
  const { auth } = useAuth();
  return (
    <>
      <header>
        <h1>Quo Vadis</h1>
      </header>
      <div className="app-container">
        {auth && (
          <nav>
            <ol>
              <li className="calendar">
                <Link to="/">
                  <img src="/images/calendar.svg" alt="Calendrier" />
                </Link>
              </li>
              <li className="agenda">
                <Link to="/agenda">
                  <img src="/images/agenda.svg" alt="Agenda" />
                </Link>
              </li>
              <li className="user">
                <Link to="/user">
                  <img src="/images/user.svg" alt="Utilisateur" />
                </Link>
              </li>
            </ol>
          </nav>
        )}
        <main>
          <Outlet />
        </main>
      </div>
      <footer>
        <p>&copy; 2025 Quo vadis SAS</p>
      </footer>
    </>
  );
}

export default App;
