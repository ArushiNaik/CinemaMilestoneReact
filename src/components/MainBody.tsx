import '../App.css'
import type { Page } from "../services/types";
import ManageFilmsPage from '../pages/ManageFilmsPage';
import HomePage from '../pages/HomePage'; 
import AboutPage from '../pages/AboutPage';
import ManageScreensPage from '../pages/ManageScreensPage';
interface MainBodyProps {
    currentPage: Page;
}
export default function MainBody({ currentPage }: MainBodyProps) {
    return (
        <main className="main-body">
            {currentPage === "home" && <HomePage/>}
            {currentPage === "films" && <ManageFilmsPage/>}
            {currentPage === "screens" && <ManageScreensPage/>}
            {currentPage === "about" && <AboutPage/>}
        </main>
    );
}