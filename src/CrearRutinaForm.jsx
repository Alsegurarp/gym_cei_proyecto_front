import React, { useState } from "react";
import './CrearRutinaForm.css'; // Asegúrate de importar tu archivo CSS aquí

function CrearRutinaForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    ejercicios: "",
    status: "",
  });

  const [mensaje, setMensaje] = useState(""); // Mensaje de éxito o error

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://gym-cei-proyecto.onrender.com/rutinas/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ejercicios: formData.ejercicios.split("\n"), // Convertir los ejercicios en un array
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMensaje("Rutina creada exitosamente. ID: " + data[0]?.id);
        setFormData({ nombre: "", descripcion: "", ejercicios: "", status: "" }); // Reiniciar el formulario
      } else {
        setMensaje("Error al crear la rutina.");
      }
    } catch (error) {
      console.error("Error al enviar la rutina:", error);
      setMensaje("Hubo un problema al crear la rutina.");
    }
  };

  return (
    <div>
      <h2>Crear Nueva Rutina</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ejercicios (Separados por coma):</label>
          <textarea
            name="ejercicios"
            value={formData.ejercicios}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit">Crear Rutina</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default CrearRutinaForm;
