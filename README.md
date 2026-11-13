# Skills de diseño para Claude Code

Cuatro skills para que las interfaces que construye Claude Code no salgan con "cara de IA".

| Skill | Qué hace |
|---|---|
| `elegir-libreria-ui` | Antes de construir un componente (aviso, menú, diálogo, gráfico, lista larga...) elige la librería adecuada en vez de hacerlo a mano |
| `transitions-dev` | Transiciones CSS listas para usar: modales, desplegables, cambios de icono, check de éxito, error en formularios |
| `frontend-slides` | Presentaciones en HTML con animación |
| `auditar-contraste-en-navegador` | Mide el contraste real de los textos de una página ya publicada. Necesita [agent-browser](https://www.npmjs.com/package/agent-browser) (`npm install -g agent-browser`) |

## Instalar

1. Descarga el repo: botón verde **Code → Download ZIP**, o `git clone` con la URL de esta página.
2. Copia las 4 carpetas a la carpeta de skills de Claude Code. Si no existe, créala.
   - Windows: `C:\Users\<tu usuario>\.claude\skills\`
   - Mac: `~/.claude/skills/`
3. Abre una sesión nueva de Claude Code. Se activan solas cuando la tarea encaja, y también puedes llamarlas a mano con `/elegir-libreria-ui`, `/transitions-dev`, etc.

## Dos más que se instalan con un comando

Desde Claude Code:

- `/plugin install frontend-design@claude-plugins-official`: dirección visual (tipografía, composición).
- `/plugin install vercel@claude-plugins-official`: trae, entre otras, la de shadcn/ui.

## Créditos

- `elegir-libreria-ui` parte de `pick-ui-library` de Emil Kowalski (licencia MIT). El original está en `elegir-libreria-ui/ORIGINAL-emil-pick-ui-library.md`.
- `transitions-dev` viene de [transitions.dev](https://transitions.dev).
- `frontend-slides` viene de la colección Everything Claude Code.
- `auditar-contraste-en-navegador` es propia.
