import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formVisible, setFormVisible] = useState(false);
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
    if (editando.id > 100) {

      const nuevosPosts = posts.map((p) =>
        p.id === editando.id ? { ...p, title: titulo, body: cuerpo } : p
      );
      setPosts(nuevosPosts);
      setEditando(null);
      setTitulo("");
      setCuerpo("");
      alert("Post editado localmente");
    } else {

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
    }
  };

  const postsFiltrados = posts.filter((post) =>
    post.title.toLowerCase().includes(filtro.toLowerCase()) ||
    post.body.toLowerCase().includes(filtro.toLowerCase())
  );

  const limpiarCampos = () => {
    setTitulo("");
    setCuerpo("");
    setEditando(null); 
  };

    const abrirFormularioCrear = () => {
    setEditando(null);
    setTitulo("");
    setCuerpo("");
    setFormVisible(true);
  };

    const abrirFormularioEditar = (post) => {
    setEditando(post);
    setTitulo(post.title);
    setCuerpo(post.body);
    setFormVisible(true);
  };
  
   return (
    <>
      <div className="background"></div>
      <div className="container">
        <h1>Publicaciones</h1>

        {!formVisible && !editando && (
          <button onClick={abrirFormularioCrear} style={{ marginBottom: "10px" }}>
            Crear nueva publicación
          </button>
        )}

        {(formVisible || editando) && (
          <>
            <h2>{editando ? "Editar publicación" : "Crear nueva publicación"}</h2>

            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            <textarea
              placeholder="Cuerpo"
              value={cuerpo}
              onChange={(e) => setCuerpo(e.target.value)}
            />

            {editando ? (
              <>
                <button onClick={guardarEdicion}>Guardar cambios</button>
                <button onClick={() => { limpiarCampos(); setFormVisible(false); }} style={{ marginLeft: "10px" }}>Cancelar</button>
              </>
            ) : (
              <>
                <button onClick={crearPost}>Crear publicación</button>
                <button onClick={() => { limpiarCampos(); setFormVisible(false); }} style={{ marginLeft: "10px" }}>Limpiar/Cerrar</button>
              </>
            )}
          </>
        )}

        <input
          className="filter-input"
          type="text"
          placeholder="Filtrar por título o cuerpo"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ marginTop: (formVisible || editando) ? "20px" : "10px" }}
        />

        <ul>
          {postsFiltrados.map((post) => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <p>{post.body}</p>
              <button onClick={() => abrirFormularioEditar(post)}>Editar</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
