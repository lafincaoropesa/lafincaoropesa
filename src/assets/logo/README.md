# Logo — état actuel : PLACEHOLDER

Les 4 fichiers de ce dossier sont des **placeholders temporaires** (cercle + branche d'olivier abstraits en ocre, nom du domaine en police système). Ils ne sont pas les fichiers définitifs du client.

## Remplacer par les vrais fichiers

Quand tu récupères les fichiers définitifs, remplace ces 4 fichiers en gardant **exactement les mêmes noms** :

| Fichier | Usage |
|---|---|
| `lafincaoropesa-logo.svg` | Version complète (symbole + nom) — pied de page, page d'accueil |
| `lafincaoropesa-symbole.svg` | Olivier dans son cercle, format carré — en-tête, en-tête mobile |
| `lafincaoropesa-symbole-blanc.svg` | Variante monochrome blanche du symbole, pour fonds sombres |
| `lafincaoropesa-wordmark.svg` | Nom seul — en-tête sur grands écrans |
| `favicon-512.png` | Base des favicons (régénérée automatiquement, voir plus bas) |

Après le remplacement, régénère la série de favicons à partir du nouveau symbole :

```bash
npm run icons
```

Cette commande écrit dans `/public` : `favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`.

## Important — le wordmark

Le nom du domaine utilise une police Canva propriétaire, non disponible en webfont. **Le nom doit toujours être affiché via ce fichier SVG**, jamais recomposé en texte HTML — sauf pour le placeholder actuel, qui est du texte temporaire en attendant le vrai fichier vectorisé.
