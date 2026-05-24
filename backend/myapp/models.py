from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver

# ==========================================
# AUTH
# ==========================================
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email: raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

class Profile(models.Model):
    # Виносимо це окремо, щоб було доступно як Profile.ROLE_CHOICES
    ROLE_CHOICES = [('tutor', 'Tutor'), ('student', 'Student')] 

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.email} - {self.role}"

# ==========================================
# COURSES (Markdown based)
# ==========================================
class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_courses')
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    content = models.TextField()  # Markdown контент
    lesson_type = models.CharField(max_length=20, default='THEORY') # THEORY, QUIZ
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

# ==========================================
# WORKSPACE
# ==========================================
class Group(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_groups')
    courses = models.ManyToManyField(Course, blank=True, related_name='groups')
    created_at = models.DateTimeField(auto_now_add=True)

class GroupMember(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(max_length=10, choices=[('ADMIN', 'Admin'), ('MEMBER', 'Member')], default='MEMBER')

    class Meta:
        unique_together = ('user', 'group')

class Channel(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='channels')
    name = models.CharField(max_length=100)
    channel_type = models.CharField(max_length=10, choices=[('TEXT', 'Text'), ('VOICE', 'Voice')], default='TEXT')

class Message(models.Model):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

@receiver(post_save, sender=Group)
def create_default_channels(sender, instance, created, **kwargs):
    if created:
        Channel.objects.create(group=instance, name="Загальний чат", channel_type='TEXT')
        Channel.objects.create(group=instance, name="Голосовий", channel_type='VOICE')