import React, { useState, useEffect } from "react";
import Modal from "./Modal";

function RutinasComponent() {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rutinaToEdit, setRutinaToEdit] = useState(null);

  useEffect(() => {
    fetch("https://gym-cei-proyecto.onrender.com/rutinas")
      .then((response) => response.json())
      .then((data) => {
        setRutinas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar rutinas:", error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (rutina) => {
    console.log("Editando rutina:", rutina);
    setRutinaToEdit(rutina);
    setIsModalOpen(true);
  };

  const handleUpdate = async (rutina) => {
    console.log("Item a actualizar (antes del envío):", JSON.stringify(rutina));
    
    // Convertir ejercicios a lista separada por comas
    if (rutina.ejercicios) {
      rutina.ejercicios = rutina.ejercicios.split("\n").map((e) => e.trim()).join(", ");
    }

    try {
      const response = await fetch(`https://gym-cei-proyecto.onrender.com/rutinas/actualizar/${rutina.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rutina),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (data.success) {
        console.log("Actualización exitosa:", data);
        setRutinas((prevRoutines) =>
          prevRoutines.map((routine) =>
            routine.id === rutina.id ? data.data : routine
          )
        );
      } else {
        console.error("Error del servidor:", data.error);
        alert(data.error || "Error al actualizar la rutina");
      }
    } catch (error) {
      console.error("Error al intentar actualizar la rutina:", error);
      alert("Hubo un error al intentar actualizar la rutina.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://gym-cei-proyecto.onrender.com/rutinas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setRutinas((prevRutinas) => prevRutinas.filter((rutina) => rutina.id !== id));
    } catch (error) {
      console.error("Error al eliminar la rutina:", error);
      alert("Hubo un problema al eliminar la rutina.");
    }
  };

  if (loading) {
    return <p>Cargando rutinas...</p>;
  }

  return (
    <div>
      {rutinas.map((rutina) => (
        <div key={rutina.id} className="rutina">
          <h2>{rutina.nombre}</h2>
          <h4>{rutina.descripcion}</h4>
          <button onClick={() => handleEdit(rutina)}>Editar</button>
          <button onClick={() => handleDelete(rutina.id)}>Eliminar</button>
          <ul>
            {typeof rutina.ejercicios === "string"
              ? rutina.ejercicios.split(",").map((ejercicio, i) => (
                  <li key={i}>{ejercicio}</li>
                ))
              : rutina.ejercicios.map((ejercicio, i) => (
                  <li key={i}>{ejercicio}</li>
                ))}
          </ul>
        </div>
      ))}

      <Modal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
        rutina={rutinaToEdit}
      />
    </div>
  );
}

export default RutinasComponent;
