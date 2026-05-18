from rest_framework import serializers
from .models import CustomUser, Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    # Додаємо поля, які підуть в Profile
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, default='student')
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'first_name', 'last_name', 'role']

    def create(self, validated_data):
        # 1. Витягуємо дані для профілю
        profile_data = {
            'first_name': validated_data.pop('first_name', ''),
            'last_name': validated_data.pop('last_name', ''),
            'role': validated_data.pop('role', 'student'),
        }
        password = validated_data.pop('password')

        # 2. Створюємо юзера
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=password
        )

        # 3. Створюємо профіль ЯВНО (використовуємо get_or_create про всяк випадок)
        Profile.objects.create(user=user, **profile_data)

        return user
    


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Додаємо дані профілю у відповідь
        data['user'] = {
            'email': self.user.email,
            'role': self.user.profile.role,
            'first_name': self.user.profile.first_name,
            'last_name': self.user.profile.last_name,
        }
        return data