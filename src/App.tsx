
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import MainBody from "./components/MainBody";
import type { Page } from "./services/types";
import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  return (
    <>
      <Header />
      <Menu currentPage={currentPage} onChangePage={setCurrentPage} />
      <MainBody currentPage={currentPage} />
      <Footer />
    </>
  );
}
