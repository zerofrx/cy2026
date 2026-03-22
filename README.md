# CY2026 — Simulacros de Ciberseguridad Corporativa

Sistema de juegos de concientización en ciberseguridad para empleados bancarios. Tres variantes de juego independientes, diseñadas para sesiones presenciales con facilitador y grupos de hasta 30 personas.

No requiere instalación. Son archivos HTML que se abren directo en el navegador.

---

## Archivos

| Archivo | Descripción |
|---|---|
| `facilitador-panel.html` | Panel de control para el facilitador. Punto de inicio de cada sesión. |
| `variante-a-cazadores.html` | Variante A — Quiz competitivo en tiempo real |
| `variante-b-escape-room.html` | Variante B — Escape room digital |
| `variante-c-consejo-crisis.html` | Variante C — Consejo de crisis |

---

## Las tres variantes

### Variante A — Cazadores de Amenazas
Quiz de preguntas múltiples proyectado en pantalla grande. El facilitador conduce desde su computadora y todos los equipos responden en simultáneo. Hay un timer por pregunta y un ranking al final.

- **Formato:** 8 preguntas · ~75 min · 6 equipos
- **Temas:** phishing, contraseñas, USB malicioso, ransomware, ingeniería social, WiFi público, datos sensibles
- **Dinámica:** un vocero por equipo responde; el facilitador controla el ritmo

### Variante B — Escape Room Digital
Cada equipo trabaja en su propia computadora y avanza por 4 retos encadenados que simulan un incidente real. No se puede pasar al siguiente reto sin completar el anterior.

- **Formato:** 4 retos · 60 min · equipos paralelos
- **Retos:** análisis de email de phishing → lectura de logs de acceso → decisiones de contención → reporte regulatorio
- **Extras:** panel de alertas en tiempo real, pistas por rol (CISO, Legal, Comunicaciones, Operaciones, Analista)

### Variante C — Consejo de Crisis
El facilitador proyecta el juego y toda la sala debate cada decisión antes de responder. Las respuestas no son correctas/incorrectas, sino graduadas en 4 niveles (decisión óptima → oportunidad perdida).

- **Formato:** 4 rondas · ~90 min · modo plenario
- **Rondas:** primera respuesta al incidente → comunicación con clientes → medidas de protección → lecciones aprendidas
- **Extras:** sistema de puntuación por tiers, panel de notificaciones, historial de consecuencias

---

## Cómo usar

1. Abrir `facilitador-panel.html` en el navegador
2. Elegir la variante para la sesión y hacer clic en **Abrir juego →**
3. Proyectar la pantalla del facilitador (Variante A y C) o distribuir el link a cada equipo (Variante B)
4. Usar el guión incluido en el panel para conducir la apertura, el juego y el debrief

### Estructura de una sesión típica

```
10 min  — Bienvenida, formación de equipos, elección de voceros
60–75 min — Juego (una sola variante por sesión)
15 min  — Debrief guiado: revelar respuestas, discutir casos reales
10 min  — Cierre: compromisos concretos de cada equipo
```

---

## Audiencia y diseño pedagógico

Diseñado para empleados bancarios sin formación técnica, incluyendo jefes de área. Los escenarios evitan jerga técnica y usan situaciones cotidianas (emails, llamadas, trabajo remoto) para que cualquier empleado pueda identificarse con el caso.

Los temas cubiertos son:
- Business Email Compromise (BEC)
- Phishing interno y externo
- Ingeniería social (USB baiting, vishing)
- Ransomware / secuestro de datos
- Seguridad en trabajo remoto y WiFi público
- Gestión de incidentes y obligaciones regulatorias
- Protección de datos físicos

---

## Tecnología

HTML + CSS + JavaScript vanilla. Sin frameworks, sin dependencias, sin servidor. Funciona offline una vez que las fuentes de Google Fonts se cachearon (o con conexión a internet).
