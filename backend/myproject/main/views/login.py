from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.models import User
import json

@csrf_exempt
def login_api(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            identifier = data.get('identifier')  # username або email
            password = data.get('password')

            if not identifier or not password:
                return JsonResponse({'error': 'Required fields missing'}, status=400)

            # шукаємо користувача по username або email
            try:
                if '@' in identifier:
                    user = User.objects.get(email=identifier)
                    username = user.username
                else:
                    username = identifier
            except User.DoesNotExist:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)  # ставимо сесію
                return JsonResponse({'message': 'Login successful'})
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)

        return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
