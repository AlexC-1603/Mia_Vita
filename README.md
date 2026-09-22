# Un universo para ti

Mini sitio web de regalo interactivo, inspirado en el formato "un universo para ti" (estrellas, corazón, planeta con flores).

## Cómo abrirlo
1. Descomprime la carpeta.
2. Ábrela en VS Code.
3. Haz doble clic en `index.html` (o usa la extensión "Live Server" de VS Code) para verlo en el navegador.

## Cómo personalizarlo
Todo lo editable está al inicio de `js/script.js`:

```js
const NOMBRE = "Andrea";
const REMITENTE = "Alejandro";

const MENSAJES_FLORES = [
  "Tu sonrisa ilumina cualquier lugar.",
  "Contigo hasta el silencio se siente bonito.",
  // ...agrega o quita las que quieras
];
```

- `NOMBRE`: la persona a quien se lo dedicas.
- `REMITENTE`: quién lo firma (aparece al final como "Con amor, ...").
- `MENSAJES_FLORES`: cada línea es el mensaje que aparece al tocar una flor del ramo. La cantidad de flores se ajusta sola según cuántos mensajes pongas. Si agregas más de 6 mensajes, súmale también una posición en `POSICIONES_FLORES` (arriba de `crearFlor` en `script.js`) para que no se amontonen.

Los textos de cada escena están en `index.html`, dentro de cada `<section class="scene">`, en párrafos `<p class="line">`. Puedes reescribirlos como quieras — solo evita borrar las clases (`line`, `delay-1`, etc.), porque controlan la animación de entrada.

Los colores (fondo, amarillo de las flores/estrellas, etc.) están como variables al inicio de `css/style.css`:

```css
:root {
  --bg: #05060c;
  --yellow: #ffd54f;
  ...
}
```

## Ideas para ampliarlo
- Agregar música de fondo con una etiqueta `<audio autoplay loop>` (usa una canción propia, sin derechos de autor de por medio).
- Agregar más escenas copiando la estructura de una `<section class="scene" data-scene="N">` y sumándola al flujo.
- Publicarlo gratis en Netlify o Vercel arrastrando la carpeta.
