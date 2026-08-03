# Photos — comment ajouter ou remplacer une image

## État actuel

Ces dossiers sont **vides**. Le site affiche à leur place des blocs de réservation aux bonnes proportions (`PhotoPlaceholder`), jamais des photos de banque d'images génériques. Les vraies photos viennent de la galerie du photographe (SmugMug) et doivent être déposées ici manuellement — SmugMug bloque les accès automatisés.

## Où mettre quoi

| Dossier | Contenu |
|---|---|
| `domaine/` | Photos utilisées sur la page d'accueil (Le Domaine) |
| `oliveraie/` | Les 1 200 oliviers, la terre, la pierre — page L'Oliveraie |
| `suites/` | Futures suites (actuellement aucune photo disponible — voir Le Projet) |
| `spa/` | Réservé à la future page Le Spa (non publiée) |
| `table/` | Réservé à la future page La Table (non publiée) |
| `retraites/` | Réservé à la future page Les Retraites (non publiée) |

## Règle non négociable

Toutes les photographies actuellement disponibles montrent **l'ancienne finca, avant travaux**. Chaque photo affichée sur le site porte automatiquement la mention "La finca avant sa transformation" (dans la langue courante) via le composant `Photo.astro` — ne désactive jamais cette mention, c'est une exigence légale autant qu'éditoriale (voir le brief, §7).

## Nom de fichier

Minuscules, sans accents, mots séparés par des tirets. Exemples :

```
oliveraie/rangee-oliviers-lumiere-du-soir.jpg
domaine/facade-pierre-ancienne.jpg
```

## Ajouter une photo

1. Dépose le fichier dans le bon sous-dossier, au format JPEG ou PNG (le plus grand côté disponible, l'optimisation AVIF/WebP se fait automatiquement au build via le composant `<Image>` d'Astro).
2. Utilise le composant `Photo.astro` (`src/components/Photo.astro`) plutôt que `<img>` directement — il gère le disclaimer, le `alt`, et le clic pour agrandir en plein écran.
3. Remplace le `PhotoPlaceholder` correspondant dans la page par le composant `Photo`.

## Remplacer une photo existante

Remplace le fichier en gardant le même nom, ou change le chemin dans la page qui l'utilise.
