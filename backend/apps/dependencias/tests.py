from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse


class DependenciasTestCase(APITestCase):
    list_url = reverse("dependencias")

    def test_create_dep(self):
        response = self.client.post(self.list_url, {
            "descripcion": "dependencia test"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_dep_list(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_dep_by_id(self):
        response = self.client.get(self.list_url + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_dep(self):
        response = self.client.put(self.list_url + '1', {
            "descripcion": "modificacion",
            "activo": False
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_dep(self):
        response = self.client.delete(self.list_url + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class DependenciaPorUsuarioTestCase(APITestCase):
    dep_x_usuarios = reverse("dependencias_por_usuarios")

    def test_create_dep_x_user(self):
        response = self.client.post(self.dep_x_usuarios, {
            "dependencia_id": 1,
            "usuario_id": 1
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_dep_x_usuarios_list(self):
        response = self.client.get(self.dep_x_usuarios)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_dep_x_usuarios_by_id(self):
        response = self.client.get(self.dep_x_usuarios + '1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_dep_x_usuarios(self):
        response = self.client.put(self.dep_x_usuarios + '1', {
            "dependencia_id": 2,
            "usuario_id": 1
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_dep_x_usuarios(self):
        response = self.client.delete(self.dep_x_usuarios + '1')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
