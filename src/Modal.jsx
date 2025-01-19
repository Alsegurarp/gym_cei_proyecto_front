import React, { useState, useEffect } from "react";
import "./ModalStyle.css";

const Modal = ({ isOpen, closeModal, onSubmit, rutina }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ejercicios, setEjercicios] = useState("");

  useEffect(() => {
    if (rutina && isOpen) {
      setNombre(rutina.nombre || "");
      setDescripcion(rutina.descripcion || "");

      // Verificar si ejercicios es un array y convertirlo en un string con saltos de línea
      if (Array.isArray(rutina.ejercicios)) {
        setEjercicios(rutina.ejercicios.join("\n"));  // Usamos salto de línea para separar los ejercicios
      } else if (typeof rutina.ejercicios === "string") {
        // Si es una cadena, intentamos convertirla a array y luego a string
        try {
          const ejerciciosArray = JSON.stringify(rutina.ejercicios);
          if (Array.isArray(ejerciciosArray)) {
            setEjercicios(ejerciciosArray.join("\n"));
          } else {
            setEjercicios(rutina.ejercicios);  // Si no es un array, mostramos el valor original
          }
        } catch (error) {
          console.error("Error al procesar ejercicios:", error);
          setEjercicios("");  // Si hay error en el parseo, mostramos vacío
        }
      }
    }
  }, [rutina, isOpen]);


  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir la entrada de ejercicios a un array
    const updatedData = {
      id: rutina.id,
      nombre,
      descripcion,
      ejercicios: JSON.stringify(ejercicios.split("\n").map((e) => e.trim())), // Convertimos de nuevo a un JSON de array
    };

    console.log("Datos enviados al backend:", updatedData);
    onSubmit(updatedData); // Enviamos los datos al componente padre
    closeModal(); // Cerramos el modal
  };

  if (!isOpen) return null; // Si no está abierta, no renderizamos nada

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Rutina</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label>Ejercicios (uno por línea)</label>
            <textarea
              value={ejercicios}
              onChange={(e) => setEjercicios(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={closeModal}>
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
