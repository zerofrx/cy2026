# CY2026 — Simulacros de Ciberseguridad Corporativa

Sistema de juegos de concientización en ciberseguridad para empleados bancarios. Tres variantes de juego independientes, diseñadas para sesiones presenciales con facilitador y grupos de hasta 30 personas.

No requiere instalación. Son archivos HTML que se abren directo en el navegador.

---

## Archivos

| Archivo | Descripción |
|---|---|
| `facilitador-panel.html` | Panel de control para el facilitador. Punto de inicio de cada sesión. |
| `variante-a-cazadores.html` | Variante A — Juego de cartas con narrativa de crisis bancaria |
| `variante-b-escape-room.html` | Variante B — Escape room digital con sistema de penalización |
| `variante-c-consejo-crisis.html` | Variante C — Consejo de crisis con presupuesto e inversiones |

---

## Las tres variantes

### Variante A — Cazadores de Amenazas

Juego de cartas con historia conectada: una crisis de ciberseguridad en un banco que escala ronda a ronda. Cada equipo elige un rol y usa cartas de defensa y herramientas para frenar un ataque coordinado. Solo se emula el equipo elegido; los otros 5 juegan automáticamente.

- **Formato:** 10 rondas · ~60 min · 6 equipos · 5 min por ronda
- **Narrativa:** 4 capítulos (Reconocimiento → Infiltración → Ataque → Batalla final) que cuentan un ciberataque coordinado contra "Banco Nacional"
- **Cartas:** 10 ataques, 11 defensas, 8 herramientas, 5 eventos aleatorios
- **Dinámica:** cada ronda presenta un ataque narrativo; el equipo elige qué carta jugar para defenderse. Un tracker visual muestra las cartas disponibles y usadas.

### Variante B — Escape Room Digital

Cada equipo trabaja en su propia computadora y avanza por 4 retos encadenados que simulan un incidente real. No se puede pasar al siguiente reto sin completar el anterior. Las respuestas incorrectas restan puntos.

- **Formato:** 4 retos · 60 min · equipos paralelos
- **Retos:** análisis de email de phishing → lectura de logs de acceso → decisiones de contención → reporte regulatorio
- **Extras:** panel de alertas en tiempo real, pistas por rol (CISO, Legal, Comunicaciones, Operaciones, Analista), sistema de penalización por respuestas incorrectas

### Variante C — Consejo de Crisis

El facilitador proyecta el juego y toda la sala debate cada decisión antes de responder. Las respuestas no son correctas/incorrectas, sino graduadas en 4 niveles (decisión óptima → oportunidad perdida). Incluye sistema de presupuesto para invertir en medidas de protección.

- **Formato:** 4 rondas · ~90 min · modo plenario
- **Rondas:** primera respuesta al incidente → comunicación con clientes → medidas de protección → lecciones aprendidas
- **Extras:** sistema de puntuación por tiers, panel de notificaciones, historial de consecuencias, gestión de presupuesto e inversiones

---

## Cómo usar

1. Abrir `facilitador-panel.html` en el navegador
2. Completar el checklist de preparación y elegir una de las 3 variantes
3. Hacer clic en **Iniciar sesión →**
4. Proyectar la pantalla del facilitador (Variante A y C) o distribuir el link a cada equipo (Variante B)
5. Usar el guión incluido en el panel para conducir la apertura, el juego y el debrief

### Estructura de una sesión típica

```
10 min  — Bienvenida, formación de equipos, elección de voceros
60–90 min — Juego (una sola variante por sesión)
15 min  — Debrief guiado: revelar respuestas, discutir casos reales
10 min  — Cierre: compromisos concretos de cada equipo
```

---

## Audiencia y diseño pedagógico

Diseñado para empleados bancarios sin formación técnica, incluyendo jefes de área. Los escenarios usan situaciones cotidianas (emails, llamadas, visitas inesperadas, trabajo remoto) y lenguaje accesible para que cualquier persona pueda identificarse con el caso. La tipografía e interfaz están optimizadas para legibilidad en proyección y en pantallas individuales.

Los temas cubiertos son:
- Acceso físico no autorizado (tailgating)
- Phishing interno y externo
- Ingeniería social (USB baiting, vishing, deepfakes)
- Ransomware / secuestro de datos
- Seguridad en redes WiFi y VPN
- Gestión de incidentes y obligaciones regulatorias
- Protección de datos sensibles (físicos y digitales)
- Business Email Compromise (BEC)

---

## Tecnología

HTML + CSS + JavaScript vanilla. Sin frameworks, sin dependencias, sin servidor. Tipografía: Syne (Google Fonts). Funciona offline una vez que las fuentes se cachearon (o con conexión a internet).
