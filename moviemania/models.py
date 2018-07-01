from django.db import models
from django.contrib.auth.models import User


class Cast(models.Model):
    name = models.CharField(max_length=64)
    born = models.DateField(null = True, blank = True)
    description = models.CharField(max_length=256, null=True, blank=True)
    display_picture = models.CharField(max_length=128, null=True, blank=True)

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(max_length=32)

    def __str__(self):
        return self.name


class Movie(models.Model):
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=256, null=True, blank=True)
    display_picture = models.CharField(max_length=128, null=True, blank=True)
    trailer = models.CharField(max_length=128, null=True, blank=True)
    release_date = models.DateField(null = True, blank = True)
    genres = models.ManyToManyField(Genre)
    cast = models.ManyToManyField(Cast)

    def __str__(self):
        return self.name


class Review(models.Model):
    rating = models.IntegerField()
    date = models.DateField()
    description = models.TextField(max_length=512, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.rating)


class Picture(models.Model):
    link = models.CharField(max_length=64)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    def __str__(self):
        return self.link


