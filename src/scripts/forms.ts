/**
 * Amélioration progressive des formulaires : intercepte l'envoi pour donner un retour
 * immédiat (envoi / succès / échec) sans recharger la page. Sans JavaScript, le
 * formulaire se soumet normalement vers /api/... qui redirige vers la page de
 * confirmation dédiée (voir ConfirmationContent.astro), seule page du site rendue
 * à la demande pour pouvoir lire ce statut dans l'URL.
 */
interface FormLabels {
  submitting: string;
  success: string;
  error: string;
}

function enhanceForm(form: HTMLFormElement): void {
  const labels: FormLabels = JSON.parse(form.dataset.labels ?? "{}");
  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const feedback = form.querySelector<HTMLElement>(".form-feedback");
  const originalLabel = submitBtn?.textContent ?? "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!submitBtn || !feedback) return;

    submitBtn.disabled = true;
    submitBtn.textContent = labels.submitting;
    feedback.textContent = "";
    feedback.classList.remove("text-terre-cuite-texte");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const result = await response.json().catch(() => ({ ok: response.ok }));

      if (response.ok && result.ok) {
        feedback.textContent = labels.success;
        form.reset();
      } else {
        feedback.textContent = labels.error;
        feedback.classList.add("text-terre-cuite-texte");
      }
    } catch {
      feedback.textContent = labels.error;
      feedback.classList.add("text-terre-cuite-texte");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

function initForms(): void {
  document
    .querySelectorAll<HTMLFormElement>("[data-waitlist-form], [data-stay-request-form]")
    .forEach(enhanceForm);
}

initForms();
