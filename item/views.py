from django.shortcuts import render
from django.http import Http404, HttpResponse, JsonResponse
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

def items(request, type_id):
    if request.method=='GET':
        t = Type.objects.get( id = type_id )
        items = Item.objects.filter( type=t )
        items_arr = []
        for item in items:
            item_dic = {
                'id' : item.id,
                'name' : item.name,
                'price' : item.price,
                'attr' : item.attr,
                'image' : item.image.url,
            }
            items_arr.append(item_dic)

        return JsonResponse(items_arr, safe=False)
    
    return HttpResponse("error")


def types(request):
    if request.method=='GET':
    
        types = Type.objects.all()
        types_arr = []
        for t in types:
            t_dic = {
                'id' : t.id,
                'name' : t.name
            }
            types_arr.append(t_dic)

        return JsonResponse(types_arr, safe=False)
    
    return HttpResponse("error")