import http from "./http-common";

class Comentarios {
  create(data) {
    return http.post('/comentarios/', data);
  }

  /**
   * Obtiene los comentarios de la instancia pasada por ID
   * @param {*} instancia_id 
   */
  getComentarioPorInstancia(instancia_id){
    return http.get(`/comentarios/?comentario_instancia=${instancia_id}`)
  }
}

export default new Comentarios();