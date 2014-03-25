from django.shortcuts import render
from django.http import Http404, HttpResponse
from item.models import Type, Item
import json
# Create your views here.
def item(request):
    res = []
    
    item = Item.objects.all()
    
    id      = item[0].id
    name    = item[0].name
    price   = str(item[0].price)
    attr    = item[0].attr
    image   = str(item[0].image)
    
    res.append({'id'    :id, 
                'name'  :name,
                'price' :price,
                'attr'  :attr,
                'image' :image})
    
    print json.dumps(res)
    
    return HttpResponse(json.dumps(res))