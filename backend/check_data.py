
import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

with connection.cursor() as cursor:
    cursor.execute("SELECT estado, COUNT(*) FROM actividad GROUP BY estado")
    results = cursor.fetchall()
    print("Pre-migration states in 'actividad':")
    for row in results:
        print(row)
