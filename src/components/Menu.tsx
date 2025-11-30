import type { Page } from "../services/types";
import "../App.css";

interface MenuProps {
  currentPage: Page;
  onChangePage: (page: Page) => void;
}

export default function Menu({ currentPage, onChangePage }: MenuProps) {
  return (
    <nav className="menu glass-card">
      <ul className="menu-list">
        <li>
          <button
            className={currentPage === "home" ? "menu-button active" : "menu-button"}
            onClick={() => onChangePage("home")}
          >
            Home
          </button>
        </li>

        <li>
          <button
            className={currentPage === "films" ? "menu-button active" : "menu-button"}
            onClick={() => onChangePage("films")}
          >
            Manage Films
          </button>
        </li>

        <li>
          <button
            className={currentPage === "screens" ? "menu-button active" : "menu-button"}
            onClick={() => onChangePage("screens")}
          >
            Manage Screens
          </button>
        </li>

        <li>
          <button
            className={currentPage === "about" ? "menu-button active" : "menu-button"}
            onClick={() => onChangePage("about")}
          >
            About
          </button>
        </li>
      </ul>
    </nav>
  );
}
