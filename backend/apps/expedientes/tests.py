from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse


class PrioridadTestCase(APITestCase):
    prioridades_url = reverse('prioridades')

    def test_create_prioridad(self):
        response = self.client.post(self.prioridades_url, {
            "descripcion": "prioridad test"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_prioridad(self):
        response = self.client.get(self.prioridades_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_id_prioridad(self):
        response = self.client.get(self.prioridades_url + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_prioridad(self):
        response = self.client.put(self.prioridades_url + '1', {
            "descripcion": "prioridad modificada",
            "activo": False
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_prioridad(self):
        response = self.client.delete(self.prioridades_url + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class EstadoTestCase(APITestCase):
    estados_url = reverse('estados')

    def test_create_estado(self):
        response = self.client.post(self.estados_url, {
            "descripcion": "estado test"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_estado(self):
        response = self.client.get(self.estados_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_id_estado(self):
        response = self.client.get(self.estados_url + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_estado(self):
        response = self.client.put(self.estados_url + '1', {
            "descripcion": "estado modificiado",
            "activo": False
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_estado(self):
        response = self.client.delete(self.estados_url + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class ObjetoDeGastoTestCase(APITestCase):
    objetos_de_gastos_url = reverse('objetos_de_gastos')

    def test_create_objeto_de_gasto(self):
        response = self.client.post(self.objetos_de_gastos_url, {
            "descripcion": "objeto de gasto test"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_objeto_de_gasto(self):
        response = self.client.get(self.objetos_de_gastos_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_id_objeto_de_gasto(self):
        response = self.client.get(self.objetos_de_gastos_url + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_objeto_de_gasto(self):
        response = self.client.put(self.objetos_de_gastos_url + '1', {
            "descripcion": "objeto de gasto modificado",
            "activo": False
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_objeto_de_gasto(self):
        response = self.client.delete(self.objetos_de_gastos_url + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class ExpedienteTestCase(APITestCase):
    expedientes_url = reverse('expedientes')

    def test_create_expediente(self):
        response = self.client.post(self.expedientes_url, {
            "anho": 2020,
            "descripcion": "this is a description",
            "tipo_de_expediente_id": 1,
            "dependencia_origen_id": 1,
            "dependencia_destino_id": 3,
            "prioridad_id": 1,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_expediente(self):
        response = self.client.get(self.expedientes_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_id_expediente(self):
        response = self.client.get(self.expedientes_url + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_expediente(self):
        response = self.client.put(self.expedientes_url + '1', {
            "numero_mesa_de_entrada": 1234,
            "anho": 2020,
            "descripcion": "expediente modificado",
            "monto": "250000",
            "fecha_mesa_entrada": "2020-12-30T20:25:45.474Z",
            "tipo_de_expediente_id": 1,
            "dependencia_origen_id": 1,
            "dependencia_destino_id": 3,
            "objeto_de_gasto_id": 1,
            "estado_id": 1,
            "prioridad_id": 1,
            "lote_id": 1
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_expediente(self):
        response = self.client.delete(self.expedientes_url + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class InstanciaTestCase(APITestCase):
    instancias_url = reverse('instancias')

    # instancias_expedientes_url = reverse('instancias_expedientes')
    # instancias_x_expedientes_url = reverse('instancia_x_expediente')

    def test_create_instancia(self):
        response = self.client.post(self.instancias_url, {
            "orden_actual": 1,
            "expediente_id": 1,
            "dependencia_anterior_id": 1,
            "dependencia_actual_id": 2,
            "dependencia_siguiente_id": 3,
            "usuario_id_entrada": 1
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_instancias(self):
        response = self.client.get(self.instancias_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_id_instancia(self):
        response = self.client.get(self.instancias_url + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_instancia(self):
        response = self.client.put(self.instancias_url + '1', {
            "orden_actual": 1,
            "expediente_id": 1,
            "dependencia_anterior_id": 3,
            "dependencia_actual_id": 2,
            "dependencia_siguiente_id": 1,
            "usuario_id_entrada": 1
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_instancia(self):
        response = self.client.delete(self.instancias_url + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # def test_last_instancias_x_expedientes(self):
    #     response = self.client.get(self.instancias_expedientes_url + '1')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_instancias_x_expedientes(self):
    #     response = self.client.get(self.instancias_x_expedientes_url + '1')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)


class ComentarioTestCase(APITestCase):
    comentarios_url = reverse('comentarios')

    def test_create_comentario(self):
        response = self.client.post(self.comentarios_url, {
            "descripcion": "comentario de testeo",
            "instancia_id": 1,
            "usuario_id": 1
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_comentario(self):
        response = self.client.get(self.comentarios_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_id_comentario(self):
        response = self.client.get(self.comentarios_url + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_comentario(self):
        response = self.client.put(self.comentarios_url + '1', {
            "descripcion": "comentario modificado",
            "instancia_id": 1,
            "usuario_id": 1
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_comentario(self):
        response = self.client.delete(self.comentarios_url + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
