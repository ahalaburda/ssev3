import http from "./http-common";

class Instancias {
  getByExpedienteId(exp_id) {
    return http.get(`/instancias/?expediente_id=${exp_id}&format=json`);
  }

  getByExpDescription(description) {
    return http.get(`/instancias/?expediente_descripcion=${description}&format=json`);
  }

  getByExpYearNum(year, num) {
    return http.get(`/instancias/?expediente_anho=${year}&expediente_nro_mesa=${num}&format=json`)
  }
}

export default new Instancias();