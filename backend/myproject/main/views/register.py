from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
import json

User = get_user_model()
@csrf_exempt # тимчасово, поки не налаштований CSRF на фронті
def register_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        username = data.get('username')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')


        if not all([username, email, password]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )

        return JsonResponse({'message': 'User created successfully', 'user_id': user.id})
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)
