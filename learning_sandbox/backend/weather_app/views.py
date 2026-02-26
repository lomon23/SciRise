from django.shortcuts import render
import requests
from django.http import JsonResponse

def get_condition_string(weathercode):
    if weathercode == 0:
        return "Sunny"
    elif 1 <= weathercode <= 3:
        return "Cloudy"
    elif 45 <= weathercode <= 48:
        return "Foggy"
    elif 51 <= weathercode <= 67 or 80 <= weathercode <= 82:
        return "Rainy"
    elif 71 <= weathercode <= 77 or 85 <= weathercode <= 86:
        return "Snowy"
    elif 95 <= weathercode <= 99:
        return "Stormy"
    return "Unknown"

def get_weather(request):
    city = request.GET.get('city')
    
    if not city:
        return JsonResponse({"error": "Будь ласка, вкажіть місто (наприклад: ?city=Kyiv)"}, status=400)

    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}"
    geo_response = requests.get(geo_url).json()

    if not geo_response.get('results'):
        return JsonResponse({"error": "Місто не знайдено"}, status=404)

    location = geo_response['results'][0]
    latitude = location['latitude']
    longitude = location['longitude']
    city_name = location['name']

    weather_url = "https://api.open-meteo.com/v1/forecast"
    weather_params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,weather_code",
        "hourly": "temperature_2m",
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        "timezone": "auto"
    }
    
    response = requests.get(weather_url, params=weather_params).json()

    current_data = response.get('current', {})
    daily_data = response.get('daily', {})
    
    temp = current_data.get('temperature_2m', 0.0)
    humidity = current_data.get('relative_humidity_2m', 0)
    current_condition_code = current_data.get('weather_code', -1)
    
    precipitation_chance = 0
    if 'precipitation_probability_max' in daily_data:
        precipitation_chance = daily_data['precipitation_probability_max'][0]

    advices = []
    if temp < 10:
        advices.append("Одягни теплу куртку.")
    if precipitation_chance > 50:
        advices.append("Візьми парасольку.")
    
    advice_str = " ".join(advices) if advices else "Погода чудова, гарного дня!"

    hourly_response = response.get('hourly', {})
    hourly_list = []
    if 'time' in hourly_response and 'temperature_2m' in hourly_response:
        for i in range(24):
            raw_time = hourly_response['time'][i]
            formatted_time = raw_time[-5:] 
            hourly_list.append({
                "time": formatted_time,
                "temp": float(hourly_response['temperature_2m'][i])
            })

    daily_list = []
    if 'time' in daily_data:
        for i in range(len(daily_data['time'])):
            daily_list.append({
                "date": daily_data['time'][i],
                "temp_max": float(daily_data['temperature_2m_max'][i]),
                "temp_min": float(daily_data['temperature_2m_min'][i]),
                "condition": get_condition_string(daily_data['weather_code'][i])
            })

    final_response = {
        "city": city_name,
        "current": {
            "temp": float(temp),
            "humidity": int(humidity),
            "precipitation_chance": int(precipitation_chance),
            "condition": get_condition_string(current_condition_code),
            "advice": advice_str
        },
        "hourly": hourly_list,
        "daily": daily_list
    }

    return JsonResponse(final_response)     