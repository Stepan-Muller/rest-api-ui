import React, { useState, useEffect } from "react";
import axios from "axios";

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  available: boolean;
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<Partial<Book>>({});
  const [editing, setEditing] = useState<number>(-1);

  // Fetch books
  useEffect(() => {
    axios.get("http://localhost:3001/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error(error));
    form.available = true;
  }, []);

  // Add or update book
  const handleSubmit = () => {
    if (editing >= 0) {
      axios.put(`http://localhost:3001/books/${form.id}`, form)
        .then(() => {
          setBooks((prev) => prev.map((book) => (book.id === form.id ? form as Book : book)));
          setEditing(-1);
        });
    } else {
      axios.post("http://localhost:3001/books", form)
        .then((response) => setBooks(response.data))
        .catch((error) => console.error(error));
    }
    setForm({ available: true });
  };

  // Delete book
  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:3001/books/${id}`)
      .then(() => setBooks((prev) => prev.filter((book) => book.id !== id)))
      .catch((error) => console.error(error));
  };

  // Start editing
  const startEdit = (book: Book) => {
    setForm(book);
    setEditing(book.id);
  };

  const stopEdit = () => {
    setEditing(-1);
    setForm({ available: true });
  }

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <table className="table-auto w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Název</th>
              <th className="border border-gray-300 p-2">Autor</th>
              <th className="border border-gray-300 p-2">Rok</th>
              <th className="border border-gray-300 p-2">Dostupnost</th>
              <th className="border border-gray-300 p-2"></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                {editing === book.id ? (
                  <>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        placeholder="Název"
                        value={form.title || ""}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        placeholder="Autor"
                        value={form.author || ""}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                        className="w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        placeholder="Rok"
                        value={form.year || ""}
                        onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="checkbox"
                        checked={form.available || false}
                        onChange={(e) => setForm({ ...form, available: e.target.checked })}
                        className="mr-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button type="button" onClick={() => handleSubmit()} className="bg-green-500 text-white px-2 py-1 mr-2">Upravit</button>
                      <button type="button" onClick={() => stopEdit()} className="bg-red-500 text-white px-2 py-1">Zrušit</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-gray-300 p-2">{book.title}</td>
                    <td className="border border-gray-300 p-2">{book.author}</td>
                    <td className="border border-gray-300 p-2">{book.year}</td>
                    <td className="border border-gray-300 p-2">{book.available ? "Ano" : "Ne"}</td>
                    <td className="border border-gray-300 p-2">
                      <button type="button" onClick={() => startEdit(book)} className="bg-blue-500 text-white px-2 py-1 mr-2">Upravit</button>
                      <button type="button" onClick={() => handleDelete(book.id)} className="bg-red-500 text-white px-2 py-1">Odstranit</button>
                    </td>
                  </>
                )}

              </tr>
            ))}
            {editing < 0 && (
              <tr>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    placeholder="Název"
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    placeholder="Autor"
                    value={form.author || ""}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    placeholder="Rok"
                    value={form.year || ""}
                    onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={form.available || false}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="mr-1"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <button type="button" onClick={() => handleSubmit()} className="bg-green-500 text-white px-2 py-1">Přidat</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </form >
    </div >
  );
};

export default App;