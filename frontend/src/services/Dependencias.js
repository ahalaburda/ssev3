import http from './http-common';

class Dependencias {
  /**
   * Obtener todas las dependencias
   * @returns {Promise<AxiosResponse<Dependencias>>}
   */
  getAll() {
    return http.get('/dependencias/?format=json');
  }
}

export default new Dependencias();