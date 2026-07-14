import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function Profile() {
  const navigate = useNavigate();
  const { user, refreshProfile, saveProfile, removeProfile, profileSaving } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    code: "",
    faculty: "",
    contact_info: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || user.name || "",
        email: user.email || "",
        code: user.code || "",
        faculty: user.faculty || "",
        contact_info: user.contact_info || "",
        password: ""
      });
    }
  }, [user]);

  useEffect(() => {
    refreshProfile().catch(() => {});
  }, []);

  const handleChange = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await saveProfile({
        full_name: formData.full_name,
        email: formData.email,
        code: formData.code,
        faculty: formData.faculty,
        contact_info: formData.contact_info,
        password: formData.password || undefined
      });
      setFormData((current) => ({ ...current, password: "" }));
      setMessage("Perfil actualizado correctamente.");
    } catch (submitError) {
      setError(submitError.message || "No se pudo actualizar el perfil.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Se desactivara tu cuenta y cerrara la sesion. Quieres continuar?"
    );
    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await removeProfile();
      navigate("/login", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "No se pudo eliminar el perfil.");
    }
  };

  return (
    <section className="card page-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Cuenta</p>
          <h3>Perfil</h3>
        </div>
      </div>

      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="details-grid">
          <label className="field-group">
            <span>Nombre completo</span>
            <input value={formData.full_name} onChange={handleChange("full_name")} required />
          </label>

          <label className="field-group">
            <span>Correo</span>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              required
            />
          </label>

          <label className="field-group">
            <span>Registro</span>
            <input value={formData.code} onChange={handleChange("code")} required />
          </label>

          <label className="field-group">
            <span>Carrera</span>
            <input value={formData.faculty} onChange={handleChange("faculty")} />
          </label>

          <label className="field-group">
            <span>Telefono</span>
            <input value={formData.contact_info} onChange={handleChange("contact_info")} />
          </label>

          <label className="field-group">
            <span>Nueva contrasena</span>
            <input
              type="password"
              placeholder="Deja vacio si no deseas cambiarla"
              value={formData.password}
              onChange={handleChange("password")}
            />
          </label>
        </div>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="danger-button" onClick={handleDelete}>
            Desactivar cuenta
          </button>
          <button type="submit" disabled={profileSaving}>
            {profileSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Profile;
