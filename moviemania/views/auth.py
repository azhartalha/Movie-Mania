from django.shortcuts import get_object_or_404
from moviemania.serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class SignUpAPi(APIView):
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = User.objects.create_user(**serializer.data)
            return Response({'id': user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserApi(APIView):
    permission_classes = (IsAuthenticated, )
    """
        Update User info such as password, email, first name, last name
    """
    def put(self, request, format=None):
        user = get_object_or_404(User, pk=request.user.id)
        serializer = UserUpdateSerializer(user, request.data)

        if serializer.is_valid():
            user = serializer.save()
            """
                When saving the user via serializer hashing wont be done, so by calling the method "set_password"
                the hashed values of the password will be stored in the DB
            """
            user.set_password(user.password)
            user.save()
            return Response({'id': user.id}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
