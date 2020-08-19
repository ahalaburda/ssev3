import http from './http-common';

class Dependencias {
  getAll() {
    return http.get('/dependencias/?format=json');
  }

  getById(id) {
    return http.get(`/dependencias/${id}?format=json`);
  }
}

export default new Dependencias();