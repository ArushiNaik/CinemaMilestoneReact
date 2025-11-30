// src/pages/ManageFilmsPage.tsx
import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../services/api";
import type { FilmRequestModel, FilmResponseModel } from "../models/models";

type Mode = "CREATE" | "EDIT";

const emptyClient: FilmRequestModel = {
  filmName: "",
  filmGenre: "",
  filmDuration: 0,
  filmLanguage: "",
  filmRating: 0,
  filmDescription: "",
};

export default function ManageFilmsPage() {
  const [films, setFilms] = useState<FilmResponseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<Mode>("CREATE");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<FilmRequestModel>(emptyClient);

  useEffect(() => {
    loadFilms();
  }, []);

  async function loadFilms() {
    try {
      setLoading(true);
      const data = await apiGet("/films");
      setFilms(data as FilmResponseModel[]);
    } catch (err) {
      console.error(err);
      setError("Failed to load films.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "filmDuration" || name === "filmRating" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      if (formMode === "CREATE") {
        const created = await apiPost("/films", formData);
        setFilms((prev) => [...prev, created as FilmResponseModel]);
      } else if (editingId !== null) {
        const updated = await apiPut(`/films/${editingId}`, formData);
        setFilms((prev) =>
          prev.map((f) => (f.id === editingId ? (updated as FilmResponseModel) : f))
        );
      }
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Failed to save film.");
    }
  }

  function handleEdit(film: FilmResponseModel) {
    setFormMode("EDIT");
    setEditingId(film.id);
    setFormData({
      filmName: film.filmName,
      filmGenre: film.filmGenre,
      filmDuration: film.filmDuration,
      filmLanguage: film.filmLanguage,
      filmRating: film.filmRating,
      filmDescription: film.filmDescription,
    });
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this film?")) return;

    try {
      await apiDelete(`/films/${id}`);
      setFilms((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete film.");
    }
  }

  function resetForm() {
    setFormMode("CREATE");
    setEditingId(null);
    setFormData(emptyClient);
  }

  return (
    <section>
      <h2>Manage Films</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading…</p>}

      <table className="films-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Genre</th>
            <th>Duration</th>
            <th>Language</th>
            <th>Rating</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {films.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No films available.
              </td>
            </tr>
          )}
          {films.map((film) => (
            <tr key={film.id}>
              <td>{film.id}</td>
              <td>{film.filmName}</td>
              <td>{film.filmGenre}</td>
              <td>{film.filmDuration} mins</td>
              <td>{film.filmLanguage}</td>
              <td>{film.filmRating}/10</td>
              <td>{film.filmDescription}</td>
              <td>
                <button onClick={() => handleEdit(film)}>Edit</button>
                <button onClick={() => handleDelete(film.id)} style={{ marginLeft: "6px" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{formMode === "CREATE" ? "Add New Film" : "Edit Film"}</h3>

      <form onSubmit={handleSubmit} className="film-form">
        <div>
          <label>Name:</label>
          <input name="filmName" value={formData.filmName} onChange={handleChange} />
        </div>

        <div>
          <label>Genre:</label>
          <input name="filmGenre" value={formData.filmGenre} onChange={handleChange} />
        </div>

        <div>
          <label>Duration:</label>
          <input type="number" name="filmDuration" value={formData.filmDuration} onChange={handleChange} />
        </div>

        <div>
          <label>Language:</label>
          <input name="filmLanguage" value={formData.filmLanguage} onChange={handleChange} />
        </div>

        <div>
          <label>Rating:</label>
          <input type="number" name="filmRating" value={formData.filmRating} onChange={handleChange} />
        </div>

        <div>
          <label>Description:</label>
          <input name="filmDescription" value={formData.filmDescription} onChange={handleChange} />
        </div>

        <button type="submit">{formMode === "CREATE" ? "Add Film" : "Update Film"}</button>

        {formMode === "EDIT" && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>
    </section>
  );
}
