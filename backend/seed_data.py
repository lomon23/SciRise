import os
import django
import random
from faker import Faker

# Налаштування середовища Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings') # ЗАМІНИ НА СВІЙ ПРОЄКТ
django.setup()

from myapp.models import Course, Module, Lesson # ЗАМІНИ НА СВІЙ APP

fake = Faker(['uk_UA', 'en_US'])

def seed():
    # 1. Очистка (необов'язково, але корисно для тестів)
    print("🧹 Очищення старих даних...")
    Course.objects.all().delete()

    print("🚀 Генерація даних...")
    
    # 2. Створюємо 5 публічних курсів
    for _ in range(5):
        course = Course.objects.create(
            title=fake.catch_phrase().capitalize(),
            description=fake.paragraph(nb_sentences=3),
            is_public=True
        )
        
        # 3. Додаємо 3 модулі до кожного курсу
        for m_idx in range(3):
            module = Module.objects.create(
                title=f"Модуль {m_idx + 1}: {fake.bs().capitalize()}",
                course=course
            )
            
            # 4. Додаємо 5 уроків до кожного модуля
            for l_idx in range(5):
                Lesson.objects.create(
                    title=f"Урок {l_idx + 1}: {fake.word().capitalize()}",
                    content=fake.markdown(),
                    module=module
                )
    
    print("✅ Базу успішно заповнено!")

if __name__ == '__main__':
    seed()