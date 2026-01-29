
import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

with connection.cursor() as cursor:
    print("--- actividad ---")
    cursor.execute("DESCRIBE actividad")
    for col in cursor.fetchall():
        print(col)
    
    print("\n--- proyecto ---")
    cursor.execute("DESCRIBE proyecto")
    for col in cursor.fetchall():
        print(col)
