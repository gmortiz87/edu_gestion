Contexto final del proyecto (negocio + solución)

La Secretaría de Educación requiere una plataforma web para registrar, consolidar y auditar la ejecución de proyectos asociados a una línea estratégica por vigencia (ej. POAI 2025), permitiendo controlar:

    La planeación y ejecución financiera de cada proyecto (apropiación, adición, ejecutado, % ejecución).
    La gestión operativa mediante actividades, con su avance y evidencias.
    La trazabilidad de beneficiarios reales (Instituciones Educativas) beneficiadas por una o varias actividades.
    El manejo de un dato oficial/histórico de beneficiarios por proyecto (migrado u oficial) que puede no depender de actividades.
    El seguimiento de metas y sus indicadores de gestión, con valores por fecha de corte.

La plataforma busca reemplazar el seguimiento disperso en hojas de cálculo, habilitando un módulo de diligenciamiento donde el Responsable del proyecto y el Apoyo técnico registran avances, beneficiarios y evidencias, mientras un Administrador gestiona catálogos y control de acceso.

Alcance funcional (qué resuelve)

1) Estructura de planeación
    Registrar líneas estratégicas y asociarlas a una vigencia (línea_vigencia).
    Registrar municipios e instituciones educativas (IE) con código DANE MEN.

2) Gestión de proyectos
Cada proyecto queda asociado a:
    Línea+vigencia (ej. POAI 2025).
    Un Responsable y un Apoyo técnico (roles).
    Datos administrativos/financieros: BPIN, PI, apropiación, adición, recursos, % avance de cargue, estado.
    Además, un proyecto puede aportar a múltiples metas (proyecto_meta).

3) Gestión operativa por actividades
    Cada proyecto se ejecuta mediante actividades, que incluyen:
    Estado, fechas, componente PAM, actor dirigido.
    Total ejecutado (por actividad).
    Beneficiarios reportados (si aplica).
    Dotación (SI/NO) y descripción.
    Se registran avances por actividad (porcentaje y corte), y evidencias por actividad (archivo o enlace).

4) Beneficiarios: 2 niveles (real vs oficial)

    Para resolver el dilema “beneficiarios por proyecto vs por actividad”, el modelo soporta ambas realidades:
    A.  Beneficio real (operativo) por actividad + IE
        Permite ver qué IE fue beneficiada por qué actividad y en qué fecha.
        Permite capturar el detalle de beneficiarios (directivos, docentes, estudiantes, etc.).
        Permite registrar asistencia técnica/dotación y descripción.
        Permite evidencias por beneficio (archivo/enlace).

    B.  Beneficio oficial/histórico por proyecto
        Tabla separada para el dato “oficial o migrado” por proyecto y fecha de reporte.
        No depende de actividades y sirve para comparativos o trazabilidad de migración.

5) Indicadores de gestión (por meta)

    Cada meta puede tener indicadores de gestión (definición y periodicidad).
    Los indicadores tienen valores por fecha de corte (serie temporal).
    Esto permite medir “cumplimiento” sin forzar una relación directa rígida “proyecto cumple meta”, sino soportando análisis con valores e interpretación.

Cómo se valida (consulta todo-en-uno)

    La consulta final “TODO-EN-UNO” permite validar, en una sola salida, la relación completa:
    Línea → Vigencia → Proyecto (responsables + finanzas derivadas) → Actividades → Avances → IE beneficiadas → Evidencias → Último valor del indicador.

    Con eso se confirma que:

    Un proyecto puede tener varias actividades.
    Una actividad puede beneficiar una o varias IE.
    Una IE puede ser beneficiada múltiples veces (fechas/actividades).
    Se puede contrastar el beneficio real vs el beneficio oficial por proyecto.
    La ejecución financiera del proyecto se puede calcular desde actividades (vista).

Roles y diligenciamiento

    ADMIN: configura catálogos (líneas, vigencias, municipios, IE, metas, indicadores), administra usuarios y reglas.
    RESPONSABLE_PROYECTO: gestiona proyectos/actividades, registra avances clave, valida evidencia.
    APOYO_TECNICO: carga avances, beneficiarios, evidencias operativas y soportes.
    (Opcional) EDITOR/LECTOR: edición limitada o consulta.