from django.shortcuts import render
from django import views
from geopulse.settings import JSON_BASE_DIR 
from django.http import HttpResponse, JsonResponse
import json
import os
import logging


logger = logging.getLogger(__name__)


class IndexPage(views.View):
    def get(self,request):
        try:
            districts = get_district_village_list()
            template_name = 'map/index.html'
            context ={'districts':districts}
            return render(request,template_name,context )
        except Exception as error:
            logger.error('Error Occured: %s', error)
            return HttpResponse('Error in processing your request', status=500)
        
class GetVillageData(views.View):
    def get(self,request,district):
        try:
            if district:
                districts = get_district_village_list()
                villages = districts.get(district,[])
                return JsonResponse(list(villages), safe=False)
            return JsonResponse([], safe=False)
        except Exception as error:
            logger.error('Error Occured: %s', error)
            return HttpResponse('Error in processing your request', status=500)
            
            

class GetGeoLocation(views.View):
    def get(self,request,village_name):
        try:
            with open(os.path.join(JSON_BASE_DIR,'map','Pune_prj_1.geojson'), 'r') as file:
                data = json.load(file)
                village_features = [feature for feature in data['features'] if feature['properties']['Village'] == village_name]
                if village_features:
                    response_data = {
                        'type': 'FeatureCollection',
                        'features': village_features
                    }
                    return JsonResponse(response_data)
                else:
                    return JsonResponse({'error': 'Village not found'}, status=404)
        except Exception as error:
            logger.error('Error Occured: %s', error)
            return HttpResponse('Error in processing your request', status=500)
        
        
def get_district_village_list():
    with open(os.path.join(JSON_BASE_DIR,'map','Pune_prj_1.geojson'), 'r') as file:
        data = json.load(file)
        features = data['features']
        districts = {}
        for feature in features:
            district = feature['properties']['District']
            village = feature['properties']['Village']
            if district in districts:
                districts[district].append(village)
            else:
                districts[district] = [village]
        return districts
       
