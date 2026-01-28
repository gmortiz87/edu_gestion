CONTEXTO GENERAL DEL PROYECTO (NEGOCIO + SOLUCIÓN)

La Secretaría de Educación requiere una plataforma web para registrar, consolidar y auditar la ejecución de proyectos asociados a una línea estratégica por vigencia (ej. POAI 2025).

El sistema debe reemplazar el seguimiento disperso en hojas de cálculo y permitir un control integral y trazable de:
- Planeación y ejecución financiera de proyectos (apropiación, adición, ejecutado, % ejecución).
- Gestión operativa mediante actividades, con avances y evidencias.
- Trazabilidad de beneficiarios reales (Instituciones Educativas) beneficiadas por actividades.
- Manejo de un dato oficial/histórico de beneficiarios por proyecto, que no depende de actividades.
- Seguimiento de metas e indicadores de gestión, con valores por fecha de corte.

La plataforma habilita un módulo de diligenciamiento donde el Responsable del proyecto y el Apoyo técnico registran avances, beneficiarios y evidencias, mientras un Administrador gestiona catálogos y control de acceso.

----------------------------------------------------------------
RELACIÓN META ↔ PROYECTO (CONCEPTO CLAVE)
----------------------------------------------------------------

El sistema implementa una relación explícita entre proyectos y metas mediante una tabla puente `proyecto_meta`.

- La relación es de tipo muchos-a-muchos:
  - Un proyecto puede aportar a una o varias metas.
  - Una meta puede ser impactada por múltiples proyectos.

- Esta relación es ESTRATÉGICA, no operativa.
  - No implica que un proyecto “cumpla” una meta de forma directa.
  - No reemplaza los indicadores de gestión.

- La tabla `proyecto_meta` permite:
  - Declarar explícitamente el aporte de un proyecto a una meta.
  - Registrar valores planeados y logrados por proyecto–meta.
  - Registrar observaciones cualitativas.
  - Soportar trazabilidad, análisis y auditoría.

- Regla conceptual clave:
  La meta NO depende del proyecto.
  El proyecto se ASOCIA a la meta.
  Por eso:
  - `meta` no tiene FK a proyecto.
  - `proyecto` no tiene FK directa a meta.
  - La relación existe únicamente en la tabla puente `proyecto_meta`.

- Los indicadores de gestión son independientes:
  - Las metas se miden mediante indicadores con valores por fecha de corte.
  - Los indicadores pueden reflejar el impacto agregado de varios proyectos.
  - La relación proyecto–meta no sustituye ni duplica los indicadores.

----------------------------------------------------------------
REGLAS TÉCNICAS GENERALES
----------------------------------------------------------------

- Base de datos MySQL 8+ es la fuente de verdad.
- Los modelos Django usan managed=False.
- NO se crean migraciones.
- db_table y db_column deben coincidir EXACTAMENTE con el DDL.
- Todos los endpoints son ReadOnlyModelViewSet (fase actual).
- Optimizar consultas evitando N+1 (select_related / prefetch_related).
- Usar django-filter para filtros básicos.

----------------------------------------------------------------
TAREA A — MODELOS (ALINEACIÓN 1:1 CON DDL)
----------------------------------------------------------------

A1) core/models.py
- Modelar:
  - Vigencia (id_vigencia INT PK, NO autoincrement)
  - LineaEstrategica
  - LineaVigencia (FK a LineaEstrategica y Vigencia)
  - Usuario
  - Municipio (id_municipio INT PK)
  - InstitucionEducativa (FK a Municipio)
- Todos con managed=False y db_table exacto.

A2) proyectos/models.py
- Proyecto:
  - FK linea_vigencia -> core.LineaVigencia (db_column=id_linea_vigencia)
  - FK responsable -> core.Usuario (db_column=responsable_id)
  - FK apoyo_tecnico -> core.Usuario (db_column=apoyo_tecnico_id)

- Actividad:
  - FK proyecto -> Proyecto (db_column=id_proyecto)

- AvanceActividad:
  - FK actividad -> Actividad (db_column=id_actividad)
  - FK registrado_por -> core.Usuario (db_column=registrado_por)

- ProyectoMeta (CRÍTICO):
  - Mapear EXACTO a la tabla proyecto_meta real.
  - NO crear id autoincrement.
  - NO incluir campo activo.
  - PK compuesta (id_proyecto, id_meta).
  - Columnas:
    * id_proyecto (FK a Proyecto, primary_key=True)
    * id_meta (FK a indicadores.Meta, primary_key=True)
    * valor_planeado
    * valor_logrado
    * observacion VARCHAR(600)
  - En Django:
    * id = None
    * unique_together = (("proyecto","meta"),)
    * managed=False, db_table="proyecto_meta"

A3) indicadores/models.py
- Crear modelo Meta según DDL (id_meta, codigo, nombre, descripcion, activo, creado_en).
- IndicadorGestion:
  - FK meta -> Meta (db_column=id_meta)
- IndicadorGestionValor:
  - FK indicador -> IndicadorGestion (db_column=id_indicador)
  - FK registrado_por -> core.Usuario (db_column=registrado_por)
  - Unique(indicador, fecha_corte)

----------------------------------------------------------------
TAREA B — SERIALIZERS
----------------------------------------------------------------

- Eliminar SerializerMethodField que hagan queries manuales.
- Usar relaciones FK directamente.
- Crear serializers para:
  - Meta
  - ProyectoMeta
- ProyectoSerializer:
  - Exponer linea_vigencia (linea + vigencia).
  - Incluir campo read-only:
    * metas: lista de relaciones proyecto_meta (meta + valores + observación).

----------------------------------------------------------------
TAREA C — VIEWSETS Y PERFORMANCE
----------------------------------------------------------------

- Todos los ViewSets son ReadOnlyModelViewSet.
- Optimización obligatoria:
  - ProyectoViewSet:
    select_related("linea_vigencia__linea","linea_vigencia__vigencia","responsable","apoyo_tecnico")
    prefetch_related("metas_rel","metas_rel__meta")
  - ActividadViewSet:
    select_related("proyecto")
  - AvanceActividadViewSet:
    select_related("actividad","registrado_por")
  - IndicadorGestion:
    select_related("meta")
  - IndicadorGestionValor:
    select_related("indicador","registrado_por")

- Filtros mínimos:
  - proyectos: linea_vigencia, estado, responsable, apoyo_tecnico
  - actividades: proyecto, estado
  - proyectos-metas: proyecto, meta
  - indicadores: meta, activo
  - valores indicador: indicador, rango de fecha_corte

----------------------------------------------------------------
TAREA D — ROUTER / URLS
----------------------------------------------------------------

- Registrar endpoints:
  - /api/proyectos/
  - /api/actividades/
  - /api/avances-actividad/
  - /api/proyectos-metas/
  - /api/metas/
  - /api/indicadores/
  - /api/indicadores-valores/

----------------------------------------------------------------
TAREA E — README.md (OBLIGATORIO)
----------------------------------------------------------------

- Generar o actualizar README.md al final de la ejecución.
- El README debe documentar:
  - Descripción del sistema.
  - Arquitectura y apps (core, proyectos, indicadores, beneficiarios).
  - Modelo de datos a alto nivel (incluyendo relación Proyecto ↔ Meta).
  - Endpoints disponibles.
  - Ejemplos de uso.
  - Notas técnicas:
    * managed=False
    * PK compuesta en proyecto_meta
    * optimización de consultas
  - Roadmap (autenticación, permisos, escritura).

----------------------------------------------------------------
ENTREGABLE FINAL
----------------------------------------------------------------

- Código alineado 100% con el DDL.
- Relación Proyecto ↔ Meta correctamente implementada y documentada.
- API funcional en modo lectura.
- README.md actualizado reflejando la implementación real.
