
import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

with connection.cursor() as cursor:
    print("Migrating 'actividad' table schema...")
    cursor.execute("""
        ALTER TABLE actividad 
        MODIFY COLUMN estado enum('PLANEADO', 'EN_EJECUCION', 'FINALIZADO', 'SUSPENDIDO') 
        NOT NULL DEFAULT 'PLANEADO'
    """)
    print("Alter Table successful.")

    print("\nVerifying new schema:")
    cursor.execute("DESCRIBE actividad")
    for col in cursor.fetchall():
        if col[0] == 'estado':
            print(col)
