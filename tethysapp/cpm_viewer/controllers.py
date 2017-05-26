from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'cpm_viewer/home.html', context)

def points(request):
    file_path = '/home/jacobbf1/tethysdev/tethysapp-cpm_viewer/tethysapp/cpm_viewer/public/images/RMS_GIS_wt.txt'

    point_file = []

    with open(file_path, 'r') as a_file:
        for row in a_file:
            point_file.append(row.split(','))

    return JsonResponse({
        'success':'Load Successfull!',
        'session':point_file,
    })