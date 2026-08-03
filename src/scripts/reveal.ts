/** Ajoute .is-visible aux éléments .reveal quand ils entrent dans le viewport. */
function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>(".reveal");
  if (targets.length === 0) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 },
  );

  targets.forEach((el) => observer.observe(el));
}

// Ce script est chargé en <script type="module">, donc déjà différé après le parsing du DOM :
// pas besoin d'attendre un évènement de chargement pour trouver les éléments .reveal.
initReveal();
