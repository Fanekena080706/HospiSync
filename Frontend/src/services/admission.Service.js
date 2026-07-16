import api from './api';

export const admissionService = {
    getAll: () => api.get("/admissions"),
    getById: (id) => api.get(`/admissions/${id}`),
    create: (data) => api.post("/admissions", data),
    update: (id,data) => api.put(`/admissions/${id}`, data),
    delete: (id) => api.delete(`/admissions/${id}`),
    transfert: (id, data) => api.put(`/admissions/transfert/${id}`, data),
    sortie: (id) => api.put(`/admissions/sortie/${id}`),
    historique: () => api.get("/admissions/historique"),
    admissionParSemaine: () => api.get("/admissions/semaine")
}