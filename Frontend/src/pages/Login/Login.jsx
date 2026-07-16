import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { utilisateurService } from "../../services/utilisateur.Service";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [mot_de_passe, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !mot_de_passe) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await utilisateurService.login({ email, mot_de_passe });
      if (res) {
        navigate("/dashboard", { state: { user: res.data.utilisateur } });
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Une erreur est survenue. Veuillez réessayer.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          {/* <div className="login-logo">⚕️</div> */}
          <div className="login-logo">
            <img src="src/assets/logo.png" alt="" width={60} height={60}/>
          </div>
          <h1 className="login-title">
            <span>Hospi</span>Sync
          </h1>
          <p className="login-subtitle">Connexion au système hospitalier</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="nom@hopital.mg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Mot de passe <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={mot_de_passe}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Connexion...
              </>
            ) : (
              <>
                <LogIn size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Se connecter
              </>
            )}
          </button>

          <div className="login-footer">
            <button
              type="button"
              className="link"
              onClick={() => navigate("/register")}
            >
              <span className="link-text">
                 Créer un compte
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;