
-- =========================================================
-- EDU_GESTION - SQL FINAL ÚNICO (MySQL 8+)
-- Incluye: Beneficio por actividad+IE con detalle + evidencias
-- =========================================================

-- =========================
-- 0) RESET COMPLETO
-- =========================
DROP DATABASE IF EXISTS edu_gestion;

-- =========================
-- 1) CREATE DATABASE
-- =========================
CREATE DATABASE edu_gestion
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE edu_gestion;

-- =========================
-- 2) CATÁLOGOS BASE
-- =========================
CREATE TABLE vigencia (
  id_vigencia INT PRIMARY KEY,
  anio INT NOT NULL UNIQUE,
  estado ENUM('ACTIVA','CERRADA') NOT NULL DEFAULT 'ACTIVA'
) ENGINE=InnoDB;

CREATE TABLE linea_estrategica (
  id_linea BIGINT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT NULL
) ENGINE=InnoDB;

CREATE TABLE linea_vigencia (
  id_linea_vigencia BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_linea BIGINT NOT NULL,
  id_vigencia INT NOT NULL,
  estado ENUM('ACTIVA','INACTIVA') NOT NULL DEFAULT 'ACTIVA',
  UNIQUE KEY uq_linea_vigencia (id_linea, id_vigencia),
  CONSTRAINT fk_lv_linea FOREIGN KEY (id_linea) REFERENCES linea_estrategica(id_linea),
  CONSTRAINT fk_lv_vigencia FOREIGN KEY (id_vigencia) REFERENCES vigencia(id_vigencia)
) ENGINE=InnoDB;

CREATE TABLE usuario (
  id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  correo VARCHAR(200) NOT NULL UNIQUE,
  rol ENUM('ADMIN','RESPONSABLE_PROYECTO','APOYO_TECNICO','EDITOR','LECTOR') NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Municipio: solo id y nombre
CREATE TABLE municipio (
  id_municipio INT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL
) ENGINE=InnoDB;

-- IE con código DANE MEN
CREATE TABLE institucion_educativa (
  id_ie BIGINT AUTO_INCREMENT PRIMARY KEY,
  codigo_dane VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(250) NOT NULL,
  id_municipio INT NOT NULL,
  CONSTRAINT fk_ie_municipio FOREIGN KEY (id_municipio) REFERENCES municipio(id_municipio),
  KEY ix_ie_municipio (id_municipio),
  KEY ix_ie_dane (codigo_dane)
) ENGINE=InnoDB;

-- =========================
-- 3) METAS E INDICADORES
-- =========================
CREATE TABLE meta (
  id_meta BIGINT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(250) NOT NULL,
  descripcion TEXT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE indicador_gestion (
  id_indicador BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_meta BIGINT NOT NULL,

  codigo VARCHAR(40) NOT NULL,
  nombre VARCHAR(250) NOT NULL,
  definicion TEXT NULL,
  formula TEXT NULL,
  unidad VARCHAR(50) NULL,
  periodicidad ENUM('MENSUAL','TRIMESTRAL','SEMESTRAL','ANUAL') NOT NULL,
  fuente VARCHAR(200) NULL,

  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_indicador_codigo (codigo),
  CONSTRAINT fk_ind_meta FOREIGN KEY (id_meta) REFERENCES meta(id_meta),
  KEY ix_ind_meta (id_meta)
) ENGINE=InnoDB;

CREATE TABLE indicador_gestion_valor (
  id_valor BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_indicador BIGINT NOT NULL,
  fecha_corte DATE NOT NULL,
  valor DECIMAL(18,4) NOT NULL,
  observacion VARCHAR(600) NULL,
  registrado_por BIGINT NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_indicador_fecha (id_indicador, fecha_corte),

  CONSTRAINT fk_igv_ind FOREIGN KEY (id_indicador)
    REFERENCES indicador_gestion(id_indicador) ON DELETE CASCADE,
  CONSTRAINT fk_igv_user FOREIGN KEY (registrado_por)
    REFERENCES usuario(id_usuario),

  KEY ix_igv_fecha (fecha_corte)
) ENGINE=InnoDB;

-- =========================
-- 4) PROYECTOS / ACTIVIDADES
-- =========================
CREATE TABLE proyecto (
  id_proyecto BIGINT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(40) NOT NULL UNIQUE,
  nombre VARCHAR(250) NOT NULL,
  id_linea_vigencia BIGINT NOT NULL,

  responsable_id BIGINT NOT NULL,
  apoyo_tecnico_id BIGINT NOT NULL,

  codigo_bpin VARCHAR(30) NULL,
  codigo_pi VARCHAR(30) NULL,

  apropiacion_definitiva DECIMAL(18,2) NULL,
  adicion DECIMAL(18,2) NULL,

  recursos VARCHAR(80) NULL,
  avance_cargue_pct INT NULL,

  estado ENUM('PLANEADO','EN_EJECUCION','FINALIZADO','SUSPENDIDO') NOT NULL DEFAULT 'PLANEADO',
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,

  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_proy_lv FOREIGN KEY (id_linea_vigencia) REFERENCES linea_vigencia(id_linea_vigencia),
  CONSTRAINT fk_proy_resp FOREIGN KEY (responsable_id) REFERENCES usuario(id_usuario),
  CONSTRAINT fk_proy_apoyo FOREIGN KEY (apoyo_tecnico_id) REFERENCES usuario(id_usuario),
  CONSTRAINT ck_avance_cargue CHECK (avance_cargue_pct IS NULL OR (avance_cargue_pct BETWEEN 0 AND 100)),

  KEY ix_proy_lv (id_linea_vigencia),
  KEY ix_proy_resp (responsable_id),
  KEY ix_proy_apoyo (apoyo_tecnico_id),
  KEY ix_proy_bpin (codigo_bpin),
  KEY ix_proy_pi (codigo_pi)
) ENGINE=InnoDB;

CREATE TABLE proyecto_meta (
  id_proyecto BIGINT NOT NULL,
  id_meta BIGINT NOT NULL,
  valor_planeado DECIMAL(18,2) NULL,
  valor_logrado DECIMAL(18,2) NULL,
  observacion VARCHAR(600) NULL,
  PRIMARY KEY (id_proyecto, id_meta),
  CONSTRAINT fk_pm_proy FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
  CONSTRAINT fk_pm_meta FOREIGN KEY (id_meta) REFERENCES meta(id_meta),
  KEY ix_pm_meta (id_meta)
) ENGINE=InnoDB;

CREATE TABLE actividad (
  id_actividad BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_proyecto BIGINT NOT NULL,
  nombre VARCHAR(250) NOT NULL,
  descripcion TEXT NULL,

  estado ENUM('PENDIENTE','EN_EJECUCION','FINALIZADA') NOT NULL DEFAULT 'PENDIENTE',
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,

  total_ejecutado DECIMAL(18,2) NULL,
  componente_pam VARCHAR(150) NULL,
  actor_dirigido VARCHAR(200) NULL,
  numero_beneficiarios INT NULL,
  entrega_dotacion BOOLEAN NULL,
  descripcion_dotacion TEXT NULL,

  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_act_proy FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
  KEY ix_act_proy (id_proyecto),
  KEY ix_act_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE avance_actividad (
  id_avance BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_actividad BIGINT NOT NULL,
  fecha_corte DATE NOT NULL,
  porcentaje INT NOT NULL,
  descripcion TEXT NULL,
  registrado_por BIGINT NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_av_act FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE CASCADE,
  CONSTRAINT fk_av_user FOREIGN KEY (registrado_por) REFERENCES usuario(id_usuario),
  CONSTRAINT ck_porcentaje CHECK (porcentaje BETWEEN 0 AND 100),

  KEY ix_av_act_fecha (id_actividad, fecha_corte),
  KEY ix_av_registrador (registrado_por)
) ENGINE=InnoDB;

CREATE TABLE actividad_evidencia (
  id_evidencia BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_actividad BIGINT NOT NULL,

  tipo ENUM('ARCHIVO','ENLACE') NOT NULL,
  nombre VARCHAR(250) NOT NULL,
  descripcion VARCHAR(500) NULL,

  url VARCHAR(800) NULL,
  nombre_archivo VARCHAR(250) NULL,
  ruta_archivo VARCHAR(800) NULL,
  tipo_mime VARCHAR(100) NULL,
  tamanio_bytes BIGINT NULL,

  cargado_por BIGINT NOT NULL,
  fecha_carga TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_evi_act FOREIGN KEY (id_actividad)
    REFERENCES actividad(id_actividad) ON DELETE CASCADE,
  CONSTRAINT fk_evi_user FOREIGN KEY (cargado_por)
    REFERENCES usuario(id_usuario),

  CONSTRAINT ck_evidencia_tipo CHECK (
    (tipo = 'ENLACE' AND url IS NOT NULL)
    OR
    (tipo = 'ARCHIVO' AND ruta_archivo IS NOT NULL)
  ),

  KEY ix_evi_act (id_actividad),
  KEY ix_evi_tipo (tipo)
) ENGINE=InnoDB;

-- =========================
-- 5) BENEFICIARIOS
-- =========================
CREATE TABLE beneficio_actividad_ie (
  id_beneficio BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_actividad BIGINT NOT NULL,
  id_ie BIGINT NOT NULL,
  fecha_evento DATE NOT NULL,

  directivos_benef INT NULL,
  administrativos_benef INT NULL,
  docentes_benef INT NULL,
  estudiantes_benef INT NULL,
  padres_benef INT NULL,

  recibio_asistencia_tecnica BOOLEAN NULL,
  modalidad_asistencia_tecnica VARCHAR(80) NULL,

  recibio_dotacion BOOLEAN NULL,
  dotacion_recibida TEXT NULL,

  observacion VARCHAR(600) NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_beneficio_grano (id_actividad, id_ie, fecha_evento),

  CONSTRAINT fk_ben_act FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad) ON DELETE CASCADE,
  CONSTRAINT fk_ben_ie FOREIGN KEY (id_ie) REFERENCES institucion_educativa(id_ie),

  KEY ix_ben_act_fecha (id_actividad, fecha_evento),
  KEY ix_ben_ie_fecha (id_ie, fecha_evento)
) ENGINE=InnoDB;

CREATE TABLE beneficio_evidencia (
  id_evidencia BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_beneficio BIGINT NOT NULL,

  tipo ENUM('ARCHIVO','ENLACE') NOT NULL,
  nombre VARCHAR(250) NOT NULL,
  descripcion VARCHAR(500) NULL,

  url VARCHAR(800) NULL,
  nombre_archivo VARCHAR(250) NULL,
  ruta_archivo VARCHAR(800) NULL,
  tipo_mime VARCHAR(100) NULL,
  tamanio_bytes BIGINT NULL,

  cargado_por BIGINT NOT NULL,
  fecha_carga TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_bev_benef FOREIGN KEY (id_beneficio)
    REFERENCES beneficio_actividad_ie(id_beneficio) ON DELETE CASCADE,
  CONSTRAINT fk_bev_user FOREIGN KEY (cargado_por)
    REFERENCES usuario(id_usuario),

  CONSTRAINT ck_benef_evidencia_tipo CHECK (
    (tipo = 'ENLACE' AND url IS NOT NULL)
    OR
    (tipo = 'ARCHIVO' AND ruta_archivo IS NOT NULL)
  ),

  KEY ix_bev_beneficio (id_beneficio),
  KEY ix_bev_tipo (tipo)
) ENGINE=InnoDB;

CREATE TABLE beneficio_proyecto_oficial (
  id_beneficio_proy BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_proyecto BIGINT NOT NULL,
  fecha_reporte DATE NOT NULL,

  total_beneficiarios INT NULL,
  directivos_benef INT NULL,
  administrativos_benef INT NULL,
  docentes_benef INT NULL,
  estudiantes_benef INT NULL,
  padres_benef INT NULL,

  recibio_asistencia_tecnica BOOLEAN NULL,
  modalidad_asistencia_tecnica VARCHAR(50) NULL,
  recibio_dotacion BOOLEAN NULL,
  dotacion_recibida TEXT NULL,

  evidencia_url VARCHAR(800) NULL,
  observacion VARCHAR(600) NULL,
  fuente_dato ENUM('MIGRADO','OFICIAL') NOT NULL DEFAULT 'MIGRADO',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_bpo_proy_fecha (id_proyecto, fecha_reporte),
  CONSTRAINT fk_bpo_proy FOREIGN KEY (id_proyecto) REFERENCES proyecto(id_proyecto) ON DELETE CASCADE,
  KEY ix_bpo_fecha (fecha_reporte)
) ENGINE=InnoDB;

-- =========================
-- 6) ATRIBUTOS DINÁMICOS
-- =========================
CREATE TABLE atributo_beneficio (
  id_atributo BIGINT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(80) NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  tipo ENUM('INT','DECIMAL','BOOL','TEXT','ENUM') NOT NULL,
  opciones_json JSON NULL,
  unidad VARCHAR(50) NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY uq_atributo_codigo (codigo)
) ENGINE=InnoDB;

CREATE TABLE linea_atributo_beneficio (
  id_linea BIGINT NOT NULL,
  id_atributo BIGINT NOT NULL,
  requerido BOOLEAN NOT NULL DEFAULT FALSE,
  orden INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id_linea, id_atributo),
  CONSTRAINT fk_lab_linea FOREIGN KEY (id_linea) REFERENCES linea_estrategica(id_linea),
  CONSTRAINT fk_lab_atrib FOREIGN KEY (id_atributo) REFERENCES atributo_beneficio(id_atributo)
) ENGINE=InnoDB;

CREATE TABLE beneficio_atributo_valor (
  id_beneficio BIGINT NOT NULL,
  id_atributo BIGINT NOT NULL,

  valor_int INT NULL,
  valor_decimal DECIMAL(18,2) NULL,
  valor_bool BOOLEAN NULL,
  valor_text VARCHAR(800) NULL,
  valor_enum VARCHAR(100) NULL,

  PRIMARY KEY (id_beneficio, id_atributo),
  CONSTRAINT fk_bav_benef FOREIGN KEY (id_beneficio) REFERENCES beneficio_actividad_ie(id_beneficio) ON DELETE CASCADE,
  CONSTRAINT fk_bav_atrib FOREIGN KEY (id_atributo) REFERENCES atributo_beneficio(id_atributo),

  KEY ix_bav_atrib (id_atributo)
) ENGINE=InnoDB;

-- =========================
-- 7) AUDITORÍA
-- =========================
CREATE TABLE auditoria_evento (
  id_evento BIGINT AUTO_INCREMENT PRIMARY KEY,
  entidad ENUM('proyecto','actividad') NOT NULL,
  id_entidad BIGINT NOT NULL,
  accion ENUM('INSERT','UPDATE','DELETE') NOT NULL,
  usuario_id BIGINT NULL,
  fecha_evento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  motivo VARCHAR(300) NULL,
  antes_json JSON NULL,
  despues_json JSON NULL,

  KEY ix_aud_entidad (entidad, id_entidad),
  KEY ix_aud_fecha (fecha_evento),
  CONSTRAINT fk_aud_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

-- =========================
-- 8) VISTAS
-- =========================
CREATE OR REPLACE VIEW vw_proyecto_ejecucion_operativa AS
SELECT
  p.id_proyecto,
  p.codigo,
  p.nombre,
  SUM(COALESCE(a.total_ejecutado,0)) AS total_ejecutado_operativo
FROM proyecto p
LEFT JOIN actividad a ON a.id_proyecto = p.id_proyecto
GROUP BY p.id_proyecto, p.codigo, p.nombre;

CREATE OR REPLACE VIEW vw_proyecto_finanzas AS
SELECT
  p.id_proyecto,
  p.codigo,
  p.nombre,
  p.apropiacion_definitiva,
  p.adicion,
  (COALESCE(p.apropiacion_definitiva,0) + COALESCE(p.adicion,0)) AS presupuesto_total,
  SUM(COALESCE(a.total_ejecutado,0)) AS total_ejecutado_calculado,
  ((COALESCE(p.apropiacion_definitiva,0) + COALESCE(p.adicion,0)) - SUM(COALESCE(a.total_ejecutado,0))) AS diferencia_apro_ejec,
  CASE
    WHEN (COALESCE(p.apropiacion_definitiva,0) + COALESCE(p.adicion,0)) = 0 THEN NULL
    ELSE ROUND(SUM(COALESCE(a.total_ejecutado,0)) / (COALESCE(p.apropiacion_definitiva,0) + COALESCE(p.adicion,0)) * 100, 2)
  END AS porcentaje_ejecucion
FROM proyecto p
LEFT JOIN actividad a ON a.id_proyecto = p.id_proyecto
GROUP BY p.id_proyecto, p.codigo, p.nombre, p.apropiacion_definitiva, p.adicion;

CREATE OR REPLACE VIEW vw_beneficiarios_proyecto_resumen AS
SELECT
  p.id_proyecto,
  p.codigo,
  p.nombre,
  SUM(COALESCE(a.numero_beneficiarios,0)) AS beneficiarios_por_actividad,
  COUNT(DISTINCT bai.id_ie) AS ies_beneficiadas_reales
FROM proyecto p
LEFT JOIN actividad a ON a.id_proyecto = p.id_proyecto
LEFT JOIN beneficio_actividad_ie bai ON bai.id_actividad = a.id_actividad
GROUP BY p.id_proyecto, p.codigo, p.nombre;



SELECT
  le.codigo AS linea_codigo,
  v.anio AS vigencia,

  p.codigo AS proyecto_codigo,
  p.nombre AS proyecto_nombre,
  p.codigo_bpin,
  p.codigo_pi,

  ur.nombre AS responsable,
  ua.nombre AS apoyo_tecnico,

  pf.presupuesto_total,
  pf.total_ejecutado_calculado,
  pf.porcentaje_ejecucion,

  a.id_actividad,
  a.nombre AS actividad_nombre,
  a.estado AS actividad_estado,
  a.componente_pam,
  a.actor_dirigido,
  a.total_ejecutado AS actividad_ejecutado,

  av.fecha_corte AS avance_fecha,
  av.porcentaje AS avance_pct,

  ie.codigo_dane,
  ie.nombre AS institucion_educativa,
  mu.nombre AS municipio,

  bai.fecha_evento,
  bai.directivos_benef,
  bai.docentes_benef,
  bai.estudiantes_benef,
  bai.recibio_asistencia_tecnica,
  bai.modalidad_asistencia_tecnica,
  bai.recibio_dotacion,
  bai.dotacion_recibida,

  bev.tipo AS beneficio_evid_tipo,
  bev.url AS beneficio_evid_url,
  bev.ruta_archivo AS beneficio_evid_archivo,

  ig.codigo AS indicador_codigo,
  igv.fecha_corte AS indicador_fecha,
  igv.valor AS indicador_valor

FROM proyecto p
JOIN linea_vigencia lv ON lv.id_linea_vigencia = p.id_linea_vigencia
JOIN linea_estrategica le ON le.id_linea = lv.id_linea
JOIN vigencia v ON v.id_vigencia = lv.id_vigencia
JOIN usuario ur ON ur.id_usuario = p.responsable_id
JOIN usuario ua ON ua.id_usuario = p.apoyo_tecnico_id

LEFT JOIN vw_proyecto_finanzas pf ON pf.id_proyecto = p.id_proyecto

LEFT JOIN proyecto_meta pm ON pm.id_proyecto = p.id_proyecto
LEFT JOIN meta m ON m.id_meta = pm.id_meta
LEFT JOIN indicador_gestion ig ON ig.id_meta = m.id_meta
LEFT JOIN indicador_gestion_valor igv
  ON igv.id_indicador = ig.id_indicador
 AND igv.fecha_corte = (
    SELECT MAX(x.fecha_corte)
    FROM indicador_gestion_valor x
    WHERE x.id_indicador = ig.id_indicador
 )

LEFT JOIN actividad a ON a.id_proyecto = p.id_proyecto
LEFT JOIN avance_actividad av ON av.id_actividad = a.id_actividad
LEFT JOIN beneficio_actividad_ie bai ON bai.id_actividad = a.id_actividad
LEFT JOIN institucion_educativa ie ON ie.id_ie = bai.id_ie
LEFT JOIN municipio mu ON mu.id_municipio = ie.id_municipio
LEFT JOIN beneficio_evidencia bev ON bev.id_beneficio = bai.id_beneficio

WHERE le.codigo = 'POAI'
  AND v.anio = 2025

ORDER BY p.codigo, a.id_actividad, bai.fecha_evento, bev.id_evidencia;
