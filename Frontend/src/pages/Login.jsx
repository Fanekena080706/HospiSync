import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    // Empêche le rechargement de la page par défaut lors d'un submit de formulaire
    e.preventDefault();

    // Validation simple avant d'envoyer la requête au backend
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      console.log("Tentative de connexion avec :", { email, password });
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">H</div>
          <h1 className="login-title">HospiSync</h1>
          <p className="login-subtitle">Connexion au système hospitalier</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="nom@hopital.mg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        
      </div>
    </div>
  );
}

export default Login;