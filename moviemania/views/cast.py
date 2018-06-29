from django.shortcuts import get_object_or_404
from moviemania.serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..permissions import IsStaffMember


class CastApi(APIView):

    def get(self, request, format=None):
        casts = Cast.objects.all()
        serializer = CastSerializer(casts, many=True)
        return Response(serializer.data)


class CastDetailedApi(APIView):
    """
        Returns cast details and all the movies the cast has acted in sorted by their release date
    """
    def get(self, request, cast_id, format=None):
        cast = get_object_or_404(Cast, pk=cast_id)
        res = CastSerializer(cast).data
        res['movies'] = cast.movie_set.all().values("id", "name", "release_date").order_by("release_date")
        return Response(res)


class CreateCastApi(APIView):
    permission_classes = (IsAuthenticated, IsStaffMember)

    def post(self, request, format=None):
        serializer = CastSerializer(data=request.data)
        if serializer.is_valid():
            # check if there is already an actor existing with the same name
            if not Cast.objects.filter(name=request.data["name"]).exists():
                cast = serializer.save()
                return Response({'id': cast.id}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "cast already exists with the name"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateCastApi(APIView):
    permission_classes = (IsAuthenticated, IsStaffMember)

    def put(self, request, cast_id, format=None):
        cast = get_object_or_404(Cast, pk=cast_id)
        serializer = CastSerializer(cast, request.data)
        if serializer.is_valid():
            cast_with_name = Cast.objects.filter(name=request.data["name"]).values("id")
            if not cast_with_name.exists() or cast_with_name[0]['id'] == cast.id:
                cast = serializer.save()
                return Response({'id': cast.id}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "cast already exists with the name"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, cast_id, format=None):
        cast = get_object_or_404(Cast, pk=cast_id)
        cast.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
