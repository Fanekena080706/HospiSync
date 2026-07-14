
import { useState,useEffect } from "react";
import "./AddPatiens.css";


// fonction izay chiffre iany no alaina eto 
function cleanDigits(value){
    return value.replace(/\D/g, '');
}
// format anle numero
function formatPhoneNumber(value){
    let chiffre = cleanDigits(value);

    chiffre = chiffre.slice(0,10);

    const parts = [];
    if(chiffre.length >0) parts.push(chiffre.slice(0,3));
    if(chiffre.length >3) parts.push(chiffre.slice(3,5));
    if(chiffre.length >5) parts.push(chiffre.slice(5,8));
    if(chiffre.length >8) parts.push(chiffre.slice(8,10));
    return parts.join(" ");

}
 function isvalidNumber(value){
    const chiffre = cleanDigits(value);
     return /^0(34|38|33|32|37)\d{7}$/.test(chiffre);
 }

export default function AddPatients({onClose, onPatientAdded,existingPhone,onPatientUpdated,patientToEdit}) {
    const [nom, setNom] = useState("");
    const [Prenom, setPrenom] = useState("");
    const [sexe, setSexe] = useState("");
    const [Groupesanguin, setGroupesanguin] = useState("");
    const [phone, setPhone] = useState("");
    const [adresse, setAdresse] = useState("");
    const [dateNaissance, setDateNaissance] = useState("");
    const [infos,setInfos] = useState("");
    const [niveau,setNiveau] = useState("");
    const [error , setError] = useState("");

    // manao aafichage anle formulaire rehefa misy patient editena
    useEffect(() =>{
        if(patientToEdit){
            setNom(patientToEdit.nom);
            setPrenom(patientToEdit.Prenom);
            setSexe(patientToEdit.sexe);
            setGroupesanguin(patientToEdit.Groupesanguin);
            setPhone(patientToEdit.phone);
            setAdresse(patientToEdit.adresse);
            setInfos(patientToEdit.infos);
            setNiveau(patientToEdit.niveau);
        }
    },[patientToEdit]);

    function handleSubmit(e){
        e.preventDefault();

        const phoneExisting = existingPhone.some((patient) => patient.phone === phone);
        if(phoneExisting){
            setError("Le numéro de téléphone existe déjà pour un autre patient.");
            return;
        }
        // atao mise a jour le donne vaovao anle patients
        if(patientToEdit){
            const updatedPatient = {
                id: patientToEdit.id,
                nom,
                Prenom,
                sexe,
                Groupesanguin,
                phone,
                adresse,
                dateNaissance,
                infos,
                niveau
            };
            onPatientUpdated(updatedPatient);
            onClose();
            return;
        }
        const newPatient = { id:crypto.randomUUID() ,nom, Prenom, sexe, Groupesanguin,phone,adresse,dateNaissance,infos,niveau};
        onPatientAdded(newPatient);
        onClose();
    }
    const handleChangePhone = (e) =>{
        const formatedPhone = formatPhoneNumber(e.target.value);
        const chiffre = cleanDigits(formatedPhone);
        if(!isvalidNumber(formatedPhone) && chiffre.length === 10){
            setError("Le numéro de téléphone n'est pas valide.");
        }
        setPhone(formatedPhone);
    }
    
    return(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Ajouter patients</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row" >
                        <div className="form-group">
                            <label >Nom</label>
                            <input 
                                type="text" value={nom} 
                                placeholder="Nom"
                                onChange={(e) => setNom(e.target.value)} 
                                required />
                        </div>
                        <div className="form-group">
                            <label >Prenom</label>
                            <input 
                                type="text"  
                                value={Prenom} onChange={(e) => setPrenom(e.target.value)} 
                                required
                                placeholder="Prenom"
                            />

                        </div>
                       
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                             <label >Sexe</label>
                            <select 
                                value={sexe}
                                onChange={(e) => setSexe(e.target.value)}
                                required
                            >
                                <option value="">Sélectionner</option>
                                <option value="Homme">Homme</option>
                                <option value="Femme">Femme</option>
                            </select>

                        </div>
                        <div className="form-group">
                            <label >Date de naissance</label>
                            <input type="date" 
                            value={dateNaissance} 
                            onChange={(e) => setDateNaissance(e.target.value)}
                            max={new Date().toISOString().split("T")[0]} 
                            />
                        </div>
                    </div>
                   
                    <div className="form-row">
                        <div className="form-group">
                            <label>Adresse</label>
                            <input 
                                type="text" 
                                value={adresse} 
                                onChange={(e) => setAdresse(e.target.value)} 
                                required
                                placeholder="Adresse"
                            />
                        </div>
                        <div className="form-group">
                            <label>Téléphone</label>
                            <input 
                                type="tel"
                                placeholder="034 12 345 54"
                                value={phone}
                                onChange={handleChangePhone}
                                onBlur={() => {
                                    if(!isvalidNumber(phone) && phone.length ===10){
                                        setError("Le numéro de téléphone n'est pas valide.");
                                    }else{
                                        setError("");
                                    }
                                }}
                                maxLength={13}
                                required
                                
                            />
                            {error && <p style={{color:"red", fontWeight:"bold"}}>{error}</p>}
                        
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Groupe sanguin</label>
                            <select 
                                value={Groupesanguin} 
                                onChange={(e) => setGroupesanguin(e.target.value)} 
                                required
                            >
                                <option value="">Sélectionner</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Niveau d'urgence</label>
                            <select 
                                name="" id=""
                                value={niveau} 
                                onChange={(e) => setNiveau(e.target.value)}
                                required
                            >
                                <option value="">Sélectionner</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="4">5</option>
                            </select>
                        </div>
                    </div>
                   
                    <label>Information médicales</label>
                    <textarea name="" id="" value={infos} placeholder="information medicales..." onChange={(e) => setInfos(e.target.value)} required></textarea>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="Annule-Button">Annuler</button>
                        <button type="submit">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    )
}