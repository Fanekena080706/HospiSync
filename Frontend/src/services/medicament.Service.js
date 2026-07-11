import api from './api';

export const medicamentService = {
    getAll: () => api.get('/medicaments'),
    getById: (id) => api.get(`/medicaments/${id}`),
    create: (data) => api.post('/medicaments', data),
    update: (id, data) => api.put(`/medicaments/${id}`, data),
    delete: (id) => api.delete(`/medicaments/${id}`),
    alertes: () => api.get('/medicaments/alertes')
}