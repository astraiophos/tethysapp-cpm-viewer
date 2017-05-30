from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import os

@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'cpm_viewer/home.html', context)

def points(request):
    path = '/home/jacobbf1/tethysdev/tethysapp-cpm_viewer/tethysapp/cpm_viewer/well_data'
    filepath = []

    # Files to be read
    files = ['obs_heads_wt.txt','Sim_heads_845.txt','Sim_heads_nopp.txt','Sim_heads_unc.txt','Sim_heads_v834.txt']

    obs_data = []
    sim_845_data = []
    sim_nopp_data = []
    sim_unc_data = []
    sim_834_data = []

    for file in files:
        temp = os.path.join(path,file)
        filepath.append(temp)

    with open(filepath[0], 'r') as a_file:
        for row in a_file:
            obs_data.append(row.split(','))

    with open(filepath[0], 'r') as a_file:
        for row in a_file:
            sim_845_data.append(row.split(','))

    with open(filepath[0], 'r') as a_file:
        for row in a_file:
            sim_nopp_data.append(row.split(','))

    with open(filepath[0], 'r') as a_file:
        for row in a_file:
            sim_unc_data.append(row.split(','))

    with open(filepath[0], 'r') as a_file:
        for row in a_file:
            sim_834_data.append(row.split(','))

    # Format the data into dictionaries, removing unnecessary lines and characters
    # Removes first and last lines of list, thanks to @MxDbld on stackoverflow.com
    obs_data = obs_data[2:-2]
    sim_845_data = sim_845_data[2:-2]
    sim_nopp_data = sim_nopp_data[2:-2]
    sim_unc_data = sim_unc_data[2:-2]
    sim_834_data = sim_834_data[2:-2]

    # Credits go to @mac on stackoverflow.com
    obs_data = [[w.replace('\n', '') for w in line] for line in obs_data]
    sim_845_data = [[w.replace('\n', '') for w in line] for line in sim_845_data]
    sim_nopp_data = [[w.replace('\n', '') for w in line] for line in sim_nopp_data]
    sim_unc_data = [[w.replace('\n', '') for w in line] for line in sim_unc_data]
    sim_834_data = [[w.replace('\n', '') for w in line] for line in sim_834_data]

    temp_data = {}

    for line in obs_data:
        if line[0] in temp_data:
            temp_data[line[0]].append({'time':line[1],'val':line[2]})
        else:
            temp_data[line[0]] = {}
            temp_data[line[0]].append({'time': line[1], 'val': line[2]})

    return JsonResponse({
        'success':'Load Successfull!',
        'OBS':obs_data,
        'S845':sim_845_data,
        'SNPP':sim_nopp_data,
        'SUNC':sim_unc_data,
        'S834':sim_834_data,
    })