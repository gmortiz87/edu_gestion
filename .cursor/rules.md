# Reglas EDU_GESTION (NO REPROCESAR)

## Fuente de verdad
- El esquema MySQL 8+ ya existe y es definitivo.
- NO generar SQL alternativo ni modificar tablas sin instrucción explícita.
- NO ejecutar makemigrations/migrate para crear tablas (tablas ya existen).
- Los modelos Django deben usar: managed = False y db_table.

## Dependencias
- Usar requirements.txt con versiones fijas.
- NO reinstalar paquetes si ya están instalados en .venv.
- NO cambiar versión de Django/DRF sin pedir confirmación.

## Arquitectura
- Usar Clean Architecture / Layered compatible con Django.
- Separar: domain / application(use_cases) / infrastructure(django, orm, api).

## Base de datos
- Motor: MySQL 8
- Schema: edu_gestion

## Entregables
- API REST /api/v1
- Tests con pytest (mínimo 80% backend)
- README completo
