from django.conf.urls import patterns, include, url
import settings
import os

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'PingHsu.views.home', name='home'),
    # url(r'^PingHsu/', include('PingHsu.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
 
    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^fonts/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_PATH, 'static/fonts')}),
    url(r'^css/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_PATH, 'static/css')}),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_PATH, 'media/media')}),
    url(r'^js/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_PATH, 'static/js')}),
    url(r'^img/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_PATH, 'static/img')}),
    url(r'^flash/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.PROJECT_PATH, 'static/flash')}),
    
    url(r'^item/', include('item.urls')),
    url(r'^account/', include('account.urls')),
    
    url(r'^crossdomain.xml$',
    'flashpolicies.views.simple',
    {'domains': ['http://127.0.0.1/']}),
    url(r'^$', 'LegoCheckoutSystem.views.index'),
)
