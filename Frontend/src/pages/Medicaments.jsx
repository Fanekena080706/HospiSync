
/* initial fotsiny ty fa afaka manampy pages */
import React from 'react';

// Déclaration d'un composant
function Medicaments() {
  const titre = "Bienvenue sur mon site";

  return (
    <div>
      {/* Intégration d'une variable JavaScript */}
      <h1>{titre}</h1>
      <p>Ceci est un exemple de code JSX basique.</p>
      
      {/* Utilisation de className au lieu de 'class' */}
      <button className="bouton-action">
        Cliquez ici
      </button>
    </div>
  );
}

export default Medicaments;
