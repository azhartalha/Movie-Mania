from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

"""
    Custom permission classes for the movie mania APIs
"""


class IsAdmin(permissions.BasePermission):
    message = 'Non Admins do not have the access'
    """
        Permission class which gives access to admin only
    """
    def has_permission(self, request, view):
        user = get_object_or_404(User, pk=request.user.id)

        return True if user.is_superuser else False


class IsStaffMember(permissions.BasePermission):
    message = 'Non staff members do not have the access'
    """
        Permission class which gives access to staff members only
    """
    def has_permission(self, request, view):
        user = get_object_or_404(User, pk=request.user.id)

        return user.is_superuser or user.groups.filter(name='staff').exists()