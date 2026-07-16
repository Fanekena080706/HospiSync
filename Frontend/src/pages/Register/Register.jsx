import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { utilisateurService } from "../../services/utilisateur.Service";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Briefcase } from "lucide-react";
import "./Register.css";

function Register() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [mot_de_passe, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (!nom || !prenom || !email || !mot_de_passe || !role) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (mot_de_passe.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (mot_de_passe !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await utilisateurService.create({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        mot_de_passe: mot_de_passe,
        role: role,
      });

      if (res) {
        navigate("/dashboard");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Une erreur est survenue lors de l'inscription.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">
            <img src="src/assets/logo.png" alt="" width={60} height={60}/>
          </div>
          <h1 className="register-title">
            <span>Hospi</span>Sync
          </h1>
          <p className="register-subtitle">Créer un nouveau compte</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="register-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">
                Nom <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="nom"
                  type="text"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prenom">
                Prénom <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="prenom"
                  type="text"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

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
            <label htmlFor="role">
              Rôle <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <Briefcase size={18} className="input-icon" />
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="Administrateur">Administrateur</option>
                <option value="Personnel">Personnel</option>
              </select>
            </div>
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirmer <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Inscription en cours...
              </>
            ) : (
              <>
                <UserPlus size={18} style={{ marginRight: "8px", verticalAlign: "middle" }} />
                S'inscrire
              </>
            )}
          </button>

          <div className="register-footer">
            <button
              type="button"
              className="link"
              onClick={() => navigate("/")}
            >
              <span className="link-text">
                Déjà un compte ? Se connecter
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;