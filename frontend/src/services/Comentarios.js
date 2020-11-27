import http from "./http-common";

class Comentarios {
  create(data) {
    return http.post('/comentarios/', data);
  }

  /**
   * Obtiene todos los comentarios de un expediente a traves de su ID
   * @param {*} expediente_id 
   */
  getComentarioPorExpedienteID(expediente_id){
    return http.get(`/comentarios/?comentario_por_expediente_id=${expediente_id}`)
  }
}

export default new Comentarios();