import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [titulo, setTitulo] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => setPosts(res.data.slice(0, 10)))
      .catch((err) => console.error(err));
  }, []);

const crearPost = () => {
  axios.post("https://jsonplaceholder.typicode.com/posts", {
    title: titulo,
    body: cuerpo,
    userId: 1,
  }).then((res) => {
    alert("Post creado con ID: " + res.data.id);

    setPosts([res.data, ...posts]);
    setTitulo("");
    setCuerpo("");
  });
};

const guardarEdicion = () => {
  axios.put(`https://jsonplaceholder.typicode.com/posts/${editando.id}`, {
    title: titulo,
    body: cuerpo,
    userId: 1,
  }).then((res) => {
    alert("Post editado!");

    const nuevosPosts = posts.map((p) =>
      p.id === editando.id ? { ...p, title: titulo, body: cuerpo } : p
    );
    setPosts(nuevosPosts);
    setEditando(null);
    setTitulo("");
    setCuerpo("");
  });
};


  const postsFiltrados = posts.filter((post) =>
    post.title.toLowerCase().includes(filtro.toLowerCase()) ||
    post.body.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Publicaciones</h1>

      <input
        type="text"
        placeholder="Filtrar por título o cuerpo"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <ul>
        {postsFiltrados.map((post) => (
          <li key={post.id} style={{ marginBottom: "10px" }}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
            <button onClick={() => {
              setEditando(post);
              setTitulo(post.title);
              setCuerpo(post.body);
            }}>Editar</button>
          </li>
        ))}
      </ul>

      <h2>{editando ? "Editar publicación" : "Crear nueva publicación"}</h2>

      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      /><br />

      <textarea
        placeholder="Cuerpo"
        value={cuerpo}
        onChange={(e) => setCuerpo(e.target.value)}
      /><br />

      {editando ? (
        <button onClick={guardarEdicion}>Guardar cambios</button>
      ) : (
        <button onClick={crearPost}>Crear publicación</button>
      )}
    </div>
  );
}

export default App;
