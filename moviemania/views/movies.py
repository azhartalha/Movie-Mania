from django.shortcuts import get_object_or_404
from moviemania.serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg
from rest_framework.permissions import IsAuthenticated
from ..permissions import IsStaffMember


class MovieApi(APIView):

    def get(self, request, format=None):
        """
            For each page only 10 movies will be returned as all the data cannot be returned at once
            So page number has to passed as query parameter, if not the default page number will be considered
            which is one
        """
        page_no = 1

        if 'page' in request.query_params:
            page_no = int(request.query_params['page'])

        page_no -= 1
        """
            Getting the sorted list of movies based on their average rating
            if the average ratings are same then the total number of votes will be considered
        """
        movies = Movie.objects.all().annotate(reviewsCount=Count('id'), avgRating=Avg(
            "review__rating")).order_by("reviewsCount").order_by("-avgRating")[page_no * 10:page_no * 10 + 10]

        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)


class MovieDetailedApi(APIView):

    def get(self, request, movie_id, format=None):
        movie = get_object_or_404(Movie, pk=movie_id)
        serializer = MovieSerializer(movie)
        return Response(serializer.data)


class CreateMovieApi(APIView):
    permission_classes = (IsAuthenticated, IsStaffMember)

    def post(self, request, format=None):
        serializer = MovieSerializer(data=request.data)
        if serializer.is_valid():
            movie = serializer.save()
            return Response({'id':movie.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateMovieApi(APIView):
    permission_classes = (IsAuthenticated, IsStaffMember)

    def put(self, request, movie_id, format=None):
        movie = get_object_or_404(Movie, pk=movie_id)
        serializer = MovieSerializer(movie, request.data)
        if serializer.is_valid():
            movie = serializer.save()
            return Response(movie.id, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, movie_id, format=None):
        movie = get_object_or_404(Movie, pk=movie_id)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MovieCastApi(APIView):
    permission_classes = (IsAuthenticated, IsStaffMember,)

    def post(self, request, movie_id, cast_name, format=None):
        movie = get_object_or_404(Movie, pk=movie_id)
        cast = get_object_or_404(Cast, name=cast_name)

        movie.cast.add(cast)
        return Response({'id': movie.id}, status=status.HTTP_201_CREATED)

    def delete(self, request, movie_id, cast_name, format=None):
        movie = get_object_or_404(Movie, pk=movie_id)
        cast = get_object_or_404(Cast, name=cast_name)

        cast.movie_set.remove(movie)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MovieGenreApi(APIView):
    permission_classes = (IsAuthenticated, IsStaffMember,)

    def post(self, request, movie_id, genre_name, format=None):
        movie = get_object_or_404(Movie, pk=movie_id)
        genre = get_object_or_404(Genre, name=genre_name)

        movie.genres.add(genre)
        return Response({'id': movie.id}, status=status.HTTP_201_CREATED)

    def delete(self, request, movie_id, genre_name, format=None):
        movie = get_object_or_404(Movie, pk=movie_id)
        genre = get_object_or_404(Genre, name=genre_name)

        genre.movie_set.remove(movie)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MovieSearch(APIView):

    def get(self, request, format=None):
        name = ""

        if 'name' in request.query_params:
            name = request.query_params['name']

        page_no = 1

        if 'page' in request.query_params:
            page_no = request.query_params['']

        page_no -= 1

        movies = Movie.objects.filter(name__icontains=name)[page_no*10: (page_no + 1)*10]

        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)