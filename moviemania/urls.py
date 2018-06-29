from django.conf.urls import url
from django.urls import path
from moviemania.views import *
app_name = 'MM'

urlpatterns = [
    path('movies', MovieApi.as_view(), name="movies"),
    path('movies/create', CreateMovieApi.as_view(), name="add_movie"),
    path('movies/<int:movie_id>', MovieDetailedApi.as_view(), name="movie_detailed"),
    path('movies/<int:movie_id>/update', UpdateMovieApi.as_view(), name="movie_detailed"),
    path('movies/<int:movie_id>/cast/<str:cast_name>', MovieCastApi.as_view(), name="movie_cast"),
    path('movies/<int:movie_id>/genre/<str:genre_name>', MovieGenreApi.as_view(), name="movie_genre"),

    path('movies/<int:movie_id>/reviews', ReviewApi.as_view(), name="review"),
    path('movies/<int:movie_id>/reviews/create', CreateReviewAPi.as_view(), name="review_create"),
    path('movies/<int:movie_id>/user_review', ReviewDetailedApi.as_view(), name="review_detailed"),
    path('movies/<int:movie_id>/user_review/update', UpdateReviewApi.as_view(), name="review_update"),

    path('cast', CastApi.as_view(), name="casts"),
    path('cast/create', CreateCastApi.as_view(), name="casts_create"),
    path('cast/<int:cast_id>', CastDetailedApi.as_view(), name="cast_detailed"),
    path('cast/<int:cast_id/update>', UpdateCastApi.as_view(), name="cast_update"),

    path('genre', GenreApi.as_view(), name="genre"),
    path('genre/create', CreateGenreApi.as_view(), name="genre_create"),
    path('genre/<int:genre_id>', GenreDetailed.as_view(), name="genre_detailed"),

    path('signup', SignUpAPi.as_view(), name="sign_up"),
    path('user_update', UpdateUserApi.as_view(), name="user_update"),
]
