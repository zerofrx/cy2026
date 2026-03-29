// ════════════════════════════════════════════════════════
// ESTADO GLOBAL
// ════════════════════════════════════════════════════════
let timerSecs=3600,timerInt=null,currentRound=0;
let bestDec=0,goodDec=0,poorDec=0,totalScore=0;
let consequences=[],dtRound={},unreadNotifs=0,currentTab='info';
let budget=2000000,totalCosts=0,totalPenalties=0,totalRecoveries=0;
let penaltyShield=0,investmentsDone={};
let decisionPath=[];

// Nombres del comité (se cargan al iniciar)
let committee={team:'',ciso:'',legal:'',comms:'',ops:'',gm:''};
const role = key => committee[key] || {ciso:'el CISO',legal:'Legal',comms:'Comunicaciones',ops:'Operaciones',gm:'el Gerente General'}[key];
const teamName = () => committee.team || 'Equipo 1';

const TEAMS=[
  {name:'Equipo 1',score:0,decided:false,active:true},
  {name:'Equipo 2',score:0,decided:false},
  {name:'Equipo 3',score:0,decided:false},
  {name:'Equipo 4',score:0,decided:false},
  {name:'Equipo 5',score:0,decided:false},
  {name:'Equipo 6',score:0,decided:false},
];

const TIER={
  best:{label:'⭐⭐⭐ Decisión óptima', color:'var(--tier-best)', css:'tier-best', cons:'cons-best', cr:'cr-best-bg'},
  good:{label:'⭐⭐ Buena decisión',   color:'var(--tier-good)', css:'tier-good', cons:'cons-good', cr:'cr-good-bg'},
  ok:  {label:'⭐ Decisión parcial',   color:'var(--tier-ok)',   css:'tier-ok',   cons:'cons-ok',   cr:'cr-ok-bg'},
  poor:{label:'◻ Oportunidad perdida', color:'var(--tier-poor)', css:'tier-poor', cons:'cons-poor',  cr:'cr-poor-bg'},
};

const fmt = n => '$' + Math.abs(Math.round(n)).toLocaleString('en-US');

// ════════════════════════════════════════════════════════
// ÁRBOL DE DECISIONES — 5 STAGES
// Cada stage puede tener variantes según el camino previo
// ════════════════════════════════════════════════════════
const STAGES = [

// ── STAGE 1: El jueves negro ──────────────────────────
{
  variants:{
    default:{
      status:'ALERTA MÁXIMA · JUEVES 07:31hs',
      title:'El jueves negro',
      narrative:'El SOC acaba de confirmar la alerta más grave en la historia del banco. En los últimos 18 minutos, 9.000 terminales y 500 servidores dejaron de responder. Las pantallas muestran un mensaje de error en el disco de arranque — el malware KillMBR está borrando los discos en cascada. Las sucursales están paralizadas. El equipo de IT no puede reiniciar ningún equipo. Nadie sabe todavía de dónde viene ni qué busca.',
      update:null,
      branchContext:null,
      question:'¿Cuál es la primera acción del Comité de Crisis?',
      impact:'ALTO',
      options:[
        {
          text:'Aislar inmediatamente los servidores SWIFT y los sistemas de transferencias internacionales',
          sub:'Priorización técnica · Protege el sistema de pagos internacionales',
          tier:'best', points:800,
          cost:120000, penalty:0, recovery:0,
          consequence:'La decisión de aislar SWIFT en los primeros minutos fue clave. Se bloquearon 2 de las 4 transferencias fraudulentas. El daño quedó limitado a USD 4.2M.',
          branchNote:'SWIFT parcialmente protegido → Stage 2 inicia con 2 transferencias bloqueadas',
          budgetNote:'Costo de desconexión de emergencia + SOC externo activado'
        },
        {
          text:'Apagar toda la red del banco por sectores para contener el malware',
          sub:'Contención total · Detiene la propagación sacrificando operaciones',
          tier:'good', points:500,
          cost:200000, penalty:0, recovery:0,
          consequence:'El apagado masivo detuvo el malware, pero también cortó el monitoreo del SWIFT. Las 4 transferencias se ejecutaron mientras la red estaba caída.',
          branchNote:'Red apagada sin logs SWIFT → Stage 2 con daño completo y sin evidencia',
          budgetNote:'Más horas-hombre + recuperación de más sistemas afectados'
        },
        {
          text:'Desconectar solo los terminales visiblemente afectados y esperar el diagnóstico completo',
          sub:'Respuesta selectiva · Actúa sobre lo conocido sin apagar todo',
          tier:'ok', points:220,
          cost:280000, penalty:80000, recovery:0,
          consequence:'La respuesta parcial dejó al malware activo por 40 minutos adicionales. Se destruyeron 3.200 equipos más. Las transferencias SWIFT continuaron.',
          branchNote:'Malware activo más tiempo → Stage 2 con mayor daño colateral',
          budgetNote:'El malware siguió corriendo — más destrucción, más costo de recuperación'
        },
        {
          text:'Convocar al directorio y al Gerente General antes de tomar cualquier acción técnica',
          sub:'Escalada ejecutiva · Asegura autorización antes de actuar',
          tier:'poor', points:50,
          cost:150000, penalty:200000, recovery:0,
          consequence:'La espera de 45 minutos esperando instrucciones permitió que el malware destruyera el 80% de los sistemas y que las 4 transferencias SWIFT se completaran.',
          branchNote:'Daño máximo sin contención → Stage 2 en modo crisis total',
          budgetNote:'La parálisis tiene costo: destrucción masiva + todo el daño SWIFT sin frenar'
        },
      ]
    }
  },
  penalties:{poor:200000, ok:80000}
},

// ── STAGE 2: La pantalla de humo ──────────────────────
{
  variants:{
    best:{
      status:'REVELACIÓN CRÍTICA · HORA +90MIN',
      title:'La pantalla de humo — daño parcialmente contenido',
      narrative:'Mientras el equipo apagaba terminales, el analista de SWIFT encontró algo que heló la sala: 4 órdenes de transferencia internacional ejecutadas automáticamente en los últimos 45 minutos. Dos fueron bloqueadas gracias al aislamiento temprano. Dos llegaron a destino. El malware no era el ataque — era la distracción. El verdadero robo fue vía SWIFT. USD 4.2 millones ya están en cuentas en Hong Kong.',
      update:'⚡ Confirmado: las transferencias tienen origen en el operador SWIFT interno. Alguien con acceso al sistema colocó las órdenes. Los fondos son del banco, no de los clientes.',
      branchContext:'🔀 El aislamiento temprano bloqueó 2 transferencias. El daño es la mitad del peor escenario.',
      question:'¿Cómo reacciona el comité ante el descubrimiento del robo SWIFT?',
      impact:'ALTO',
      options:[
        {
          text:'Activar el protocolo de fraude SWIFT + contactar a los bancos corresponsales para intentar revertir las transferencias',
          sub:'Acción inmediata · Hay una ventana de horas para revertir transferencias SWIFT',
          tier:'best', points:900,
          cost:90000, penalty:0, recovery:400000,
          consequence:'Los corresponsales bloquearon parcialmente los fondos. Se recuperaron USD 400.000 antes de que llegaran a la cuenta final. La ventana SWIFT es estrecha pero existe.',
          branchNote:'Recuperación parcial lograda → Stage 3 con evidencia de los corresponsales',
          budgetNote:'Costo de gestión internacional + honorarios bancarios de emergencia'
        },
        {
          text:'Dividir el equipo: la mitad sigue con el malware, la mitad investiga las transferencias SWIFT',
          sub:'Respuesta paralela · Atiende los dos frentes al mismo tiempo',
          tier:'good', points:550,
          cost:150000, penalty:0, recovery:0,
          consequence:'El equipo dividido logró contener el malware y documentar las transferencias, pero la respuesta fue más lenta en ambos frentes. Sin corresponsales, los fondos no se recuperaron.',
          branchNote:'Documentación sin recuperación → Stage 3 con buena evidencia pero sin fondos',
          budgetNote:'Más recursos humanos, menos eficiencia en cada frente'
        },
        {
          text:'Priorizar la recuperación de los sistemas operativos para reabrir las sucursales',
          sub:'Operativa · La continuidad del negocio es la prioridad',
          tier:'ok', points:200,
          cost:180000, penalty:120000, recovery:0,
          consequence:'Las sucursales reabrieron en 3 horas, pero las transferencias SWIFT quedaron sin atender. La ventana para revertirlas se cerró. El dinero salió definitivamente.',
          branchNote:'Fondos perdidos definitivamente → Stage 3 sin posibilidad de recuperación SWIFT',
          budgetNote:'Costo de recuperación operativa + penalización por no actuar sobre el SWIFT'
        },
        {
          text:'Escalar al Gerente General y esperar instrucciones antes de contactar a cualquier entidad externa',
          sub:'Escalada total · Asegura autorización antes de actuar',
          tier:'poor', points:60,
          cost:100000, penalty:300000, recovery:0,
          consequence:'La espera de 2 horas para obtener autorización cerró definitivamente la ventana SWIFT. Los USD 4.2M están en Hong Kong sin posibilidad de revertir.',
          branchNote:'Sin acción → Stage 3 con daño total y sin evidencia de corresponsales',
          budgetNote:'La parálisis post-descubrimiento tiene el costo más alto del juego'
        },
      ]
    },
    good:{
      status:'REVELACIÓN CRÍTICA · HORA +90MIN',
      title:'La pantalla de humo — red sin logs',
      narrative:'Con la red apagada, el analista encontró las 4 transferencias SWIFT en los registros previos al corte. Las 4 se ejecutaron mientras el equipo apagaba la red. USD 9.8 millones ya están en tránsito hacia Hong Kong. El peor dato: el apagado masivo borró los logs del sistema SWIFT de los últimos 30 minutos. No tienen evidencia completa de cómo entró el atacante.',
      update:'⚡ El responsable de SWIFT confirmó: las órdenes fueron firmadas digitalmente con credenciales válidas de un operador interno. Hay un insider o las credenciales fueron robadas meses atrás.',
      branchContext:'🔀 El apagado masivo protegió los sistemas pero borró evidencia SWIFT crítica. El daño es completo.',
      question:'¿Cómo proceden con el daño completo y la evidencia incompleta?',
      impact:'ALTO',
      options:[
        {
          text:'Contactar corresponsales SWIFT de emergencia aunque los logs estén incompletos',
          sub:'Acción inmediata · Intentar recuperación aunque la evidencia sea parcial',
          tier:'best', points:800,
          cost:110000, penalty:0, recovery:200000,
          consequence:'Con evidencia parcial lograron bloquear USD 200.000 en tránsito. Los corresponsales requirieron documentación adicional que retrasó el proceso.',
          branchNote:'Recuperación mínima → Stage 3 con investigación forense urgente por logs faltantes',
          budgetNote:'Gestión internacional compleja con evidencia incompleta'
        },
        {
          text:'Reconstruir los logs desde los backups antes de contactar a nadie externo',
          sub:'Evidencia primero · Asegurar la documentación antes de actuar',
          tier:'good', points:480,
          cost:160000, penalty:0, recovery:0,
          consequence:'La reconstrucción parcial tomó 4 horas. Para cuando contactaron corresponsales, los fondos ya estaban dispersos en múltiples cuentas.',
          branchNote:'Logs parcialmente recuperados → Stage 3 con mejor evidencia pero fondos perdidos',
          budgetNote:'Costo de análisis forense urgente de backups'
        },
        {
          text:'Notificar al BCP antes de intentar cualquier recuperación para seguir el protocolo',
          sub:'Regulatoria · Cumplir el proceso formal ante el Banco Central',
          tier:'ok', points:220,
          cost:100000, penalty:150000, recovery:0,
          consequence:'El BCP respondió en 6 horas. Para entonces la ventana de reversión SWIFT estaba cerrada. El regulador quedó informado pero sin poder actuar.',
          branchNote:'BCP notificado tardíamente → Stage 3 con presión regulatoria activa',
          budgetNote:'Demora regulatoria + costo de ventana perdida'
        },
        {
          text:'Mantener silencio total hasta tener el panorama completo',
          sub:'Sigilosa · No actuar sin certeza total',
          tier:'poor', points:40,
          cost:80000, penalty:350000, recovery:0,
          consequence:'El silencio de 8 horas fue interpretado como ocultamiento. Los fondos se dispersaron. El BCP se enteró por un reporte externo. La situación se complicó gravemente.',
          branchNote:'Silencio interpretado como ocultamiento → Stage 3 con crisis regulatoria severa',
          budgetNote:'La inacción tiene el costo máximo: fondos perdidos + penalización regulatoria'
        },
      ]
    },
    ok:{
      status:'REVELACIÓN CRÍTICA · HORA +90MIN',
      title:'La pantalla de humo — más daño colateral',
      narrative:'La respuesta parcial dejó el malware activo por 40 minutos adicionales. Ahora también están afectados los servidores de respaldo. El analista encontró las transferencias SWIFT: las 4 se ejecutaron. USD 9.8M salieron. Pero hay más: el malware accedió a la base de datos de clientes durante esos 40 minutos adicionales. No es seguro si exportó datos.',
      update:'⚡ IT confirma: hay evidencia de acceso a la base de datos de 180.000 clientes. No se sabe si los datos fueron extraídos. El equipo de seguridad está analizando los logs.',
      branchContext:'🔀 La respuesta tardía amplió el ataque. Ahora hay dos crisis: el robo SWIFT y la posible filtración de datos de clientes.',
      question:'¿Cuál crisis priorizan con recursos limitados?',
      impact:'ALTO',
      options:[
        {
          text:'Investigar la filtración de datos de clientes en paralelo con las transferencias SWIFT',
          sub:'Paralela · Ambas crisis tienen consecuencias regulatorias críticas',
          tier:'best', points:750,
          cost:200000, penalty:0, recovery:0,
          consequence:'La investigación paralela confirmó que los datos NO fueron extraídos — solo accedidos. La notificación proactiva al BCP sobre ambos vectores fue valorada.',
          branchNote:'Doble investigación exitosa → Stage 3 con evidencia completa de ambos vectores',
          budgetNote:'Doble investigación tiene costo alto pero evita peores escenarios'
        },
        {
          text:'Priorizar las transferencias SWIFT — el daño financiero es más urgente que los datos',
          sub:'Financiera · El robo tiene ventana de recuperación; los datos no',
          tier:'good', points:430,
          cost:170000, penalty:0, recovery:0,
          consequence:'Contactaron corresponsales pero sin éxito. La filtración de datos quedó sin investigar por 6 horas, lo que complicó la respuesta regulatoria posterior.',
          branchNote:'Datos sin investigar → Stage 3 con incertidumbre sobre filtración activa',
          budgetNote:'Foco en SWIFT sin resolver el tema de datos prolonga la crisis'
        },
        {
          text:'Priorizar la filtración de datos — 180.000 clientes deben ser protegidos primero',
          sub:'Clientes primero · La protección de datos es la obligación mayor',
          tier:'ok', points:210,
          cost:180000, penalty:120000, recovery:0,
          consequence:'La investigación de datos confirmó que no hubo extracción, pero perdieron la ventana SWIFT. Los USD 9.8M salieron sin posibilidad de recuperación.',
          branchNote:'SWIFT cerrado → Stage 3 sin posibilidad de recuperación financiera',
          budgetNote:'Decisión costosa: protegieron datos pero cerraron la ventana de recuperación'
        },
        {
          text:'Contratar una firma externa de ciberseguridad y esperar su diagnóstico',
          sub:'Externa · Delegar la investigación a expertos externos',
          tier:'poor', points:60,
          cost:250000, penalty:200000, recovery:0,
          consequence:'La firma tardó 12 horas en llegar. Ambas ventanas se cerraron. El BCP se enteró por Twitter antes de recibir cualquier comunicación del banco.',
          branchNote:'Demora total → Stage 3 con crisis regulatoria y reputacional simultáneas',
          budgetNote:'Contratar externos en pánico tiene costo alto y demora operativa'
        },
      ]
    },
    poor:{
      status:'ALERTA MÁXIMA · JUEVES 07:31hs',
      title:'La pantalla de humo — daño sin precedentes',
      narrative:'La demora de 45 minutos fue catastrófica. El malware destruyó el 80% de los sistemas. Las 4 transferencias SWIFT se completaron — USD 9.8M en Hong Kong. El acceso fue tan prolongado que los atacantes también extrajeron credenciales de 42 empleados con acceso privilegiado. El banco está operando en modo manual. El BCP acaba de llamar porque recibió alertas automáticas del sistema de monitoreo.',
      update:'⚡ CRÍTICO: El BCP llama en este momento. Están pidiendo un informe ejecutivo inmediato. El Gerente General está siendo buscado por tres periodistas de ABC Color y Última Hora.',
      branchContext:'🔀 La parálisis inicial generó el peor escenario. El BCP ya está encima. La prensa también.',
      question:'¿Cómo responden a la llamada del BCP en este momento crítico?',
      impact:'ALTO',
      options:[
        {
          text:'Atender la llamada, reconocer el incidente y pedir 24 horas para un informe formal completo',
          sub:'Proactiva · Honestidad inmediata con el regulador',
          tier:'best', points:650,
          cost:120000, penalty:0, recovery:0,
          consequence:'El BCP valoró la transparencia inmediata. Concedieron las 24 horas. El banco ganó tiempo para organizar la respuesta sin perder la confianza regulatoria.',
          branchNote:'BCP como aliado → Stage 3 con 24h de margen regulatorio',
          budgetNote:'La transparencia tiene costo mínimo y evita penalizaciones mayores'
        },
        {
          text:'Pedir 2 horas al BCP para tener el panorama completo antes de informar',
          sub:'Cautelosa · No informar hasta tener datos sólidos',
          tier:'good', points:380,
          cost:100000, penalty:0, recovery:0,
          consequence:'El BCP aceptó a regañadientes. Las 2 horas se usaron bien para documentar. La relación regulatoria quedó tensa pero funcional.',
          branchNote:'BCP en modo supervisión estricta → Stage 3 con presión regulatoria moderada',
          budgetNote:'Costo moderado: gestión regulatoria sin penalización inmediata'
        },
        {
          text:'Derivar la llamada a Legal mientras el CISO sigue trabajando en la respuesta técnica',
          sub:'Técnica primero · El CISO no puede distraerse ahora',
          tier:'ok', points:160,
          cost:150000, penalty:180000, recovery:0,
          consequence:'Legal no tenía información suficiente. La conversación con el BCP fue confusa y contradictoria. El regulador inició un proceso de supervisión especial.',
          branchNote:'BCP en supervisión especial → Stage 3 con auditoría regulatoria activa',
          budgetNote:'La confusión con el BCP tiene costo regulatorio directo'
        },
        {
          text:'No atender la llamada del BCP — priorizar absolutamente la respuesta interna',
          sub:'Interna total · El banco primero, el regulador después',
          tier:'poor', points:0,
          cost:80000, penalty:400000, recovery:0,
          consequence:'No atender al BCP fue interpretado como obstrucción. El regulador escaló la situación. A las 3 horas llegó una notificación formal de inicio de proceso sancionatorio.',
          branchNote:'Proceso sancionatorio del BCP → Stage 3 con crisis regulatoria máxima',
          budgetNote:'No atender al regulador tiene la penalización más alta del juego'
        },
      ]
    }
  },
  penalties:{poor:400000, ok:120000}
},

// ── STAGE 3: El origen ────────────────────────────────
{
  variants:{
    strong:{
      status:'INVESTIGACIÓN FORENSE · HORA +6H',
      title:'El origen — meses de infiltración',
      narrative:'Microsoft y el equipo forense externo llegaron al banco. Después de 4 horas de análisis, la conclusión es impactante: el malware no entró hoy. Entró hace 6 meses, en la sucursal de Ciudad del Este, a través de un email enviado a un empleado de back-office. El virus estuvo latente, mapeando la red, hasta hoy. Lo más preocupante: los atacantes necesitaban credenciales del sistema SWIFT. Alguien con acceso privilegiado las facilitó — o fueron robadas sin que nadie lo notara.',
      update:'⚡ Forense encontró un patrón de acceso inusual: un operador SWIFT realizó consultas de saldo en cuentas de corresponsales a las 2am durante los últimos 3 meses. Ese mismo operador no estaba de guardia esas noches.',
      branchContext:'🔀 La gestión sólida les da tiempo y recursos para investigar en profundidad.',
      question:'¿Cómo manejan el hallazgo del posible insider?',
      impact:'ALTO',
      options:[
        {
          text:'Suspender preventivamente al operador SWIFT identificado y auditar todos los accesos privilegiados',
          sub:'Decisiva · Elimina la amenaza interna mientras se investiga',
          tier:'best', points:850,
          cost:180000, penalty:0, recovery:0,
          consequence:'La suspensión fue correcta. La auditoría reveló que el operador tenía un acuerdo con el grupo atacante. Se identificó el vector completo. La evidencia fue clave para la PDI.',
          branchNote:'Insider identificado → Stage 4 con evidencia sólida para la PDI',
          budgetNote:'Auditoría completa de accesos privilegiados + asesoría legal para la suspensión'
        },
        {
          text:'Investigar al operador en secreto sin suspenderlo para no alertar a posibles cómplices',
          sub:'Sigilosa · Mantener al sospechoso activo para obtener más evidencia',
          tier:'good', points:580,
          cost:140000, penalty:0, recovery:0,
          consequence:'La investigación silenciosa acumuló más evidencia, pero el operador detectó la vigilancia y borró registros adicionales antes de ser identificado formalmente.',
          branchNote:'Evidencia parcial → Stage 4 con investigación abierta pero incompleta',
          budgetNote:'Investigación encubierta + recuperación de registros borrados'
        },
        {
          text:'Reportar el hallazgo a la PDI inmediatamente y dejar que ellos investiguen al operador',
          sub:'Legal · Delegar la investigación a las autoridades competentes',
          tier:'ok', points:270,
          cost:100000, penalty:80000, recovery:0,
          consequence:'La PDI tardó 48 horas en asignarlo. En ese tiempo el operador fue alertado por un colega y desapareció. La investigación quedó sin su testimonio.',
          branchNote:'Insider desaparecido → Stage 4 con investigación incompleta y sospechoso prófugo',
          budgetNote:'Pérdida de evidencia clave + costo de coordinación con PDI'
        },
        {
          text:'No actuar sobre el operador — puede ser una coincidencia y acusar en falso sería peor',
          sub:'Cautelosa · Evitar señalar sin pruebas sólidas',
          tier:'poor', points:70,
          cost:60000, penalty:160000, recovery:0,
          consequence:'El operador siguió en funciones. Días después filtró información interna a los medios. Las notas de ABC Color tenían detalles que solo alguien con acceso podía saber.',
          branchNote:'Insider activo → Stage 4 con filtración interna activa a la prensa',
          budgetNote:'Inacción ante la amenaza interna tiene costo reputacional y financiero'
        },
      ]
    },
    mixed:{
      status:'INVESTIGACIÓN FORENSE · HORA +6H',
      title:'El origen — presión simultánea',
      narrative:'El equipo forense confirmó que el malware entró hace 6 meses desde Ciudad del Este. Pero la investigación está siendo más difícil: los logs incompletos y la respuesta inicial dispareja dejaron huecos en la evidencia. Los atacantes necesitaban credenciales SWIFT — lo obtuvieron de algún modo. Mientras tanto, un portal de noticias paraguayo publicó una nota titulada "Hackeo masivo al Banco Ñandutí" basada en información de fuentes anónimas.',
      update:'⚡ El BCP llama por segunda vez. Quieren saber si los datos de clientes están comprometidos. La nota de prensa ya tiene 15.000 visualizaciones. El call center está desbordado.',
      branchContext:'🔀 La gestión mixta dejó frentes abiertos. Ahora tienen presión forense, regulatoria y mediática al mismo tiempo.',
      question:'¿Cuál frente priorizan con el equipo fragmentado?',
      impact:'ALTO',
      options:[
        {
          text:'Responder al BCP con un informe parcial + activar comunicado oficial para frenar la narrativa mediática',
          sub:'Paralela · Atiende al regulador y a la prensa al mismo tiempo',
          tier:'best', points:800,
          cost:200000, penalty:0, recovery:0,
          consequence:'El comunicado oficial encuadró la narrativa. El BCP recibió el informe y suspendió la presión por 48 horas. El equipo forense ganó espacio para trabajar.',
          branchNote:'Narrativa controlada → Stage 4 con margen operativo para la investigación',
          budgetNote:'Comunicaciones de crisis + asesoría regulatoria de emergencia'
        },
        {
          text:'Priorizar el informe al BCP — el regulador tiene jerarquía sobre los medios',
          sub:'Regulatoria · El BCP es el frente más importante',
          tier:'good', points:500,
          cost:160000, penalty:0, recovery:0,
          consequence:'El BCP quedó satisfecho, pero la narrativa mediática se instaló durante 6 horas sin respuesta oficial. Los clientes empezaron a retirar dinero.',
          branchNote:'Narrativa instalada → Stage 4 con corrida de clientes moderada',
          budgetNote:'Costo de respuesta regulatoria + pérdidas por retiro de depósitos'
        },
        {
          text:'Emitir primero el comunicado de prensa — la corrida de clientes es la amenaza mayor',
          sub:'Reputacional · La confianza del mercado es el activo más frágil',
          tier:'ok', points:220,
          cost:140000, penalty:120000, recovery:0,
          consequence:'El comunicado frenó la corrida, pero el BCP interpretó que el banco priorizó la imagen sobre la transparencia regulatoria. Inició supervisión especial.',
          branchNote:'BCP en supervisión especial → Stage 4 bajo escrutinio regulatorio',
          budgetNote:'La priorización de imagen sobre regulador tiene costo formal'
        },
        {
          text:'No comunicar nada hasta tener certeza total — comunicar a medias puede empeorar todo',
          sub:'Silencio · Esperar certeza antes de hablar',
          tier:'poor', points:60,
          cost:100000, penalty:200000, recovery:0,
          consequence:'El silencio de 8 horas fue devastador. Los medios llenaron el vacío con especulaciones. El BCP inició un proceso formal de sanción por falta de reporte oportuno.',
          branchNote:'Crisis reputacional + regulatoria → Stage 4 en modo control de daños',
          budgetNote:'El silencio tiene el costo más alto en una crisis pública'
        },
      ]
    },
    poor:{
      status:'INVESTIGACIÓN FORENSE · HORA +6H',
      title:'El origen — triple crisis activa',
      narrative:'Con el directorio en crisis, el BCP en supervisión especial y la prensa con información interna, la investigación judicial avanza en condiciones muy difíciles. El malware entró desde Ciudad del Este hace 6 meses — eso lo saben. Pero los sistemas destruidos y los logs borrados hacen casi imposible reconstruir el timeline completo. El BCP está en supervisión especial. Un periodista de Última Hora tiene información detallada que solo puede venir de adentro del banco.',
      update:'⚡ CRÍTICO: Tres directores del banco publicaron en Twitter expresando "preocupación" por la gestión de la crisis. Es la primera vez que el directorio habla públicamente. El Gerente General no tenía conocimiento de estos mensajes.',
      branchContext:'🔀 La gestión deficiente acumuló presiones que ahora estallan simultáneamente. Están en modo control de daños totales.',
      question:'¿Cómo responden ante la crisis interna y el directorio desmarcándose?',
      impact:'ALTO',
      options:[
        {
          text:'Convocar una reunión de directorio de emergencia para alinear el mensaje institucional',
          sub:'Unidad institucional · El directorio dividido es peor que el ataque',
          tier:'best', points:700,
          cost:150000, penalty:0, recovery:0,
          consequence:'La reunión logró unificar el mensaje. Los directores retiraron sus tweets y emitieron una declaración conjunta de respaldo a la gestión de la crisis.',
          branchNote:'Directorio unificado → Stage 4 con frente institucional sólido',
          budgetNote:'Reunión de emergencia + asesoría legal para manejo de comunicaciones del directorio'
        },
        {
          text:'Contactar individualmente a los directores para pedirles que suspendan los comentarios públicos',
          sub:'Contenida · Resolver la crisis interna sin reunión formal',
          tier:'good', points:430,
          cost:120000, penalty:0, recovery:0,
          consequence:'Dos de los tres directores accedieron. El tercero siguió comentando. El mensaje quedó parcialmente dividido pero más controlado.',
          branchNote:'Directorio parcialmente alineado → Stage 4 con incertidumbre institucional',
          budgetNote:'Gestión individual tiene menor costo pero resultado parcial'
        },
        {
          text:'Ignorar al directorio y enfocarse en la respuesta técnica y regulatoria',
          sub:'Técnica · Los tweets del directorio son ruido, el BCP es lo que importa',
          tier:'ok', points:180,
          cost:100000, penalty:150000, recovery:0,
          consequence:'Los tweets del directorio se amplificaron. Dos medios internacionales los recogieron. El BCP preguntó formalmente si hay gobernanza funcional en el banco.',
          branchNote:'Gobernanza cuestionada → Stage 4 con auditoría de gobierno corporativo',
          budgetNote:'La percepción de falta de gobernanza tiene costo regulatorio directo'
        },
        {
          text:'Emitir un comunicado del Gerente General respondiendo públicamente al directorio',
          sub:'Confrontacional · Hacer visible el conflicto interno para controlarlo',
          tier:'poor', points:30,
          cost:80000, penalty:300000, recovery:0,
          consequence:'El comunicado confirmó públicamente que había una crisis de gobernanza. El BCP inició una auditoría especial. Las agencias de rating pusieron al banco en observación.',
          branchNote:'Rating en observación → Stage 4 con crisis de reputación corporativa',
          budgetNote:'Hacer público el conflicto interno tiene el peor costo posible'
        },
      ]
    }
  },
  penalties:{poor:300000, ok:100000}
},

// ── STAGE 4: El rastro del dinero ─────────────────────
// (Rest of the stages follow...)
];