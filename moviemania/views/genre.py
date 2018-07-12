from django.shortcuts import get_object_or_404
from moviemania.serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..permissions import IsAdmin


class GenreApi(APIView):

    def get(self, request, format=None):
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)


class CreateGenreApi(APIView):
    permission_classes = (IsAuthenticated, IsAdmin)

    def post(self, request, format=None):
        serializer = GenreSerializer(data=request.data)

        if serializer.is_valid():
            if not Genre.objects.filter(name=request.data["name"]).exists():
                genre = serializer.save()
                return Response({'id': genre.id}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "genre already already exists with the name"},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GenreDetailed(APIView):

    def get(self, request, genre_id, fomrat=None):
        genre = get_object_or_404(Genre, id=genre_id)
        page_no = 1
        if 'page' in request.query_params:
            page_no = int(request.query_params['page'])
        page_no -= 1

        if page_no < 0:
            page_no = 0

        res = GenreSerializer(genre).data

        sorted_movies = genre.movie_set.all().annotate(reviewsCount=Count('id'), avgRating=Avg(
            "review__rating")).order_by("reviewsCount").order_by("-avgRating")[page_no * 10:page_no * 10 + 10]

        res['movies'] = MovieSerializer(sorted_movies, many=True).data

        return Response(res)