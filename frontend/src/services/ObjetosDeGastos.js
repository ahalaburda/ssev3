import http from './http-common';

class ObjetosDeGastos{
    getAll(){
        return http.get('/objetos_de_gastos/?format=json');
    }

    create(objetoDeGasto){
        return http.post('objetos_de_gastos/', objetoDeGasto);
    }

    update(id, objetoDeGasto) {
        return http.put(`/objetos_de_gastos/${id}`, objetoDeGasto);
    }

    getById(id){
        return http.get('/objetos_de_gastos/' + id + '?format=json');
    }
}

export default new ObjetosDeGastos();