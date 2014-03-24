from django.contrib import admin

# Register your models here.
from account.models import Account, Item

admin.site.register(Account)
admin.site.register(Item)