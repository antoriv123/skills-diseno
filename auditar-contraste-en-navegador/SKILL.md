---
name: auditar-contraste-en-navegador
description: Mide el contraste real de todos los textos de una página ya renderizada, en el navegador, con agent-browser. Úsalo cuando haya que comprobar accesibilidad AA de una web propia, cuando el CSS venga de Tailwind 4 (que devuelve oklch), cuando haya elementos fijos o pegados cuyo fondo no es su padre, o cuando el usuario pida "verifica contrastes", "cumple AA", "se lee bien". No es para elegir colores: es para medir los que ya están puestos.
---

# Auditar contraste en el navegador

Esto no calcula contrastes a mano sobre los valores del diseño. Los mide sobre la
página renderizada, que es donde aparecen los problemas que el diseño no predice.

## Cuándo hace falta esto y no una tabla de colores

- **Tailwind 4 devuelve los colores en `oklch`.** Una regex normal los destroza. Aquí
  se resuelven pintándolos en un canvas de 1×1 y leyendo el píxel, dos veces (sobre
  negro y sobre blanco) para despejar también el alfa.
- **Los elementos fijos y pegados no se apoyan en su padre.** Una cabecera `fixed`
  transparente tiene debajo lo que haya en ese punto de la pantalla, que no es ningún
  ancestro suyo. Subir por el árbol da un resultado falso, casi siempre optimista.
- **Un color con alfa sobre otro color con alfa** hay que componerlo, no compararlo.

## Cómo se usa

```bash
agent-browser --session <nombre> set viewport 1440 900
agent-browser --session <nombre> open <url>
agent-browser --session <nombre> eval "$(cat auditoria.js)"
```

Devuelve JSON con `control`, `medidos`, `fallos` y `exentos`.

Hay que **barrer varias posiciones de scroll**, no medir solo arriba: lo que hay
debajo de una cabecera fija cambia según se baja, y ahí es donde salen los fallos.
Y hay que repetir el barrido en **móvil** y con **`set media reduced-motion`**, que
cambian qué reglas CSS se aplican.

```bash
for y in 0 400 900 1800 2700 3600 4500 5400 6300 7200 8100 9000; do
  agent-browser --session x eval "document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,$y)" >/dev/null
  sleep 0.3
  agent-browser --session x eval "$(cat auditoria.js)" | tail -1
done
```

## La prueba de control es lo importante

El script empieza midiendo cuatro pares de colores conocidos y **se niega a informar
de nada si no salen**. Sin eso no hay manera de distinguir "la página está bien" de
"mi script está roto", y las dos cosas se parecen mucho: devuelven pocos fallos.

Ajusta los cuatro pares a la paleta del proyecto que toque. Si el proyecto no tiene
contrastes ya calculados, sirven negro sobre blanco (21:1) y gris medio `#767676`
sobre blanco (4,54:1).

## Errores en los que ya se ha caído

- **Empezar la pila de fondos *después* del elemento.** El fondo del propio elemento
  también cuenta: un botón con relleno claro y texto oscuro sale 1:1 si te lo saltas.
- **Usar `elementsFromPoint` para elementos fuera de pantalla.** Solo ve lo que está
  en el viewport. Fuera de él hay que caer a los ancestros, y hay que comprobar que
  el elemento aparece de verdad en la pila (`indexOf !== -1`).
- **Medir un texto a mitad de un fundido** y llamarlo fallo de diseño. Se mide el
  estado asentado; lo que está animándose no se juzga.
- **`scroll-behavior: smooth` falsea el barrido:** pides 3.600 y mides en otro sitio.
  El script lo desactiva, pero conviene desactivarlo también en el bucle de fuera.

## Qué no es un fallo

Texto dentro de `[aria-hidden="true"]` que sea puramente decorativo (separadores,
marcas de agua) va a `exentos`, no a `fallos`. WCAG 1.4.3 exime además a los nombres
de marca y logotipos. Aun así, míralos: que algo esté exento no significa que se lea.

## Lo que suele encontrar y no se ve mirando

Un fundido de cabecera entre *tinta clara sobre fondo oscuro* y *tinta oscura sobre
fondo claro* **cruza por fuerza** un punto donde las dos luminancias coinciden. Ahí
el texto desaparece durante unos fotogramas. No se arregla acortando el fundido: se
arregla con `animation-timing-function: steps(1, end)`, que no tiene punto medio.
