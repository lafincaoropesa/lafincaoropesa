interface LightboxItem {
  src: string;
  alt: string;
  caption: string;
}

function initLightbox(): void {
  const root = document.getElementById("lightbox");
  if (!root) return;

  const image = document.getElementById("lightbox-image") as HTMLImageElement | null;
  const caption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  if (!image || !caption || !closeBtn || !prevBtn || !nextBtn) return;

  let group: LightboxItem[] = [];
  let index = 0;
  let lastFocused: HTMLElement | null = null;

  function itemsForGroup(groupName: string): LightboxItem[] {
    const triggers = document.querySelectorAll<HTMLElement>(
      `[data-lightbox-trigger][data-lightbox-group="${groupName}"]`,
    );
    return Array.from(triggers).map((el) => ({
      src: el.dataset.lightboxSrc ?? "",
      alt: el.dataset.lightboxAlt ?? "",
      caption: el.dataset.lightboxCaption ?? "",
    }));
  }

  function render(): void {
    const item = group[index];
    if (!item) return;
    image.src = item.src;
    image.alt = item.alt;
    caption.textContent = item.caption;
  }

  function open(groupName: string, startIndex: number, trigger: HTMLElement): void {
    group = itemsForGroup(groupName);
    index = startIndex;
    lastFocused = trigger;
    render();
    root!.classList.remove("hidden");
    root!.classList.add("flex");
    root!.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn!.focus();
  }

  function close(): void {
    root!.classList.add("hidden");
    root!.classList.remove("flex");
    root!.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocused?.focus();
  }

  function step(delta: number): void {
    if (group.length === 0) return;
    index = (index + delta + group.length) % group.length;
    render();
  }

  document.addEventListener("click", (e) => {
    const trigger = (e.target as HTMLElement).closest<HTMLElement>("[data-lightbox-trigger]");
    if (!trigger) return;
    const groupName = trigger.dataset.lightboxGroup ?? "default";
    const groupTriggers = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-lightbox-trigger][data-lightbox-group="${groupName}"]`),
    );
    const startIndex = groupTriggers.indexOf(trigger);
    open(groupName, Math.max(startIndex, 0), trigger);
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  root.addEventListener("click", (e) => {
    if (e.target === root) close();
  });

  document.addEventListener("keydown", (e) => {
    if (root!.getAttribute("aria-hidden") === "true") return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
}

initLightbox();
