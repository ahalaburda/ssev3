import http from './http-common';

class ObjetosDeGastos{
    getAll(){
        return http.get('/objetos_de_gastos/?format=json');
    }

    create(objetoDeGasto){
        return http.post('objetos_de_gastos/', objetoDeGasto);
    }
}

export default new ObjetosDeGastos();