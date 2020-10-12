import http from './http-common';

class TiposDeExpedientes {
  /**
   * Obtener todos los tipos de expedientes.
   * @returns {Promise<AxiosResponse<TiposDeExpedientes>>}
   */
  getAll() {
    return http.get('/tipos_de_expedientes/?format=json');
  }

  /**
   * Obtener un tipo de expediente de acuerdo a su ID
   * @param id ID tipo expediente
   * @returns {Promise<AxiosResponse<TipoExpediente>>}
   */
  getById(id) {
    return http.get(`/tipos_de_expedientes/${id}?format=json`);
  }

  /**
   * Obtener la ruta para cada tipo de expediente
   * @param id ID tipo expediente
   * @returns {Promise<AxiosResponse<TipoExpediente_Detalle>>}
   */
  getDetails(id) {
    return http.get(`/tipos_de_expedientes_detalles/?format=json&tipo_de_expediente_id=${id}`);
  }

  /**
   * Crea un nuevo tipo de expediente (cabecera).
   * @param tipoExpediente
   * @returns {Promise<AxiosResponse<any>>}
   */
  create(tipoExpediente) {
    return http.post('/tipos_de_expedientes/', tipoExpediente);
  }

  /**
   * Actualiza los valores del tipo de expediente. Solo la cabecera.
   * @param id
   * @param tipoExpediente
   * @returns {Promise<AxiosResponse<any>>}
   */
  update(id, tipoExpediente) {
    return http.put(`/tipos_de_expedientes/${id}`, tipoExpediente);
  }

  /**
   * Crea el detalle para un tipo de expediente. Es decir agrega una dependencia a la ruta del nuevo tipo de expediente.
   * @param detail
   * @returns {Promise<AxiosResponse<any>>}
   */
  createDetail(detail) {
    return http.post('/tipos_de_expedientes_detalles/', detail);
  }

  /**
   * Elimina un tipo de expediente. Con su respectiva ruta.
   * @param id
   * @returns {Promise<AxiosResponse<any>>}
   */
  delete(id) {
    return http.delete(`tipos_de_expedientes/${id}`);
  }

  /**
   * Retorna la ultima dependencia de una ruta determinado por el ID del tipo de expediente. Si ocurre un error se
   * retorna 0 (cero)
   * @param tdeId
   * @returns Promise<AxiosResponse<any>>
   */
  getLastDependencia(tdeId) {
    return http.get(`tipos_de_expedientes_detalles/?tipo_de_expediente_id=${tdeId}`);
  }

  /**
   * Retorna la segunda dependencia de una ruta determinado por el ID del tipo de expediente. Si ocurre un error se
   * retorna 0 (cero)
   * @param tdeId
   * @returns Promise<AxiosResponse<any>>
   */
  getSecondDependencia(tdeId) {
    return http.get(`tipos_de_expedientes_detalles/?tipo_de_expediente_id=${tdeId}`);
  }

}

export default new TiposDeExpedientes();
