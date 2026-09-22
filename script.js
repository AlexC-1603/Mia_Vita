/* ======================================================
   PERSONALIZA AQUÍ
   ====================================================== */
const NOMBRE = "Fabiana";
const REMITENTE = "Alejandro";

// Un mensaje por flor. Puedes agregar o quitar líneas: la cantidad
// de mensajes define automáticamente cuántas flores hay en el ramo.
const MENSAJES_FLORES = [
  "Tu sonrisa ilumina cualquier lugar.",
  "Contigo hasta el silencio se siente bonito.",
  "Eres mi lugar favorito del universo.",
  "Cada día contigo se siente nuevo.",
  "Gracias por ser tan tú.",
  "Quiero seguir descubriendo el universo contigo."
];
/* ====================================================== */


/* ---------- 1. Poner el nombre donde corresponda ---------- */
document.getElementById("nombre-portada").textContent = NOMBRE + "...";
document.querySelectorAll(".nombre-inline").forEach(el => {
  el.textContent = NOMBRE;
});
document.getElementById("remitente").textContent = REMITENTE;


/* ---------- 2. Fondo de estrellas ---------- */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buildStars();
}

function buildStars() {
  const count = Math.floor((canvas.width * canvas.height) / 6000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + 0.3,
    phase: Math.random() * Math.PI * 2,
    speed: 0.01 + Math.random() * 0.02
  }));
}

let shootingStar = null;

function maybeSpawnShootingStar() {
  if (!shootingStar && Math.random() < 0.006) {
    const startX = Math.random() * canvas.width * 0.6;
    shootingStar = {
      x: startX,
      y: Math.random() * canvas.height * 0.3,
      vx: 6 + Math.random() * 4,
      vy: 3 + Math.random() * 2,
      life: 1
    };
  }
}

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f2eee4";
  for (const s of stars) {
    s.phase += s.speed;
    const twinkle = 0.55 + Math.sin(s.phase) * 0.45;
    ctx.globalAlpha = twinkle;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  maybeSpawnShootingStar();
  if (shootingStar) {
    const s = shootingStar;
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.vx * 6, s.y - s.vy * 6);
    ctx.stroke();

    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.02;
    if (s.life <= 0 || s.x > canvas.width || s.y > canvas.height) {
      shootingStar = null;
    }
  }

  requestAnimationFrame(drawFrame);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(drawFrame);


/* ---------- 3. Navegación entre escenas ---------- */
const scenes = Array.from(document.querySelectorAll(".scene"));
let current = 0;

function replayEntranceAnimations(scene) {
  scene.querySelectorAll(".line, .btn").forEach(el => {
    el.style.animation = "none";
    void el.offsetWidth; // fuerza reflow para reiniciar la animación
    el.style.animation = "";
  });
}

function goToScene(index) {
  scenes[current].classList.remove("active");
  current = index;
  scenes[current].classList.add("active");
  replayEntranceAnimations(scenes[current]);

  if (scenes[current].dataset.scene === "2") drawHeartConstellation();
}

document.querySelectorAll(".next-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (current < scenes.length - 1) goToScene(current + 1);
  });
});

document.getElementById("restart-btn").addEventListener("click", () => {
  floresVistas.clear();
  ultimaFlorIndex = null;
  mensajeFlorEl.classList.remove("show");
  mensajeFlorEl.textContent = "";
  continuarFloresBtn.classList.add("hidden");
  pintarRamo();
  goToScene(0);
});


/* ---------- 4. Constelación en forma de corazón ---------- */
function heartPoint(t) {
  // ecuación paramétrica clásica de corazón, reescalada al viewBox
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return {
    x: 150 + x * 7,
    y: 110 - y * 7
  };
}

function drawHeartConstellation() {
  const svg = document.getElementById("heart-constellation");
  svg.innerHTML = "";

  const steps = 14;
  const points = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    points.push(heartPoint(t));
  }

  points.forEach((p, i) => {
    const next = points[(i + 1) % points.length];
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "link");
    line.setAttribute("x1", p.x);
    line.setAttribute("y1", p.y);
    line.setAttribute("x2", next.x);
    line.setAttribute("y2", next.y);
    line.style.opacity = 0;
    line.style.transition = `opacity 300ms ease ${i * 60}ms`;
    svg.appendChild(line);
    requestAnimationFrame(() => (line.style.opacity = 1));
  });

  points.forEach((p, i) => {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("class", "point");
    dot.setAttribute("cx", p.x);
    dot.setAttribute("cy", p.y);
    dot.setAttribute("r", 2.6);
    dot.style.opacity = 0;
    dot.style.transition = `opacity 300ms ease ${i * 60}ms`;
    svg.appendChild(dot);
    requestAnimationFrame(() => (dot.style.opacity = 1));
  });
}


/* ---------- 5. Ramo de flores interactivo sobre el planeta ---------- */

// Dibuja los pétalos + centro dentro de un .flower-slot fijo
// (la "flor única" de las escenas 3, 5 y 7, que antes quedaba vacía).
function decorarFlorSlot(el, numPetalos = 6) {
  if (el.dataset.decorada) return;
  el.dataset.decorada = "1";
  for (let i = 0; i < numPetalos; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    const angle = (360 / numPetalos) * i;
    petal.style.transform = `rotate(${angle}deg) translate(9px) rotate(-${angle}deg)`;
    el.appendChild(petal);
  }
  const center = document.createElement("div");
  center.className = "flower-center";
  el.appendChild(center);
}
document.querySelectorAll(".flower-slot").forEach(el => decorarFlorSlot(el));


// Posiciones fijas (en % dentro del planeta) pensadas para que el ramo
// se vea ordenado y sin flores tapándose de forma rara. Si agregas más
// mensajes en MENSAJES_FLORES, agrega aquí una posición más.
const POSICIONES_FLORES = [
  { x: 50, y: 18 },
  { x: 30, y: 32 },
  { x: 70, y: 32 },
  { x: 18, y: 52 },
  { x: 82, y: 52 },
  { x: 50, y: 46 }
];

function crearFlor(container, index, xPct, yPct, numPetalos = 6) {
  const flower = document.createElement("div");
  flower.className = "flower";
  flower.style.left = xPct + "%";
  flower.style.top = yPct + "%";
  flower.style.zIndex = Math.round(yPct); // las de más abajo quedan al frente
  flower.style.setProperty("--flower-scale", (0.85 + ((index % 3) * 0.1)).toFixed(2));
  flower.style.animationDelay = (index * 120) + "ms";
  flower.dataset.index = index;

  for (let i = 0; i < numPetalos; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    const angle = (360 / numPetalos) * i;
    petal.style.transform = `rotate(${angle}deg) translate(9px) rotate(-${angle}deg)`;
    flower.appendChild(petal);
  }
  const center = document.createElement("div");
  center.className = "flower-center";
  flower.appendChild(center);

  container.appendChild(flower);
  return flower;
}

const floresContenedor = document.getElementById("flores-contenedor");
const mensajeFlorEl = document.getElementById("mensaje-flor");
const continuarFloresBtn = document.getElementById("continuar-flores");
const floresVistas = new Set();
let ultimaFlorIndex = null;

function pintarRamo() {
  floresContenedor.innerHTML = "";
  MENSAJES_FLORES.forEach((_, i) => {
    const pos = POSICIONES_FLORES[i % POSICIONES_FLORES.length];
    crearFlor(floresContenedor, i, pos.x, pos.y);
  });
}
pintarRamo();

function mostrarMensajeFlor(texto) {
  mensajeFlorEl.classList.remove("show");
  setTimeout(() => {
    mensajeFlorEl.textContent = texto;
    mensajeFlorEl.classList.add("show");
  }, 220);
}

floresContenedor.addEventListener("click", (e) => {
  const flor = e.target.closest(".flower");
  if (!flor) return;

  const index = Number(flor.dataset.index);
  ultimaFlorIndex = index;

  flor.classList.add("tocada");
  floresVistas.add(index);
  mostrarMensajeFlor(MENSAJES_FLORES[index]);

  if (floresVistas.size >= MENSAJES_FLORES.length) {
    continuarFloresBtn.classList.remove("hidden");
    replayEntranceAnimations(continuarFloresBtn.closest(".scene"));
  }
});


/* ---------- 6. Escena final: flores convertidas en estrellas ---------- */
const finalScene = document.querySelector('.scene[data-scene="6"]');
finalScene.querySelector(".next-btn").addEventListener("click", () => {
  // esparce pequeñas "flores-estrella" por toda la pantalla como despedida visual
  const layer = document.createElement("div");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.zIndex = "2";
  layer.style.pointerEvents = "none";
  document.body.appendChild(layer);

  for (let i = 0; i < 40; i++) {
    const star = document.createElement("div");
    star.className = "star-bloom";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 900 + "ms";
    layer.appendChild(star);
  }

  setTimeout(() => layer.remove(), 3000);
});
