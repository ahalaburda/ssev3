import http from "./http-common";

class Expedientes {
  getAll() {
    return http.get('/expedientes/?format=json');
  }

  getList() {
    return http.get('/expedientes_detalle/?format=json');
  }
}

export default new Expedientes;