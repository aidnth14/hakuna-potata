import time
import socket
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# In-memory click / cheer counter
POTATA_DATA = {
    "name": "Hakuna Potata",
    "tagline": "It means no worries for the rest of your fries! 🍟🥔",
    "cheers": 42,
    "rotation_angle": 15,
    "fun_facts": [
        "Potatoes were the first vegetable to be grown in space (aboard Space Shuttle Columbia in 1995).",
        "The word 'Hakuna' means 'there is no' in Swahili, and 'Potata' means unlimited joy!",
        "Potatoes are 80% water and 20% pure wonder.",
        "There are over 4,000 edible varieties of potatoes in the world.",
        "A single potato can generate enough electricity to power a digital clock for 40 days."
    ]
}

def potata_info(request):
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
    except Exception:
        local_ip = "127.0.0.1"

    return JsonResponse({
        "status": "success",
        "title": "HAKUNA POTATA",
        "tagline": POTATA_DATA["tagline"],
        "cheers": POTATA_DATA["cheers"],
        "facts": POTATA_DATA["fun_facts"],
        "server_time": time.strftime("%Y-%m-%d %H:%M:%S"),
        "local_ip": local_ip,
        "backend": "Django 6.1.1 (Python 3.14)",
        "icon_info": {
            "rotation": "Slightly rotated to the right (15deg)",
            "color": "White (#FFFFFF)"
        }
    })

@csrf_exempt
def cheer_potata(request):
    if request.method in ["POST", "GET"]:
        POTATA_DATA["cheers"] += 1
        return JsonResponse({
            "status": "success",
            "message": "Potato cheered! 🥔✨",
            "cheers": POTATA_DATA["cheers"]
        })
    return JsonResponse({"error": "Method not allowed"}, status=405)

def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "service": "Hakuna Potata Django Backend",
        "version": "1.0.0"
    })
