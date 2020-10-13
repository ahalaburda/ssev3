import http from "./http-common";

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
  getByExpDescription(description) {
    return http.get(`/instancias/?expediente_descripcion=${description}&format=json`);
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
   * dependencia asignada tiene el usuario.
   * El usuario se obtiene del access token alojado en el localStorage.
   * @param page Pagina
   * @returns {Promise<AxiosResponse<Instancia>>}
   */
  getInstanciaExpedienteEachUser(page) {
    if (localStorage.getItem('access_token')) {
      const token_parts = JSON.parse(atob(localStorage.getItem('access_token').split('.')[1]));
      const user_id = token_parts.user_id;
      return http.get(`/instancias/expedientes/${user_id}?format=json&page=${page}`);
    }
    return http.get(`/instancias/expedientes/0?format=json&page=${page}`);
  }

  /**
   * Obtener todas las instancias.
   * @returns {Promise<AxiosResponse<Instancia>>}
   */
  getAll() {
    return http.get('instancias/?format=json');
  }

  /**
   * Obtiene una o varias instancias de acuerdo al estado dado.
   * @param estado Estado de Expediente
   * @returns {Promise<AxiosResponse<Instancia>>}
   */
  getByExpEstado(origen,objeto,descripcion,estado){
    return http.get(`/instancias/?origen=${origen}&objeto_de_gasto=${objeto}&expediente_descripcion=${descripcion}&estado=${estado}&format=json`)
  }

  getExpForReportes(origen,objeto,descripcion){
    return http.get(`/instancias/?origen=${origen}&objeto_de_gasto=${objeto}&expediente_descripcion=${descripcion}&format=json`)

  }
}

export default new Instancias();