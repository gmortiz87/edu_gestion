# EDU_GESTION (Backend API - Django + DRF)

Plataforma para registrar, consolidar y auditar la ejecución de proyectos educativos asociados a una línea estratégica por vigencia (ej. POAI 2025).

## Arquitectura y Mapeo de Datos

El sistema utiliza **Django** con el parámetro `managed=False` en todos los modelos para actuar como una capa de servicio sobre una base de datos MySQL 8+ existente. La fuente de verdad absoluta es el DDL definido en `db/schema.sql`.

### Apps del Sistema
- **core**: Catálogos base (Vigencia, Líneas Estratégicas, Usuarios, Municipios, IEs).
- **proyectos**: Gestión de proyectos, actividades, avances y relación con metas.
- **indicadores**: Metas, indicadores de gestión y sus valores temporales.
- **beneficiarios**: (Fase posterior) Registro de impacto real en instituciones.

## Relación Proyecto ↔ Meta

El sistema implementa una relación muchos-a-muchos explícita mediante la tabla `proyecto_meta`. En Django, este modelo se define sin clave primaria autoincremental propia para alinearse estrictamente con la lógica de negocio técnica de la tabla puente.

## Endpoints Disponibles (`/api/`)

| Endpoint | Descripción | Filtros Disponibles |
| :--- | :--- | :--- |
| `proyectos/` | Lista de proyectos y su estado | `linea_vigencia`, `estado`, `responsable`, `apoyo_tecnico` |
| `actividades/` | Actividades operativas | `proyecto`, `estado` |
| `avances-actividad/` | Avances registrados por actividad | N/A |
| `proyectos-metas/` | Relación estratégica Proyecto-Meta | `proyecto`, `meta` |
| `metas/` | Definición de metas del plan | `activo` |
| `indicadores/` | Indicadores de gestión | `meta`, `activo` |
| `indicadores-valores/` | Valores por fecha de corte | `indicador`, `fecha_corte` (exacto, gte, lte) |

## Notas Técnicas

- **Fisgoneo de Performance**: Todos los ViewSets están optimizados con `select_related` y `prefetch_related` para evitar problemas de consultas N+1.
- **Modo Lectura**: La API está configurada actualmente en modo `ReadOnlyModelViewSet`.
- **PK Compuesta en ProyectoMeta**: Django simula el acceso a esta tabla puente asegurando la unicidad del par (proyecto, meta).

## Roadmap
1. Implementación de Módulo de Beneficiarios.
2. Activación de Autenticación JWT.
3. Permisos granulares por rol (Admin, Responsable, Apoyo Técnico).
4. Auditoría de cambios (Trigger/Django-simple-history).
