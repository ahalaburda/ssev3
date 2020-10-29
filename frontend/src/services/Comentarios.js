import http from "./http-common";

class Comentarios {
  create(data) {
    return http.post('/comentarios/', data);
  }
}

export default new Comentarios();