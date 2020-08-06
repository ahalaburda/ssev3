import http from "./http-common";

class Consultas {
  getById(id) {
    return http.get(`/expedientes/${id}?format=json`);
  }
}

export default new Consultas;