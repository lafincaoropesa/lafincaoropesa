# Modifier le site — guide sans jargon

Ce guide explique comment changer les informations les plus courantes, fichier par fichier. Après chaque modification, si le site est en ligne sur Vercel et connecté à GitHub, il suffit d'enregistrer et d'envoyer (« push ») le changement : Vercel republie automatiquement le site en une à deux minutes.

## Changer un texte

Tous les textes du site (dans les trois langues) sont dans trois fichiers, un par langue :

- `src/i18n/es.json` (espagnol — langue par défaut)
- `src/i18n/fr.json` (français)
- `src/i18n/en.json` (anglais)

Ce sont des fichiers de texte structurés : chaque ligne a la forme `"nom-du-champ": "Le texte affiché sur le site"`. Cherche le texte que tu veux changer (Ctrl+F dans un éditeur de texte) et modifie uniquement ce qui est entre guillemets, sans toucher au reste de la ligne (les guillemets, les deux-points, la virgule à la fin). Fais le même changement dans les trois fichiers si le texte doit changer dans les trois langues — ce sont des adaptations, pas des traductions mot à mot, donc le texte n'est pas forcément identique d'une langue à l'autre.

**Important** : ne modifie jamais les fichiers dans `src/components/` ou `src/pages/` pour changer un texte — ce sont des fichiers de code qui vont chercher le texte dans les fichiers `.json` ci-dessus.

## Modifier un tarif, la saison d'ouverture, ou les coordonnées

Toutes les données factuelles du domaine (tarif, nombre de suites, e-mail, téléphone, adresse, distances depuis Madrid) sont regroupées dans un seul fichier :

`src/config/site.ts`

Chaque ligne est commentée. Par exemple, pour changer le tarif de départ :

```
priceFrom: 400,
```

Remplace `400` par le nouveau chiffre. Pour la saison d'ouverture, modifie les trois lignes (une par langue) :

```
openingSeason: {
  es: 'primavera de 2027',
  fr: 'printemps 2027',
  en: 'spring 2027',
},
```

## Ajouter ou remplacer une photo

Voir le guide détaillé dans `src/assets/photos/README.md`. En résumé :

1. Dépose le fichier image dans le bon sous-dossier de `src/assets/photos/` (`domaine/`, `oliveraie/`, `suites/`, `spa/`, `table/`, `retraites/`).
2. Dans la page concernée (dans `src/pages/es/`, `fr/`, `en/`), remplace le composant `<PhotoPlaceholder ... />` par `<Photo src={...} ... />` en suivant l'exemple donné dans le README des photos.

Tant qu'aucune photo définitive n'est déposée, le site affiche des blocs de réservation aux bonnes proportions — jamais de photo de banque d'images.

## Remplacer le logo (fichiers provisoires)

Le logo actuellement affiché est un **placeholder provisoire**. Voir `src/assets/logo/README.md` pour la marche à suivre complète. En résumé : remplace les 4 fichiers SVG/PNG dans `src/assets/logo/` en gardant exactement les mêmes noms, puis lance :

```bash
npm run icons
```

Cette commande régénère automatiquement tous les favicons du site à partir du nouveau symbole.

## Ajouter une catégorie de suite

Le site présente actuellement un seul type de suite (15 suites identiques, 2 personnes, un même tarif de départ). Quand les catégories seront définies (superficie, équipements, vue), il faudra :

1. Ajouter les données de chaque catégorie dans `src/config/site.ts` (une nouvelle structure à côté de `suites`).
2. Adapter la section "Quinze suites" dans `src/pages/{es,fr,en}/el-proyecto.astro` (et équivalents) pour afficher une carte par catégorie au lieu d'un seul bloc de texte.

C'est une modification de code, pas seulement de texte — fais-la accompagner par un développeur si tu n'es pas à l'aise avec les fichiers `.astro`.

## Activer une page à venir (Spa, Table, ou Retraites)

Ces trois pages ont leur contenu déjà écrit (dans les fichiers `.json`, sections `"spa"`, `"table"`, `"retraites"`) et leur gabarit déjà codé (`src/components/templates/UpcomingPageContent.astro`), mais elles ne sont pas publiées : aucune URL n'existe encore pour elles, volontairement, tant qu'il n'y a pas de photo à leur associer.

Pour publier par exemple la page Spa une fois les photos disponibles :

1. Dépose les photos dans `src/assets/photos/spa/`.
2. Crée un fichier `src/pages/es/el-spa.astro` avec ce contenu :

   ```astro
   ---
   import Layout from "../../layouts/Layout.astro";
   import UpcomingPageContent from "../../components/templates/UpcomingPageContent.astro";
   import { getDictionary } from "../../i18n/ui";

   const locale = "es" as const;
   const t = getDictionary(locale);
   ---

   <Layout locale={locale} routeKey="spa" title={t.spa.seoTitle} description={t.spa.seoDescription}>
     <UpcomingPageContent locale={locale} contentKey="spa" />
   </Layout>
   ```

3. Fais la même chose pour `src/pages/fr/le-spa.astro` et `src/pages/en/the-spa.astro` (change juste `locale` et `routeKey` reste `"spa"`).
4. Dans `src/config/site.ts`, passe `spa: true` dans `upcomingPages`.
5. Ajoute un lien vers la nouvelle page dans le menu (`src/components/Header.astro`, tableau `navItems`) si tu veux qu'elle soit accessible depuis la navigation.

Même procédure pour `table` (slugs `la-mesa` / `la-table` / `the-table`) et `retraites` (`los-retiros` / `les-retraites` / `the-retreats`).

## Pages légales

Les trois pages légales sont des fichiers Markdown, un par langue et par document, dans `src/content/legal/` :

```
src/content/legal/es/legal-notice.md
src/content/legal/es/privacy.md
src/content/legal/es/cookies.md
src/content/legal/fr/legal-notice.md
... (et en/)
```

Chaque fichier commence par un bloc comme celui-ci :

```
---
title: "Aviso legal"
todo: true
---
```

Remplace chaque `[TODO: ...]` dans le texte par la donnée réelle (raison sociale, NIF/CIF, adresse, etc. — voir DEPLOIEMENT.md et ton conseil juridique pour ces informations). **Une fois un document complet, passe `todo: true` à `todo: false`** dans son en-tête. Tant qu'un seul document a `todo: true`, le site refuse de se publier en production (voir plus bas).

## La vérification qui bloque la publication

La commande `npm run build` (utilisée aussi par Vercel à chaque déploiement) exécute d'abord un script qui vérifie qu'aucun document légal n'a `todo: true`. S'il en reste, le build échoue avec la liste exacte des fichiers à compléter. C'est volontaire : en Espagne, la loi (LSSI-CE) impose ces mentions dès la mise en ligne d'un site à finalité commerciale. Le site peut être développé et prévisualisé (`npm run dev`) sans ces données ; il ne peut pas être publié sans elles.

## Ajouter une quatrième langue (par exemple le portugais)

1. Copie `src/i18n/es.json` en `src/i18n/pt.json` et traduis/adapte chaque texte.
2. Dans `src/config/site.ts`, ajoute `'pt'` au tableau `LOCALES`.
3. Dans `src/i18n/routes.ts`, ajoute une entrée `pt: '...'` pour chaque page dans l'objet `ROUTES`.
4. Duplique les dossiers de pages `src/pages/es/` vers `src/pages/pt/` en adaptant les imports (`locale = "pt"`) et les noms de fichiers (slugs portugais).

Aucune autre modification n'est nécessaire : le sélecteur de langue, le sitemap et les balises hreflang s'adaptent automatiquement à la liste `LOCALES`.
