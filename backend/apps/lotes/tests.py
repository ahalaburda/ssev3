from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse


class LoteTestCase(APITestCase):
    lotes_url = reverse('lotes')

    def test_create_lote(self):
        response = self.client.post(self.lotes_url, {
            "descripcion": "lote test",
            "activo": True,
            "dependencia_destino_id": 1
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_lote(self):
        response = self.client.get(self.lotes_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_by_id_lote(self):
        response = self.client.get(self.lotes_url + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_update_lote(self):
    #     response = self.client.put(self.lotes_url + '1', {
    #         "descripcion": "lote modificado",
    #         "activo": False
    #     })
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_lote(self):
        response = self.client.delete(self.lotes_url + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
