import http from './http-common';

class Dependencias {
  getAll() {
    return http.get('/dependencias/?format=json');
  }
}

export default new Dependencias();