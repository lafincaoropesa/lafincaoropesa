// Regénère favicon-512.png, les favicons PNG et le site.webmanifest à partir du symbole SVG.
// À relancer avec `npm run icons` après avoir remplacé src/assets/logo/lafincaoropesa-symbole.svg
// par le vrai fichier fourni par le client.
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const symbolePath = path.join(root, "src/assets/logo/lafincaoropesa-symbole.svg");
const publicDir = path.join(root, "public");
const assetsLogoDir = path.join(root, "src/assets/logo");

mkdirSync(publicDir, { recursive: true });

const OCRE = "#CA7800";
const symboleSvg = readFileSync(symbolePath, "utf-8");

/** Compose le symbole sur un fond ocre carré, en blanc pour le contraste. */
function iconWithBackground(size) {
  const whiteSymbole = symboleSvg
    .replaceAll("#CA7800", "#F2EFE6")
    .replace(/width="\d+"/, `width="${Math.round(size * 0.62)}"`)
    .replace(/height="\d+"/, `height="${Math.round(size * 0.62)}"`);

  const inset = Math.round(size * 0.19);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="${OCRE}"/>
      <g transform="translate(${inset}, ${inset})">${whiteSymbole}</g>
    </svg>`,
  );
}

const sizes = [16, 32, 180, 192, 512];

for (const size of sizes) {
  const outName =
    size === 180
      ? "apple-touch-icon.png"
      : size === 512
        ? "icon-512.png"
        : size === 192
          ? "icon-192.png"
          : `favicon-${size}x${size}.png`;
  await sharp(iconWithBackground(size)).png().toFile(path.join(publicDir, outName));
}

// favicon-512.png à la racine des assets logo, comme référencé dans le brief.
await sharp(iconWithBackground(512)).png().toFile(path.join(assetsLogoDir, "favicon-512.png"));

// favicon.svg moderne (vectoriel, s'adapte à toutes les tailles).
writeFileSync(path.join(publicDir, "favicon.svg"), iconWithBackground(64).toString("utf-8"));

const manifest = {
  name: "La Finca Oropesa",
  short_name: "Finca Oropesa",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  theme_color: OCRE,
  background_color: "#F2EFE6",
  display: "standalone",
};
writeFileSync(path.join(publicDir, "site.webmanifest"), JSON.stringify(manifest, null, 2));

// Image Open Graph par défaut (1200x630), tant qu'aucune photo définitive n'est disponible.
const ogDir = path.join(publicDir, "og");
mkdirSync(ogDir, { recursive: true });
const ogSymbole = symboleSvg
  .replace(/width="\d+"/, `width="180"`)
  .replace(/height="\d+"/, `height="180"`);
const ogSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#DCD6C7"/>
    <g transform="translate(510, 160)">${ogSymbole}</g>
    <text x="600" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="#2E3524">La Finca Oropesa</text>
  </svg>`,
);
await sharp(ogSvg).jpeg({ quality: 85 }).toFile(path.join(ogDir, "default.jpg"));

console.log("Favicons générés dans /public à partir de", symbolePath);
