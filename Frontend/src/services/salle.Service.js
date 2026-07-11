import api from "./api";

export const salleService = {
    getAll: () => api.get("/salles"),
    getById: (id) => api.get(`/salles/${id}`),
    create: (data) => api.post("/salles", data),
    update: (id, data) => api.put(`/salles/${id}`, data),
    delete: (id) => api.delete(`/salles/${id}`),
    occupation: () => api.get("/salles/occupation")

};