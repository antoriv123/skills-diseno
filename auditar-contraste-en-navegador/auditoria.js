(() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const cache = new Map();
  // Tailwind 4 devuelve los colores en oklch y una regex normal los destroza.
  // Se resuelven pintandolos en un canvas de 1x1 y leyendo el pixel, dos veces
  // (sobre negro y sobre blanco) para despejar tambien el alfa.
  function rgba(c) {
    if (cache.has(c)) return cache.get(c);
    cx.fillStyle = '#000'; cx.fillRect(0, 0, 1, 1);
    cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    const n = cx.getImageData(0, 0, 1, 1).data;
    cx.fillStyle = '#fff'; cx.fillRect(0, 0, 1, 1);
    cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    const b = cx.getImageData(0, 0, 1, 1).data;
    const a = 1 - (b[0] - n[0]) / 255;
    const v = a < 0.004 ? { r: 0, g: 0, b: 0, a: 0 }
                        : { r: n[0] / a, g: n[1] / a, b: n[2] / a, a };
    cache.set(c, v); return v;
  }
  const lin = (u) => { u /= 255; return u <= 0.03928 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const sobre = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const ratio = (x, y) => { const a = lum(x), b = lum(y); const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + 0.05) / (lo + 0.05); };

  // PRUEBA DE CONTROL. Si estos dos no salen, el script esta roto y no vale
  // mirar lo que diga del resto. Los numeros son los del brand kit v1.0.
  const control = [
    ['papel sobre navy', ratio(rgba('#F8F5F0'), rgba('#0A1A3D')), 15.7],
    ['tinta sobre papel', ratio(rgba('#1A1A1A'), rgba('#F8F5F0')), 16.0],
    ['plomo sobre papel', ratio(rgba('#5A5651'), rgba('#F8F5F0')), 6.7],
    ['verde sobre papel', ratio(rgba('#0E7B52'), rgba('#F8F5F0')), 4.9],
  ].map(([n, v, esperado]) => ({ n, medido: +v.toFixed(2), esperado, ok: Math.abs(v - esperado) < 0.15 }));
  if (control.some((c) => !c.ok)) return JSON.stringify({ ROTO: true, control });

  function pilaAFondo(pila) {
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let k = pila.length - 1; k >= 0; k--) base = sobre(pila[k], base);
    return base;
  }
  function porAncestros(el) {
    const pila = []; let n = el;
    while (n && n !== document.documentElement) {
      const c = rgba(getComputedStyle(n).backgroundColor);
      if (c.a > 0.004) { pila.push(c); if (c.a >= 0.999) break; }
      n = n.parentElement;
    }
    pila.push(rgba(getComputedStyle(document.body).backgroundColor || '#fff'));
    return pila;
  }
  // Subir por los ancestros no vale para la cabecera fija: el hero que tiene
  // debajo no es su padre. Cuando el elemento esta en pantalla se mira la pila
  // real de ese punto, que es lo que ve el ojo. Si no lo esta, ancestros.
  function fondoDe(el) {
    const r = el.getBoundingClientRect();
    const x0 = Math.max(r.left, 0), x1 = Math.min(r.right, innerWidth);
    const y0 = Math.max(r.top, 0), y1 = Math.min(r.bottom, innerHeight);
    if (x1 - x0 > 2 && y1 - y0 > 2) {
      const bajo = document.elementsFromPoint((x0 + x1) / 2, (y0 + y1) / 2);
      const i = bajo.indexOf(el);
      if (i !== -1) {
        const pila = [];
        // Desde el propio elemento, no despues: su fondo tambien cuenta.
        for (const n of bajo.slice(i)) {
          const c = rgba(getComputedStyle(n).backgroundColor);
          if (c.a > 0.004) { pila.push(c); if (c.a >= 0.999) break; }
        }
        if (pila.length && pila[pila.length - 1].a >= 0.999) return { bg: pilaAFondo(pila), via: 'punto' };
      }
    }
    return { bg: pilaAFondo(porAncestros(el)), via: 'ancestros' };
  }

  document.documentElement.style.scrollBehavior = 'auto';
  const fallos = [], exentos = [];
  let medidos = 0;
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('.sr-only')) continue;
    const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (!txt) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    let op = 1, n = el;
    while (n && n !== document.documentElement) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
    if (op < 0.02) continue;  // lo que no se ve no se mide

    // Se juzga el estado asentado: un texto a mitad de su fundido no es un
    // fallo de diseno, y la opacidad del barrido la manda el scroll.
    const { bg, via } = fondoDe(el);
    const cr = ratio(sobre(rgba(cs.color), bg), bg);
    const px = parseFloat(cs.fontSize), peso = parseInt(cs.fontWeight) || 400;
    const min = (px >= 24 || (px >= 18.66 && peso >= 700)) ? 3 : 4.5;
    medidos++;
    if (cr < min) {
      const fila = { txt: txt.slice(0, 44), cr: +cr.toFixed(2), min, px: +px.toFixed(1), via, y: Math.round(r.top + scrollY), sel: el.tagName + '.' + el.className.toString().slice(0, 34) };
      (el.closest('[aria-hidden="true"]') ? exentos : fallos).push(fila);
    }
  }
  return JSON.stringify({ scroll: Math.round(scrollY), control: control.map((c) => c.medido), medidos, fallos, exentos });
})()
