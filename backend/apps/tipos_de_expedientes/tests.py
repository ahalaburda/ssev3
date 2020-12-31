from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse


class TipoExpedienteTestCase(APITestCase):
    tipo_expediente_url = reverse('tipos_de_expedientes')

    def test_create_tipo_expediente(self):
        response = self.client.post(self.tipo_expediente_url, {
            "descripcion": "tipo expediente test",
            "activo": True,
            "saltos": 10
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_tipo_expediente(self):
        response = self.client.get(self.tipo_expediente_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_id_tipo_expediente(self):
        response = self.client.get(self.tipo_expediente_url + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_tipo_expediente(self):
        response = self.client.put(self.tipo_expediente_url + '1', {
            "descripcion": "tipo expediente modificado",
            "activo": False,
            "saltos": 5
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_tipo_expediente(self):
        response = self.client.delete(self.tipo_expediente_url + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TipoExpedienteDetalleTestCase(APITestCase):
    tipo_expediented_detalle_url = reverse('tipo_expediente_detalle')

    def test_create_tipo_expediente_detalle(self):
        response = self.client.post(self.tipo_expediented_detalle_url, {
            "orden": 1,
            "tipo_de_expediente_id": 1,
            "dependencia_id": 1
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_tipo_expediente_detalle(self):
        response = self.client.get(self.tipo_expediented_detalle_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_id_tipo_expediente_detalle(self):
        response = self.client.get(self.tipo_expediented_detalle_url + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_tipo_expediente_detalle(self):
        response = self.client.put(self.tipo_expediented_detalle_url + '1', {
            "orden": 2,
            "tipo_de_expediente_id": 1,
            "dependencia_id": 2
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_tipo_expediente_detalle(self):
        response = self.client.delete(self.tipo_expediented_detalle_url + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
