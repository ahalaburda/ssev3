import http from "./http-common";

class Expedientes {
  /**
   * Crea un nuevo expediente
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  create(data) {
    return http.post('/expedientes/', data);
  }

  /**
   * Elimina un expediente
   * @param id ID del expediente a eliminar
   * @returns {Promise<AxiosResponse<any>>}
   */
  delete(id) {
    return http.delete(`/expedientes/${id}`);
  }

  /**
   * Actualiza X campo del expediente
   * @param id ID del expediente
   * @param data Nuevos datos
   * @returns {Promise<AxiosResponse<any>>}
   */
  update(id, data) {
    return http.patch(`/expedientes/${id}`, data);
  }
}

export default new Expedientes();