# La Finca Oropesa

Site vitrine multilingue (ES/FR/EN) de La Finca Oropesa, domaine hôtelier en construction à La Calzada de Oropesa (Tolède, Espagne). Astro + TypeScript + Tailwind CSS, contenu en Markdown/JSON, déployé sur Vercel.

- Pour changer un texte, une photo, un tarif : voir [MODIFIER-LE-SITE.md](MODIFIER-LE-SITE.md).
- Pour mettre le site en ligne (Vercel + OVH) : voir [DEPLOIEMENT.md](DEPLOIEMENT.md).

## Développement

```bash
npm install
npm run dev
```

Le site est alors disponible sur `http://localhost:4321`.

## Commandes

| Commande | Action |
| :--- | :--- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production (bloque si des pages légales ont un TODO) |
| `npm run preview` | Prévisualiser le build de production |
| `npm run icons` | Régénère les favicons à partir du symbole du logo |
