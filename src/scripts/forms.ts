/**
 * Amélioration progressive des formulaires : intercepte l'envoi pour donner un retour
 * immédiat (envoi / succès / échec) sans recharger la page. Sans JavaScript, le
 * formulaire se soumet normalement vers /api/... qui redirige avec un statut en query string
 * (voir WaitlistForm.astro / StayRequestForm.astro, qui lisent déjà ce statut au rendu).
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
    feedback.classList.remove("text-terre-cuite");

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
        feedback.classList.add("text-terre-cuite");
      }
    } catch {
      feedback.textContent = labels.error;
      feedback.classList.add("text-terre-cuite");
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
