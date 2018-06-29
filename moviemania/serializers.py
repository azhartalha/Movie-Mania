from rest_framework import serializers
from moviemania.models import *
from django.db.models import Avg, Count


class CastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cast
        fields = '__all__'


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class MovieSerializer(serializers.ModelSerializer):
    cast = CastSerializer(read_only=True, many=True)
    genres = GenreSerializer(read_only=True, many=True)
    rating = serializers.SerializerMethodField('get_movie_rating')

    def get_movie_rating(self, movie):
        return Review.objects.values("rating").filter(
            movie=movie).aggregate(avg_rating=Avg('rating'))["avg_rating"]

    class Meta:
        model = Movie
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('groups', 'user_permissions', 'is_staff', 'is_active', 'is_superuser')


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ('username', 'groups', 'user_permissions', 'is_staff', 'is_active', 'is_superuser')