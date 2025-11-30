// src/pages/ManageScreensPage.tsx
import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../services/api";
import type { ScreeningRequestModel, ScreeningResponseModel, FilmResponseModel } from "../models/models";
type Mode = "CREATE" | "EDIT";

const emptyScreenRequest: ScreeningRequestModel = {
  screenNum: 0,
  chosenSeats: 0,
  screenType: "",
  screenDate: "",
  screenDescription: "",
  chosenFilm: {
    id: 0,
    filmName: "",
    filmGenre: "",
    filmDuration: 0,
    filmLanguage: "",
    filmRating: 0,
    filmDescription: "",
  },
};

export default function ManageScreensPage() {
  const [screens, setScreens] = useState<ScreeningResponseModel[]>([]);
  const [films, setFilms] = useState<FilmResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<Mode>("CREATE");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formRequest, setFormRequest] = useState<ScreeningRequestModel>(emptyScreenRequest);

  useEffect(() => {
    loadScreens();
    loadFilms();
  }, []);

  async function loadScreens() {
    try {
      setLoading(true);
      const data = await apiGet("/screenings");
      setScreens(data as ScreeningResponseModel[]);
    } catch (err) {
      console.error(err);
      setError("Failed to load screenings.");
    } finally {
      setLoading(false);
    }
  }

  async function loadFilms() {
    try {
      const data = await apiGet("/films");
      setFilms(data as FilmResponseModel[]);
    } catch (err) {
      console.error(err);
      setError("Failed to load films for dropdown.");
    }
  }

  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormRequest((prev) => ({
      ...prev,
      [name]: name === "screenNum" || name === "chosenSeats" ? Number(value) : value,
    }));
  }

  function handleFilmSelect(e: any) {
    const filmId = Number(e.target.value);
    const selectedFilm = films.find((f) => f.id === filmId);
    if (selectedFilm) {
      setFormRequest((prev) => ({ ...prev, chosenFilm: selectedFilm }));
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      if (formMode === "CREATE") {
        const created = await apiPost("/screenings", formRequest);
        setScreens((prev) => [...prev, created as ScreeningResponseModel]);
      } else if (formMode === "EDIT" && editingId !== null) {
        const updated = await apiPut(`/screenings/${editingId}`, formRequest);
        setScreens((prev) => prev.map((s) => (s.id === editingId ? (updated as ScreeningResponseModel) : s)));
      }
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Failed to save screening.");
    }
  }

  function handleEdit(screen: ScreeningResponseModel) {
    setFormMode("EDIT");
    setEditingId(screen.id);
    setFormRequest({
      screenNum: screen.screenNum,
      chosenSeats: screen.availableSeats,
      screenType: screen.screenType,
      screenDate: screen.screenDate,
      screenDescription: screen.screenDescription,
      chosenFilm: screen.filmAvailable,
    });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this screening?")) return;
    try {
      await apiDelete(`/screenings/${id}`);
      setScreens((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete screening.");
    }
  }

  function resetForm() {
    setFormMode("CREATE");
    setEditingId(null);
    setFormRequest(emptyScreenRequest);
  }

  return (
    <section>
      <h2>Manage Screens</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading screenings...</p>}

      <table className="screens-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Screen #</th>
            <th>Seats</th>
            <th>Type</th>
            <th>Date</th>
            <th>Description</th>
            <th>Film</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {screens.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.screenNum}</td>
              <td>{s.availableSeats}</td>
              <td>{s.screenType}</td>
              <td>{s.screenDate}</td>
              <td>{s.screenDescription}</td>
              <td>{s.filmAvailable?.filmName}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{formMode === "CREATE" ? "Add Screening" : "Edit Screening"}</h3>

      <form onSubmit={handleSubmit} className="screen-form">
        <div>
          <label>Screen #:</label>
          <input type="number" name="screenNum" value={formRequest.screenNum} onChange={handleChange} required />
        </div>

        <div>
          <label>Seats:</label>
          <input type="number" name="chosenSeats" value={formRequest.chosenSeats} onChange={handleChange} required />
        </div>

        <div>
          <label>Type:</label>
          <input type="text" name="screenType" value={formRequest.screenType} onChange={handleChange} required />
        </div>

        <div>
          <label>Date:</label>
          <input type="date" name="screenDate" value={formRequest.screenDate} onChange={handleChange} required />
        </div>

        <div>
          <label>Description:</label>
          <input type="text" name="screenDescription" value={formRequest.screenDescription} onChange={handleChange} />
        </div>

        <div>
          <label>Film:</label>
          <select onChange={handleFilmSelect} value={formRequest.chosenFilm?.id || ""} required>
            <option value="">Select a film</option>
            {films.map((film) => (
              <option key={film.id} value={film.id}>
                {film.filmName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button type="submit">{formMode === "CREATE" ? "Add Screening" : "Update Screening"}</button>

          {formMode === "EDIT" && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
