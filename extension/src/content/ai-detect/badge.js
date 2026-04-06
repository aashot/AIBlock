const BADGE_ATTR = "data-aiblock-badge";
const WRAPPER_CLASS = "aiblock-badge-wrapper";
const PANEL_CLASS = "aiblock-signals";



function scoreClass(score) {
  if (score === 0) return "aiblock-badge--none";
  if (score <= 30) return "aiblock-badge--low";
  if (score <= 60) return "aiblock-badge--medium";
  return "aiblock-badge--high";
}

function createSignalPanel(signals) {
  const panel = document.createElement("div");
  panel.className = PANEL_CLASS;

  for (const sig of signals) {
    const row = document.createElement("div");
    row.className = "aiblock-signal-row";

    const label = document.createElement("span");
    label.className = "aiblock-signal-label";
    label.textContent = sig.label;

    const weight = document.createElement("span");
    weight.className = "aiblock-signal-weight";
    weight.textContent = `+${sig.weight}`;

    row.appendChild(label);
    row.appendChild(weight);
    panel.appendChild(row);
  }

  return panel;
}

export function attachBadge(post, scoreResult, onToggle) {
  if (post.querySelector(`[${BADGE_ATTR}]`)) return;
  let p = post.parentElement;
  while (p && p !== document.body) {
    if (p.querySelector(`:scope > .${WRAPPER_CLASS}`)) return;
    p = p.parentElement;
  }

  const { score, signals } = scoreResult;

  const wrapper = document.createElement("div");
  wrapper.className = WRAPPER_CLASS;

  const badge = document.createElement("div");
  badge.setAttribute(BADGE_ATTR, "true");
  badge.className = `aiblock-badge ${scoreClass(score)}`;
  badge.textContent = `AI: ${score}%`;
  badge.title = "Click to see what triggered this score";

  wrapper.appendChild(badge);

  let expanded = false;
  let panel = null;

  badge.addEventListener("click", (e) => {
    e.stopPropagation();
    if (score === 0) return;

    expanded = !expanded;
    badge.classList.toggle("aiblock-badge--active", expanded);

    if (expanded) {
      panel = createSignalPanel(signals);
      wrapper.appendChild(panel);
      onToggle(true);
    } else {
      if (panel) { panel.remove(); panel = null; }
      onToggle(false);
    }
  });

  post.insertBefore(wrapper, post.firstChild);
}

export function removeBadge(post) {
  const wrapper = post.querySelector(`.${WRAPPER_CLASS}`);
  if (wrapper) wrapper.remove();
}

export function removeAllBadges() {
  document.querySelectorAll(`.${WRAPPER_CLASS}`).forEach((w) => w.remove());
}
