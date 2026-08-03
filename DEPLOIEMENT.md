# Déploiement du site — guide pas à pas

Ce guide suppose que tu n'es pas développeur. Chaque étape est décrite pour être suivie sans connaissances techniques préalables.

## Avant de commencer : les données légales

**Le site refuse de se publier tant que les pages légales (Aviso legal, Politique de confidentialité, Politique de cookies) contiennent des données manquantes** (raison sociale, NIF/CIF, adresse, etc.). C'est une protection volontaire, pas un bug. Voir `MODIFIER-LE-SITE.md`, section "Pages légales", pour savoir comment les compléter. Tu peux développer et prévisualiser le site sans ces données ; tu ne peux pas le mettre en ligne sans elles.

## Étape 1 — Créer un compte Vercel et relier le dépôt

1. Le code du site doit d'abord être sur GitHub. Si ce n'est pas déjà fait, crée un dépôt (repository) sur [github.com](https://github.com) et envoie-y le code du projet (ton développeur ou toi-même via `git push`).
2. Va sur [vercel.com](https://vercel.com) et crée un compte (le plus simple : "Continue with GitHub", ça relie directement les deux comptes).
3. Sur le tableau de bord Vercel, clique sur **Add New… > Project**.
4. Choisis le dépôt GitHub du site dans la liste. Vercel détecte automatiquement qu'il s'agit d'un projet Astro — ne change rien aux réglages de build proposés.
5. Avant de cliquer sur "Deploy", ouvre la section **Environment Variables** et ajoute :
   - `RESEND_API_KEY` : la clé API de ton compte [Resend](https://resend.com) (nécessaire pour que les formulaires envoient des e-mails). Sans elle, le site fonctionne mais les formulaires afficheront une erreur.
6. Clique sur **Deploy**. Après une à deux minutes, le site est en ligne sur une adresse provisoire du type `lafincaoropesa.vercel.app`.

## Étape 2 — Vérifier le domaine dans Resend

Pour que les e-mails envoyés par les formulaires (depuis `no-responder@lafincaoropesa.com`) soient acceptés par les boîtes mail des destinataires, le domaine `lafincaoropesa.com` doit être vérifié dans Resend :

1. Dans le tableau de bord Resend, va dans **Domains > Add Domain** et entre `lafincaoropesa.com`.
2. Resend affiche une liste d'enregistrements DNS à ajouter (des enregistrements `TXT` et `MX` pour la vérification et l'anti-spam DKIM/SPF). Ajoute-les chez OVH de la même façon que les enregistrements de l'étape 3 ci-dessous (même interface).
3. Attends que Resend affiche le statut "Verified" en face du domaine (peut prendre quelques heures).

## Étape 3 — Configurer le domaine chez OVH

1. Connecte-toi à ton espace client [OVH](https://www.ovh.com/manager/), puis va dans **Web Cloud > Noms de domaine > lafincaoropesa.com > Zone DNS**.
2. Ajoute (ou modifie) les enregistrements suivants :

   | Type | Sous-domaine | Cible / Valeur |
   |---|---|---|
   | A | (laisser vide, ou `@`) | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com.` |

   Ces deux valeurs sont celles que Vercel utilise généralement pour connecter un domaine. **Vérifie-les dans Vercel avant de les saisir** : dans ton projet Vercel, va dans **Settings > Domains**, ajoute `lafincaoropesa.com` et `www.lafincaoropesa.com`, et Vercel affichera les valeurs exactes à utiliser si elles diffèrent de celles ci-dessus.
3. Supprime tout enregistrement A ou CNAME préexistant sur `@` et `www` qui pointerait ailleurs (par exemple une redirection OVH par défaut), sinon il entrera en conflit.
4. Enregistre les modifications.

## Étape 4 — Vérifier que tout fonctionne

- **Propagation DNS** : les changements peuvent mettre de quelques minutes à 24-48h à se propager selon les serveurs DNS. Tu peux suivre l'avancement sur [whatsmydns.net](https://www.whatsmydns.net) en entrant `lafincaoropesa.com` — quand la majorité des serveurs affichés dans le monde montrent `76.76.21.21`, c'est propagé.
- **Certificat HTTPS** : une fois le DNS propagé, Vercel génère automatiquement un certificat HTTPS (gratuit, via Let's Encrypt). Dans **Settings > Domains** de ton projet Vercel, le domaine passe du statut "Pending" à une coche verte "Valid Configuration" — c'est le signal que tout est actif. Aucune action de ta part n'est nécessaire pour le HTTPS lui-même.
- Une fois la coche verte affichée, visite `https://lafincaoropesa.com` dans un navigateur : le site doit s'afficher avec un cadenas dans la barre d'adresse.

## Et ensuite ?

Chaque fois que le code est mis à jour sur la branche principale du dépôt GitHub, Vercel reconstruit et republie automatiquement le site — il n'y a rien d'autre à faire pour mettre le site à jour après la première mise en ligne.
