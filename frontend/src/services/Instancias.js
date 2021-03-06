import http from "./http-common";
import helper from "../utils/helper";

class Instancias {
  /**
   * Obtener una instancia de acuerdo al ID de expediente.
   * @param exp_id ID de Expediente
   * @returns {Promise<AxiosResponse<Instancia>>}
   */
  getByExpedienteId(exp_id) {
    return http.get(`/instancias/?expediente_id=${exp_id}&format=json`);
  }

  /**
   * Obtener una o varias instancias de acuerdo a una descripcion dada.
   * @param description Descripcion buscada
   * @returns {Promise<AxiosResponse<Instancia>>}
   */
  getByExpDescription(description,page) {
    return http.get(`/instancias/?expediente_descripcion=${description}&page=${page}&format=json`);
  }

  /**
   * Obtener una instancia de acuerdo al numero de mesa de entrada y anho proporcionados.
   * @param year Anho
   * @param num Numero mesa de entrada
   * @returns {Promise<AxiosResponse<Instancia>>}
   */
  getByExpYearNum(year, num) {
    return http.get(`/instancias/?expediente_anho=${year}&expediente_nro_mesa=${num}&format=json`);
  }

  /**
   * Obtener las instancias de acuerdo a la dependencia actual en la que se encuentra el expediente y que
   * dependencia asignada tiene el usuario. Tambien se puede filtrar por estado de expediente
   * El usuario se obtiene del access token alojado en el localStorage.
   * La configuracion de anho lo obtiene del session storage.
   * @param page Pagina
   * @param state Estado del expediente
   * @returns {Promise<AxiosResponse<Instancia>>}
   */
  getInstanciaExpedienteEachUser(page, state) {
    if (helper.existToken() && helper.existYearSetting()) {
      return http.get(`/instancias/expedientes/${helper.getCurrentUserId()}?anho=${helper.getCurrentYearSetting()}&estado=${state}&format=json&page=${page}`);
    }
    return http.get(`/instancias/expedientes/0?format=json&page=${page}`);
  }

  /**
   * Obtener todas las instancias.
   * @returns {Promise<AxiosResponse<Instancia>>}
   */
  getAll(page) {
    return http.get(`/instancias/?format=json&page=${page}`);
  }

  /**
   * Crea una nueva instancia
   * @param data
   * @returns {Promise<AxiosResponse<any>>}
   */
  create(data) {
    return http.post('/instancias/', data);
  }

  /**
   * Elimina una instancia
   * @param id ID de la instancia a eliminar
   * @returns {Promise<AxiosResponse<any>>}
   */
  delete(id) {
    return http.delete(`/instancias/${id}`);
  }

  /**
   * Actualiza X campo de la instancia
   * @param id ID de instancia
   * @param data Nuevos datos
   * @returns {Promise<AxiosResponse<any>>}
   */
  update(id, data) {
    return http.patch(`/instancias/${id}`, data);
  }

  /**
   * Obtiene una o varias instancias de acuerdo al estado dado.
   * @param estado Estado de Expediente
   * @returns {Promise<AxiosResponse<Instancia>>}
   */
  /**
   * Obtiene un a o varias instancias de acuerdo a los filtros seleccionados
   * @param {*} fecha_desde
   * @param {*} fecha_hasta
   * @param {*} origen
   * @param {*} objeto
   * @param {*} descripcion
   * @param {*} estado
   */
  getExpForReportes(fecha_desde, fecha_hasta, origen, objeto, descripcion, estado, page) {
    return http.get(`/instancias/?fecha_desde=${fecha_desde}&fecha_hasta=${fecha_hasta}&origen=${origen}&objeto_de_gasto=${objeto}&expediente_descripcion=${descripcion}&estado=${estado}&page=${page}&format=json`)
  }

  getExpForReportesSinPag(fecha_desde, fecha_hasta, origen, objeto, descripcion, estado) {
    return http.get(`/instancias_sin_pag/?fecha_desde=${fecha_desde}&fecha_hasta=${fecha_hasta}&origen=${origen}&objeto_de_gasto=${objeto}&expediente_descripcion=${descripcion}&estado=${estado}&format=json`)
  }
  /**
   * Obtiene todas las instancias de un expediente
   * @param {*} expediente_id
   */
  getInstanciasPorExp(expediente_id, orden) {
    return http.get(`/instancias_por_expediente/?exp_id=${expediente_id}&orden=${orden}`)
  }

  /**
   * Obtiene la instancia con numero de Mesa de entrada mas alto
   * del año en el que se trabaja
   */
  getInstanciasPorDepEstAnho() {
    return http.get(`/last_instancia_mesa_entrada/`)
  }

}

export default new Instancias();