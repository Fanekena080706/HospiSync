import api from './api';

export const utilisateurService = {
    login: (data) => api.post('/utilisateurs/login', data),
    getAll: () => api.get('/utilisateurs'),
    getById: (id) => api.get(`/utilisateurs/${id}`),
    create: (data) => api.post('/utilisateurs', data),
    update: (id, data) => api.put(`/utilisateurs/${id}`, data),
    delete: (id) => api.delete(`/utilisateurs/${id}`)
}