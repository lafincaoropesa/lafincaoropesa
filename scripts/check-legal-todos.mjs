// Vérification bloquante : le build échoue si un document légal a encore `todo: true`
// dans son frontmatter (src/content/legal/**/*.md). Voir MODIFIER-LE-SITE.md.
// Ne bloque pas `npm run dev` : seulement `npm run build`, appelé aussi par Vercel au déploiement.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const legalDir = path.join(root, "src/content/legal");

function listMarkdownFiles(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return listMarkdownFiles(full);
    return full.endsWith(".md") ? [full] : [];
  });
}

const files = listMarkdownFiles(legalDir);
const pending = [];

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const match = content.match(/^todo:\s*(true|false)\s*$/m);
  if (match && match[1] === "true") {
    pending.push(path.relative(root, file));
  }
}

if (pending.length > 0) {
  console.error("\n✖ Publication bloquée : des pages légales contiennent encore des données manquantes (todo: true).\n");
  for (const file of pending) {
    console.error(`  - ${file}`);
  }
  console.error(
    "\nComplète ces documents (raison sociale, NIF/CIF, adresse, etc.) puis passe `todo: false` dans leur frontmatter avant de publier.\n" +
      "Voir MODIFIER-LE-SITE.md, section \"Pages légales\".\n",
  );
  process.exit(1);
}

console.log(`✓ Pages légales : aucun TODO en attente (${files.length} documents vérifiés).`);
