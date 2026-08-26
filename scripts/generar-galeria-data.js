// Uso: node scripts/generar-galeria-data.js
// Escanea assets/img/galeria/<categoria>/ y genera el array `obrasGaleria`
// listo para pegar en assets/js/galeria-data.js. Ahorra escribir a mano
// cada foto cuando hay muchas.

const fs = require('fs');
const path = require('path');

const CARPETA_GALERIA = path.join(__dirname, '..', 'assets', 'img', 'galeria');

const categorias = fs.readdirSync(CARPETA_GALERIA).filter((nombre) =>
  fs.statSync(path.join(CARPETA_GALERIA, nombre)).isDirectory()
);

const obras = [];

categorias.forEach((categoria) => {
  const carpetaCategoria = path.join(CARPETA_GALERIA, categoria);
  const archivos = fs
    .readdirSync(carpetaCategoria)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  archivos.forEach((archivo) => {
    const nombreSinExtension = archivo.replace(/\.[^/.]+$/, '');
    const tituloLegible = nombreSinExtension
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (letra) => letra.toUpperCase());

    obras.push({
      imagen: `assets/img/galeria/${categoria}/${archivo}`,
      titulo: `"${tituloLegible}"`,
      autor: 'COMPLETAR nombre (edad)',
      categoria: categoria,
      etiqueta: categoria.replace(/-/g, ' '),
    });
  });
});

const salida = `export const obrasGaleria = ${JSON.stringify(obras, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, '..', 'obras-generadas.js'), salida);
console.log(`✅ Listo. Se generaron ${obras.length} obras en obras-generadas.js`);
console.log('Copiá ese array dentro de assets/js/galeria-data.js (reemplazando obrasGaleria) y completá el campo "autor" de cada una.');