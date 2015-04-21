from django.contrib import admin

# Register your models here.
from item.models import Type, Item

class ItemInline(admin.StackedInline):
    model = Item

class TypeAdmin(admin.ModelAdmin):
    inlines = [ItemInline]

    
admin.site.register(Item)
admin.site.register(Type, TypeAdmin)