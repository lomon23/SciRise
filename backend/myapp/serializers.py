from rest_framework import serializers
from .models import (
    CustomUser, Profile, 
    Course, Module, Lesson, 
    Group, GroupMember, Channel, Message, BoardWidget
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# ==========================================
# AUTH & PROFILE
# ==========================================

class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES, default='student')
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'first_name', 'last_name', 'role']

    def create(self, validated_data):
        profile_data = {
            'first_name': validated_data.pop('first_name', ''),
            'last_name': validated_data.pop('last_name', ''),
            'role': validated_data.pop('role', 'student'),
        }
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(email=validated_data['email'], password=password)
        Profile.objects.create(user=user, **profile_data)
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'email': self.user.email,
            'role': self.user.profile.role,
            'first_name': self.user.profile.first_name,
        }
        return data

# ==========================================
# COURSES (Markdown based)
# ==========================================

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'lesson_type', 'order']

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'title', 'order', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    owner_name = serializers.CharField(source='owner.profile.first_name', read_only=True)
    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = Course
        # Додали owner_email сюди:
        fields = ['id', 'title', 'description', 'owner_name', 'owner_email', 'modules', 'created_at']

# ==========================================
# WORKSPACE
# ==========================================

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['id', 'name', 'channel_type']

# Міні-версія курсу чисто для кнопок у сайдбарі
class CourseMiniSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source='owner.email', read_only=True) # ДОДАЄМО owner_email
    class Meta:
        model = Course
        fields = ['id', 'title', 'owner_email']

class GroupSerializer(serializers.ModelSerializer):
    channels = ChannelSerializer(many=True, read_only=True)
    courses = CourseMiniSerializer(many=True, read_only=True) # Додаємо курси
    
    class Meta:
        model = Group
        # Не забуваємо додати 'courses' у fields
        fields = ['id', 'name', 'channels', 'courses', 'created_at'] 

class MessageSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'author_name', 'text', 'created_at']

    def get_author_name(self, obj):
        return f"{obj.author.profile.first_name}".strip() or obj.author.email
    
class BoardWidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardWidget
        fields = '__all__'
        read_only_fields = ['group']