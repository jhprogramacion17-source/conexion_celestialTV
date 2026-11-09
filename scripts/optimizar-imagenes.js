/**
 * @file optimizar-imagenes.js
 * @description Script para generar variantes optimizadas de imágenes (WebP y AVIF)
 * en resoluciones responsivas (480, 768, 1200, 1600 px) sin agrandar imágenes.
 * Genera dirección de arte para el Hero (horizontal y vertical).
 * Procesa las 10 imágenes de versículos y optimiza SVGs con svgo.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { optimize } from 'svgo';

const ROOT = process.cwd();
const TARGET_WIDTHS = [480, 768, 1200, 1600];

// ─── 1. UTILIDADES DE PROCESAMIENTO ─────────────────────────────────────────

async function processImage(inputPath, outputDir, baseName, widths = TARGET_WIDTHS, options = {}) {
  if (!fs.existsSync(inputPath)) {
    console.warn(`[Skip] File not found: ${inputPath}`);
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const meta = await sharp(inputPath).metadata();
  const origW = meta.width;

  console.log(`Processing: ${baseName} (Original: ${origW}x${meta.height})`);

  for (const w of widths) {
    if (w > origW) continue; // Nunca agrandar una imagen

    const pipeline = sharp(inputPath);
    if (options.crop) {
      pipeline.extract(options.crop);
    }
    pipeline.resize({ width: w, withoutEnlargement: true });

    // WebP q80
    const webpPath = path.join(outputDir, `${baseName}-${w}.webp`);
    await pipeline
      .clone()
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);

    // AVIF q55
    const avifPath = path.join(outputDir, `${baseName}-${w}.avif`);
    await pipeline
      .clone()
      .avif({ quality: 55, effort: 5 })
      .toFile(avifPath);
  }

  // Fallback optimizado JPEG o WebP default
  const defaultWebp = path.join(outputDir, `${baseName}.webp`);
  await sharp(inputPath)
    .resize({ width: Math.min(origW, 1200), withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(defaultWebp);

  const fallbackJpg = path.join(outputDir, `${baseName}-fallback.jpg`);
  await sharp(inputPath)
    .resize({ width: Math.min(origW, 1200), withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(fallbackJpg);
}

// ─── 2. HERO CON DIRECCIÓN DE ARTE ──────────────────────────────────────────

async function processHero() {
  const heroSrc = path.join(ROOT, 'assets/img/fondos/hero_portada.png');
  const outDir = path.join(ROOT, 'assets/img/fondos');

  if (!fs.existsSync(heroSrc)) {
    console.warn('Hero source not found');
    return;
  }

  const meta = await sharp(heroSrc).metadata();
  console.log(`\n=== Procesando Hero (Original: ${meta.width}x${meta.height}) ===`);

  // A. Versión Horizontal (Escritorio / Tablet Landscape: 768, 1200, 1448 px)
  const horizWidths = [768, 1200, 1448];
  for (const w of horizWidths) {
    if (w > meta.width) continue;

    const webpPath = path.join(outDir, `hero_portada-${w}.webp`);
    await sharp(heroSrc)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(webpPath);

    const avifPath = path.join(outDir, `hero_portada-${w}.avif`);
    await sharp(heroSrc)
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: 55, effort: 5 })
      .toFile(avifPath);
  }

  // Fallback JPG horizontal
  await sharp(heroSrc)
    .resize({ width: 1200 })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(outDir, 'hero_portada-fallback.jpg'));

  // B. Versión Vertical (Móvil Portrait: Recorte 9:16 centrado en la cruz y montañas)
  // De 1448x1086: un ancho de 610 da relación 610:1086 ≈ 9:16
  const cropW = Math.min(Math.round(meta.height * (9 / 16)), meta.width);
  const cropX = Math.round((meta.width - cropW) / 2); // Centrado horizontal
  const crop = { left: cropX, top: 0, width: cropW, height: meta.height };

  console.log(`Hero Mobile Crop: ${cropW}x${meta.height} at left ${cropX}`);

  const mobileWidths = [480, 768];
  for (const w of mobileWidths) {
    const webpMobile = path.join(outDir, `hero_portada_mobile-${w}.webp`);
    await sharp(heroSrc)
      .extract(crop)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(webpMobile);

    const avifMobile = path.join(outDir, `hero_portada_mobile-${w}.avif`);
    await sharp(heroSrc)
      .extract(crop)
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: 55, effort: 5 })
      .toFile(avifMobile);
  }

  // Fallback JPG móvil
  await sharp(heroSrc)
    .extract(crop)
    .resize({ width: 480 })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(outDir, 'hero_portada_mobile-fallback.jpg'));
}

// ─── 3. PROGRAMAS EN PAGES/PROGRAMAS.HTML ────────────────────────────────────

async function processProgramasCards() {
  const programasDir = path.join(ROOT, 'assets/img/programas');
  if (!fs.existsSync(programasDir)) return;

  const files = fs.readdirSync(programasDir).filter(f => f.endsWith('.jpg') && !f.includes('-'));
  console.log(`\n=== Procesando ${files.length} programas en pages/programas/ ===`);

  for (const f of files) {
    const base = path.parse(f).name;
    const input = path.join(programasDir, f);
    await processImage(input, programasDir, base, [480, 768, 1200]);
  }
}

// ─── 4. PROGRAMAS EN INDEX.HTML Y FONDOS ─────────────────────────────────────

async function processIndexCardsAndOthers() {
  const imgDir = path.join(ROOT, 'assets/img');

  console.log('\n=== Procesando imágenes de index.html y fondos ===');

  const contentImages = [
    { file: 'alabanza_grupal.png', dir: imgDir, base: 'alabanza_grupal', widths: [480, 768, 1200] },
    { file: 'programa_testimonios.jpg', dir: imgDir, base: 'programa_testimonios', widths: [480, 768, 1200] },
    { file: 'programa_oracion.jpg', dir: imgDir, base: 'programa_oracion', widths: [480, 768, 1200] },
    { file: 'programa_esperanza.jpg', dir: imgDir, base: 'programa_esperanza', widths: [480, 768, 1200] },
    { file: 'testimonios_hero.jpg', dir: imgDir, base: 'testimonios_hero', widths: [480, 768, 1200] },
    { file: 'fondos/fondo_cielo_sereno.png', dir: path.join(imgDir, 'fondos'), base: 'fondo_cielo_sereno', widths: [768, 1200, 1600] }
  ];

  for (const item of contentImages) {
    const input = path.join(imgDir, item.file);
    if (fs.existsSync(input)) {
      await processImage(input, item.dir, item.base, item.widths);
    }
  }

  // Directores
  const dirHombre = path.join(imgDir, 'directores/hombre.png');
  const dirMujer = path.join(imgDir, 'directores/mujer.png');
  if (fs.existsSync(dirHombre)) {
    await processImage(dirHombre, path.join(imgDir, 'directores'), 'hombre', [480, 768]);
  }
  if (fs.existsSync(dirMujer)) {
    await processImage(dirMujer, path.join(imgDir, 'directores'), 'mujer', [480, 768]);
  }
}

// ─── 5. IMÁGENES DE VERSÍCULOS (10 UNSPLASH) ────────────────────────────────

async function processVersiculos() {
  const unsplashDir = path.join(ROOT, '_originales/unsplash');
  const versiculosOutDir = path.join(ROOT, 'assets/img/versiculos');

  if (!fs.existsSync(versiculosOutDir)) {
    fs.mkdirSync(versiculosOutDir, { recursive: true });
  }

  console.log('\n=== Procesando 10 imágenes de Versículos a WebP ===');

  const mapping = {};
  const unUrls = [
    'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1438786657495-640937046d18?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  ];

  for (let i = 1; i <= 10; i++) {
    const src = path.join(unsplashDir, `versiculo-${i}.jpg`);
    if (!fs.existsSync(src)) continue;

    const base = `versiculo-${i}`;
    // 768px y 1200px WebP
    await sharp(src)
      .resize({ width: 768, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(versiculosOutDir, `${base}-768.webp`));

    await sharp(src)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(versiculosOutDir, `${base}-1200.webp`));

    // Default 1200px
    await sharp(src)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(versiculosOutDir, `${base}.webp`));

    // Fallback jpg
    await sharp(src)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(versiculosOutDir, `${base}.jpg`));

    mapping[unUrls[i - 1]] = `assets/img/versiculos/${base}.webp`;
  }

  // Actualizar versiculos.json
  const jsonPath = path.join(ROOT, 'assets/data/versiculos.json');
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    let updated = 0;
    data.versiculos.forEach(v => {
      if (mapping[v.imagenUrl]) {
        v.imagenUrl = mapping[v.imagenUrl];
        updated++;
      }
    });
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Actualizadas ${updated} referencias de imágenes en versiculos.json hacia assets/img/versiculos/`);
  }
}

// ─── 6. OPTIMIZACIÓN DE SVGs CON SVGO ───────────────────────────────────────

async function processSvgs() {
  const iconsDir = path.join(ROOT, 'assets/img/icons');
  if (!fs.existsSync(iconsDir)) return;

  const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));
  console.log(`\n=== Optimizando ${files.length} iconos SVG con SVGO ===`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const f of files) {
    const full = path.join(iconsDir, f);
    const content = fs.readFileSync(full, 'utf8');
    totalBefore += content.length;

    const result = optimize(content, {
      path: full,
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false, // OBLIGATORIO: Mantener viewBox
              cleanupIds: false
            }
          }
        }
      ]
    });

    if (result.data) {
      fs.writeFileSync(full, result.data, 'utf8');
      totalAfter += result.data.length;
    }
  }

  console.log(`SVGs optimizados: ${(totalBefore / 1024).toFixed(1)} KB -> ${(totalAfter / 1024).toFixed(1)} KB (Ahorro: ${(100 - (totalAfter/totalBefore)*100).toFixed(1)}%)`);
}

// ─── EJECUCIÓN PRINCIPAL ────────────────────────────────────────────────────

async function main() {
  console.log('Iniciando optimización completa de imágenes...');
  const t0 = Date.now();

  await processHero();
  await processProgramasCards();
  await processIndexCardsAndOthers();
  await processVersiculos();
  await processSvgs();

  console.log(`\nOptimización completada con éxito en ${((Date.now() - t0) / 1000).toFixed(1)} segundos.`);
}

main().catch(err => {
  console.error('Error durante la optimización de imágenes:', err);
  process.exit(1);
});

