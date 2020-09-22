import http from "./http-common";

class Instancias {
  getByExpedienteId(exp_id) {
    return http.get(`/instancias/?expediente_id=${exp_id}&format=json`);
  }

  getByExpDescription(description) {
    return http.get(`/instancias/?expediente_descripcion=${description}&format=json`);
  }

  getByExpYearNum(year, num) {
    return http.get(`/instancias/?expediente_anho=${year}&expediente_nro_mesa=${num}&format=json`);
  }

  getInstanciaExpedienteEachUser(page) {
    const token_parts = JSON.parse(atob(localStorage.getItem('access_token').split('.')[1]));
    const user_id = token_parts.user_id;
    return http.get(`/instancias/expedientes/${user_id}?format=json&page=${page}`);
  }
}

export default new Instancias();