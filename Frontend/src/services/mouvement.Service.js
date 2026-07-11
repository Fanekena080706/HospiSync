import api from './api';

export const mouvementService = {
    getAll: () => api.get('/mouvements'),
    create: (data) => api.post('/mouvements', data)
}