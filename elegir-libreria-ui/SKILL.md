---
name: elegir-libreria-ui
description: Elige la librería correcta antes de construir un componente de UI (toast, aviso, drawer, menú, dropdown, diálogo, Cmd+K, gráfico, número animado, drag and drop, lista larga, tema oscuro, OTP) para que Claude no lo haga a mano y salga con "cara de IA". Usar cuando se vaya a crear o pulir un componente en cualquier proyecto web, o cuando diga "qué librería uso para", "elige librería", "esto huele a IA", "/elegir-libreria-ui".
---

# Elegir librería de UI

Base: `pick-ui-library` de Emil Kowalski (MIT, original en `ORIGINAL-emil-pick-ui-library.md` de esta carpeta, para comparar cuando él la actualice). Añadido: el marco del vídeo de Griffin Wooldridge (7 nov 2026) y unas reglas estéticas propias.

**Por qué existe:** cuando Claude construye un toast, un drawer o un menú desde cero, sale con estilos por defecto y sin los detalles (avisos que se amontonan, drawers que no se arrastran, menús que se rompen con teclado). Elegir librería antes de escribir el componente evita eso.

## Cómo usarla

1. **Identifica la tarea, no la librería que te nombran.** "Necesito un desplegable" es una tarea de componentes base, aunque pregunten por otra cosa.
2. **Mira el `package.json` primero.** Si el proyecto ya usa una librería de la lista, úsala. Si usa una alternativa (p. ej. react-window en vez de Virtuoso), dilo, pero no cambies la dependencia sin que te lo pidan.
3. **Recomienda una sola librería** con una frase de para qué sirve, e instálala por su CLI o registry si la tarea incluye construir. Sin menús de opciones cuando la lista tiene respuesta clara.
4. **Si la tarea no está en la lista**, dilo explícitamente y recomienda desde tu conocimiento, avisando de que sales de la lista.
5. **Nombra la librería en el código y en el commit**, para que la siguiente sesión la vea.

## Los 3 tipos

| Tipo | Qué aporta | Cuándo |
|---|---|---|
| **Base** | Comportamiento (teclado, foco, accesibilidad). El estilo lo pone el proyecto | El grueso de la app |
| **Especialista** | Un componente hecho muy bien | Avisos, Cmd+K, números, drag and drop |
| **Diseñado** | Componente ya estilizado que se copia al repo | Un momento concreto: hero, landing, pantalla de agente |

## La lista

### Componentes base

| Tarea | Librería |
|---|---|
| Diálogos, popovers, menús, selects, tabs sin estilo y accesibles | [Base UI](https://base-ui.com) |
| Lo mismo si el proyecto ya tiene shadcn | [shadcn/ui](https://ui.shadcn.com) (Radix o Base UI por debajo) |
| Menú de comandos (Cmd+K) | [cmdk](https://cmdk.paco.me) |
| Avisos / toasts | [Sonner](https://sonner.emilkowal.ski) |
| Código de verificación (OTP) | [input-otp](https://input-otp.rodz.dev) |
| Paneles de control para ajustar valores | [Leva](https://github.com/pmndrs/leva) (alternativa: [dialkit](https://joshpuckett.me/dialkit)) |
| Drawer que se arrastra desde abajo en móvil | [Vaul](https://vaul.emilkowal.ski). Ojo: su repo dice que no se mantiene (comprobado 2026-11-11). Funciona y lo usa el Drawer de shadcn, pero avisa antes de meterlo en un proyecto nuevo |

### Movimiento y visual

| Tarea | Librería |
|---|---|
| Animación general (springs, layout, entrada/salida) | [motion](https://motion.dev) |
| Números que cambian (saldos, precios, métricas) | [NumberFlow](https://number-flow.barvian.me) |
| Texto animado | [torph](https://torph.lochie.me/) |
| Globo 3D | [Cobe](https://cobe.vercel.app) |
| Imágenes OG dinámicas | [Satori](https://github.com/vercel/satori) |
| Resaltado de código | [shiki](https://shiki.style) |

motion solo cuando hacen falta springs, layout, salidas o gestos. Un hover o un fade va con transición CSS.

### Gráficos

| Tarea | Librería |
|---|---|
| Datos en tiempo real que se desplazan con el tiempo | [Liveline](https://github.com/benjitaylor/liveline) |
| Todo lo demás (dashboards, estáticos, interactivos) | [recharts](https://recharts.org) |

### Interacción y rendimiento

| Tarea | Librería |
|---|---|
| Drag and drop | [dnd kit](https://dndkit.com) |
| Listas o tablas de 1.000+ filas | [Virtuoso](https://virtuoso.dev) |

### Estado y estilos

| Tarea | Librería |
|---|---|
| Estado compartido | [zustand](https://zustand.docs.pmnd.rs) |
| Clases condicionales | [clsx](https://github.com/lukeed/clsx) |
| Variantes tipadas en Tailwind (tamaño, intención, estado) | [cva](https://cva.style) |
| Tema oscuro sin parpadeo al cargar | [next-themes](https://github.com/pacocoursey/next-themes) |

### Componentes diseñados (para momentos concretos)

| Tarea | Librería |
|---|---|
| Pantallas de producto con IA: texto en streaming, aprobaciones de agente, diffs | [Beautiful UI](https://beautifului.dev) |
| Efectos animados sobre shadcn (+150 gratis) | [Magic UI](https://magicui.design) |
| Efectos de landing: cards 3D, beams, marquees | [Aceternity](https://ui.aceternity.com) |
| Botones animados, efectos de texto, fondos interactivos | [RareUI](https://rareui.in) |
| Algo muy concreto sin casarse con una librería | [21st.dev](https://21st.dev) |

## Reglas estéticas (se aplican siempre)

- **shadcn por defecto ya es cara de IA.** Cambiar siempre radio, colores y tipografía con la marca del proyecto antes de dar nada por terminado.
- **Un solo momento llamativo por página.** Un hero animado o un fondo interactivo. Diez efectos es la nueva cara de IA.
- **Nada de gradientes en texto.** Color sólido.
- **Marca del proyecto:** usar siempre sus colores y tipografía, nunca los de por defecto de la librería.
- **Mobile-first** en producto de consumo; desktop-first en B2B.

## Errores típicos que hay que cazar

- **Avisos hechos a mano o con una librería de modales** → Sonner.
- **Desplegable o diálogo con `<div>` y foco gestionado a mano** → Base UI (o shadcn si ya está).
- **Número animado re-renderizando texto** → NumberFlow.
- **Lista de 1.000+ filas pintada entera** → Virtuoso antes que paginar a la fuerza.
- **Estado compartido pasado por props en cadena** → zustand.
- **Ternarios de `className` de tres niveles** → clsx, o cva si son variantes.
- **Pantalla de agente (aprobación, streaming, diff) inventada desde cero** → mirar Beautiful UI primero.
