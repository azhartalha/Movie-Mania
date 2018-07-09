from django.shortcuts import get_object_or_404
from moviemania.serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class ReviewApi(APIView):
    def get(self, request, movie_id, format=None):

        page_no = 1

        if 'page' in request.query_params:
            page_no = int(request.query_params['page'])

        page_no -= 1

        movie = get_object_or_404(Movie, pk=movie_id)
        reviews = Review.objects.filter(movie=movie).order_by("description").order_by("date")[page_no*10: page_no*10+10]
        serializer = ReviewSerializer(reviews, many=True)
        for i in range(len(serializer.data)):
            serializer.data[i]['username'] = User.objects.get(id=serializer.data[i]['user']).username
        return Response(serializer.data)


class ReviewDetailedApi(APIView):
    permission_classes = (IsAuthenticated, )
    """
        Firstly the API will tell if the user has already reviewed the movie or not, if yes then it will also return
        the data associated to the review
    """
    def get(self, request, movie_id, format=None):
        movie = get_object_or_404(Movie, pk=movie_id)
        review = Review.objects.filter(movie=movie).filter(user=request.user)
        if review.exists():
            data = {"reviewed": True}
            serializer = ReviewSerializer(review[0])
            data.update(**serializer.data)
            return Response(data)
        else:
            return Response({"reviewed": False})


class CreateReviewAPi(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, movie_id, format=None):
        movie = get_object_or_404(Movie, pk=movie_id)

        # check if the user has already given a review
        if Review.objects.filter(movie=movie).filter(user=request.user).exists():
            return Response({"message": "review already given for the movie"}, status=status.HTTP_403_FORBIDDEN)

        request.data['user'] = request.user.id
        request.data['movie'] = movie.id

        if 'rating' in request.data:
            if request.data['rating'] > 10:
                return Response({"message": "rating cannot be more than 10"}, status=status.HTTP_400_BAD_REQUEST)
            if request.data['rating'] < 1:
                return Response({"message": "rating cannot be less than 1"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            review = serializer.save()
            return Response({'id': review.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateReviewApi(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request, movie_id, format=None):
        movie = get_object_or_404(Movie, pk=movie_id)
        review = get_object_or_404(Review, movie=movie, user=request.user)

        request.data['user'] = request.user.id
        request.data['movie'] = movie.id

        serializer = ReviewSerializer(review, request.data)
        if serializer.is_valid():
            review = serializer.save()
            return Response({"id": review.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, movie_id, review_id, format=None):
        review = get_object_or_404(Review, pk=review_id, movie=movie_id)

        # check if the review was give by the same user or not
        if review.user.id != request.user.id:
            return Response({"message": "not authorized to change"}, status=status.HTTP_403_FORBIDDEN)

        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
