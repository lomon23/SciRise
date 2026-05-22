from rest_framework import serializers
from .models import (
    CustomUser, Profile, 
    Course, CourseModule, Lesson, 
    Group, GroupMember, Channel, Message
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

        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=password
        )

        Profile.objects.create(user=user, **profile_data)
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'email': self.user.email,
            'role': self.user.profile.role,
            'first_name': self.user.profile.first_name,
            'last_name': self.user.profile.last_name,
        }
        return data


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'bio']


# ==========================================
# COURSES (Лекції та контент)
# ==========================================

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'video_url', 'order']


class CourseModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = CourseModule
        fields = ['id', 'title', 'order', 'lessons']


class CourseSerializer(serializers.ModelSerializer):
    # Тягнемо модулі і лекції одразу
    modules = CourseModuleSerializer(many=True, read_only=True)
    owner_name = serializers.CharField(source='owner.profile.first_name', read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'owner', 'owner_name', 'is_public', 'is_paid', 'price', 'created_at', 'modules']
        read_only_fields = ['owner']


# ==========================================
# WORKSPACE (Групи, Канали, Чати)
# ==========================================

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['id', 'name', 'channel_type', 'group', 'created_at']
        read_only_fields = ['group']


class GroupSerializer(serializers.ModelSerializer):
    # МАГІЯ ТУТ: Група одразу віддає свої канали і прикріплені курси
    channels = ChannelSerializer(many=True, read_only=True)
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'owner', 'channels', 'courses', 'created_at']
        read_only_fields = ['owner']


class MessageSerializer(serializers.ModelSerializer):
    # Щоб на фронті було що писати над повідомленням
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'channel', 'author', 'author_name', 'text', 'created_at']
        read_only_fields = ['author', 'channel']

    def get_author_name(self, obj):
        profile = getattr(obj.author, 'profile', None)
        if profile and profile.first_name:
            return f"{profile.first_name} {profile.last_name}".strip()
        return obj.author.email