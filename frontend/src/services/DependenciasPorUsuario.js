import http from './http-common';

class DependenciasPorUsuario {
  /**
   * Obtener las dependencias asignadas a un usuario
   * @param id ID del usuario
   * @returns {Promise<AxiosResponse<DependenciasPorUsuario>>}
   */
  getByUser(id) {
    return http.get(`dependencias_por_usuarios/?format=json&usuario_id=${id}`);
  }
}

export default new DependenciasPorUsuario();