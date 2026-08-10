(() => {
  "use strict";
  const DATA = window.CONCERTS_DATA;
  if (!DATA) return;

  const state = { query: "" };
  const $ = (selector) => document.querySelector(selector);
  const number = (value) => new Intl.NumberFormat("en-US").format(value || 0);
  const date = (value) => value
    ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)).toUpperCase()
    : "—";

  function tile(item) {
    const link = document.createElement("a");
    link.className = "recording-tile";
    link.href = `https://drive.google.com/file/d/${encodeURIComponent(item.id)}/view`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Watch ${item.title} on Google Drive`);
    const index = document.createElement("span");
    index.textContent = String(item.order).padStart(2, "0");
    const title = document.createElement("strong");
    title.textContent = item.title;
    const action = document.createElement("small");
    action.textContent = "WATCH ON GOOGLE DRIVE ↗";
    link.append(index, title, action);
    return link;
  }

  function render() {
    const visible = DATA.items.filter((item) => item.title.toLocaleLowerCase().includes(state.query));
    const grid = $("#tileGrid");
    grid.replaceChildren(...visible.map(tile));
    $("#visibleCount").textContent = number(visible.length);
    $("#empty").hidden = visible.length !== 0;
  }

  $("#recordingCount").textContent = number(DATA.items.length);
  $("#updatedDate").textContent = date(DATA.updatedAt);
  $("#sourceFolder").href = `https://drive.google.com/drive/folders/${encodeURIComponent(DATA.sourceFolderId)}`;
  $("#search").addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLocaleLowerCase();
    render();
  });
  render();
})();
