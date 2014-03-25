from django.contrib import admin

# Register your models here.
from item.models import Type, Item

admin.site.register(Item)
admin.site.register(Type)