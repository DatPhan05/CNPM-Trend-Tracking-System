const fields = [
  { id: "ai", fieldName: "Artificial Intelligence", description: "Models, automation, and research intelligence", momentum: 96 },
  { id: "medicine", fieldName: "Digital Medicine", description: "Clinical systems, diagnostics, and patient monitoring", momentum: 84 },
  { id: "energy", fieldName: "Energy Systems", description: "Storage, renewables, and grid optimization", momentum: 78 },
  { id: "materials", fieldName: "Materials Science", description: "Advanced materials and manufacturing", momentum: 72 }
];

const journals = [
  {
    journalId: "J-1001",
    title: "Journal of Research Analytics",
    fieldId: "ai",
    impactFactor: 9.8,
    articles: [
      { articleId: "A-4401", title: "Mapping foundation model adoption in scientific workflows", publicationDate: "2026-03-14", citations: 1284, authorId: "U-201" },
      { articleId: "A-4402", title: "Topic emergence detection across publication graphs", publicationDate: "2025-11-22", citations: 816, authorId: "U-204" }
    ]
  },
  {
    journalId: "J-1002",
    title: "Clinical Intelligence Review",
    fieldId: "medicine",
    impactFactor: 8.4,
    articles: [
      { articleId: "A-5120", title: "Clinical decision support systems in regional hospitals", publicationDate: "2026-01-18", citations: 642, authorId: "U-209" },
      { articleId: "A-5121", title: "Biomedical knowledge graphs for personalized oncology", publicationDate: "2025-08-09", citations: 731, authorId: "U-210" }
    ]
  },
  {
    journalId: "J-1003",
    title: "Energy Systems Review",
    fieldId: "energy",
    impactFactor: 7.6,
    articles: [
      { articleId: "A-6302", title: "A bibliometric view of clean energy storage", publicationDate: "2026-02-05", citations: 972, authorId: "U-214" },
      { articleId: "A-6303", title: "Green hydrogen systems and citation acceleration", publicationDate: "2025-09-17", citations: 584, authorId: "U-215" }
    ]
  },
  {
    journalId: "J-1004",
    title: "Advanced Materials Trends",
    fieldId: "materials",
    impactFactor: 7.1,
    articles: [
      { articleId: "A-7101", title: "Self-healing polymers in industrial research", publicationDate: "2026-04-02", citations: 511, authorId: "U-221" },
      { articleId: "A-7102", title: "High-entropy alloys across multidisciplinary teams", publicationDate: "2025-12-01", citations: 468, authorId: "U-222" }
    ]
  }
];

const trendData = [
  { date: "2022", fieldId: "ai", publicationCount: 118000, citationCount: 420000 },
  { date: "2023", fieldId: "ai", publicationCount: 138000, citationCount: 552000 },
  { date: "2024", fieldId: "ai", publicationCount: 169000, citationCount: 740000 },
  { date: "2025", fieldId: "ai", publicationCount: 219000, citationCount: 1120000 },
  { date: "2026", fieldId: "ai", publicationCount: 248930, citationCount: 1485000 },
  { date: "2026", fieldId: "medicine", publicationCount: 182400, citationCount: 960000 },
  { date: "2026", fieldId: "energy", publicationCount: 154800, citationCount: 782000 },
  { date: "2026", fieldId: "materials", publicationCount: 137900, citationCount: 688000 }
];

const users = [
  { userId: "U-201", name: "Dr. Minh Nguyen", email: "minh.nguyen@scipub.test", role: "Researcher", status: "Active" },
  { userId: "U-301", name: "Linh Tran", email: "linh.tran@scipub.test", role: "Editor", status: "Assigned" },
  { userId: "U-401", name: "Bao Pham", email: "bao.pham@scipub.test", role: "Admin", status: "Active" }
];

let savedSearches = [
  { id: "S-01", query: "field:Artificial Intelligence impactFactor > 8", owner: "U-201", status: "Active" },
  { id: "S-02", query: "citations > 900 publicationDate:2026", owner: "U-201", status: "Active" },
  { id: "S-03", query: "field:Energy Systems trend:growing", owner: "U-201", status: "Completed" }
];

let selectedJournalId = journals[0].journalId;
let activeRole = "researcher";

const pageTitle = document.querySelector("#pageTitle");
const activeRoleLabel = document.querySelector("#activeRole");
const views = [...document.querySelectorAll(".view")];
const navItems = [...document.querySelectorAll(".nav-item")];
const roleButtons = [...document.querySelectorAll(".role-button")];
const jumpButtons = [...document.querySelectorAll("[data-view-jump]")];
const metricSelect = document.querySelector("#metricSelect");
const trendChart = document.querySelector("#trendChart");
const fieldList = document.querySelector("#fieldList");
const journalSearch = document.querySelector("#journalSearch");
const fieldFilter = document.querySelector("#fieldFilter");
const journalList = document.querySelector("#journalList");
const journalDetail = document.querySelector("#journalDetail");
const detailTitle = document.querySelector("#detailTitle");
const trendTable = document.querySelector("#trendTable");
const reportButton = document.querySelector("#reportButton");
const reportTitle = document.querySelector("#reportTitle");
const reportBody = document.querySelector("#reportBody");
const reportTopField = document.querySelector("#reportTopField");
const savedSearchList = document.querySelector("#savedSearchList");
const clearSavedButton = document.querySelector("#clearSavedButton");
const saveSearchButton = document.querySelector("#saveSearchButton");
const editorJournalList = document.querySelector("#editorJournalList");
const assignJournalButton = document.querySelector("#assignJournalButton");
const userTable = document.querySelector("#userTable");
const addUserButton = document.querySelector("#addUserButton");

function getField(fieldId) {
  return fields.find((field) => field.id === fieldId);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function setView(viewName) {
  const target = document.querySelector(`#${viewName}View`);
  if (!target) return;

  views.forEach((view) => view.classList.toggle("active", view === target));
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.view === viewName));
  pageTitle.textContent = target.dataset.title;
}

function applyRole(role) {
  activeRole = role;
  activeRoleLabel.textContent = role.charAt(0).toUpperCase() + role.slice(1);
  roleButtons.forEach((button) => button.classList.toggle("active", button.dataset.role === role));

  navItems.forEach((item) => {
    const allowed = item.dataset.roles.split(" ").includes(role);
    item.classList.toggle("is-hidden", !allowed);
  });

  const activeItem = document.querySelector(".nav-item.active:not(.is-hidden)");
  if (!activeItem) {
    const firstAvailable = document.querySelector(".nav-item:not(.is-hidden)");
    setView(firstAvailable.dataset.view);
  }
}

function renderChart() {
  const metric = metricSelect.value;
  const aiData = trendData.filter((item) => item.fieldId === "ai");
  const max = Math.max(...aiData.map((item) => item[metric]));

  trendChart.style.setProperty("--bars", aiData.length);
  trendChart.innerHTML = aiData
    .map((item) => {
      const height = Math.max(8, Math.round((item[metric] / max) * 100));
      return `
        <div class="bar" title="${formatNumber(item[metric])}">
          <div class="bar-fill" style="height: ${height}%"></div>
          <span class="bar-label">${item.date}</span>
        </div>
      `;
    })
    .join("");
}

function renderFields() {
  fieldList.innerHTML = fields
    .map((field) => {
      return `
        <article class="field-row">
          <div class="field-row-header">
            <span>
              <strong>${field.fieldName}</strong><br />
              ${field.description}
            </span>
            <strong>${field.momentum}%</strong>
          </div>
          <div class="progress" aria-label="${field.fieldName} momentum">
            <span style="width: ${field.momentum}%"></span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderFieldOptions() {
  fieldFilter.innerHTML += fields.map((field) => `<option value="${field.id}">${field.fieldName}</option>`).join("");
}

function getFilteredJournals() {
  const query = journalSearch.value.trim().toLowerCase();
  const field = fieldFilter.value;

  return journals.filter((journal) => {
    const fieldName = getField(journal.fieldId).fieldName.toLowerCase();
    const matchesField = field === "all" || journal.fieldId === field;
    const matchesQuery =
      !query ||
      journal.title.toLowerCase().includes(query) ||
      fieldName.includes(query) ||
      journal.articles.some((article) => article.title.toLowerCase().includes(query));

    return matchesField && matchesQuery;
  });
}

function renderJournals() {
  const filtered = getFilteredJournals();

  if (filtered.length === 0) {
    selectedJournalId = null;
    journalList.innerHTML = `
      <div class="field-row">
        <strong>No journals found</strong>
        <div>Try another title, field, or article keyword.</div>
      </div>
    `;
    renderJournalDetail();
    return;
  }

  if (!filtered.some((journal) => journal.journalId === selectedJournalId)) {
    selectedJournalId = filtered[0].journalId;
  }

  journalList.innerHTML = filtered
    .map((journal) => {
      const field = getField(journal.fieldId);
      return `
        <button class="journal-card ${journal.journalId === selectedJournalId ? "active" : ""}" type="button" data-journal-id="${journal.journalId}">
          <span>
            <strong>${journal.title}</strong>
            ${journal.journalId} - ${field.fieldName}
          </span>
          <span class="impact-pill">IF ${journal.impactFactor}</span>
        </button>
      `;
    })
    .join("");

  renderJournalDetail();
}

function renderJournalDetail() {
  const journal = journals.find((item) => item.journalId === selectedJournalId);
  if (!journal) {
    detailTitle.textContent = "No journal selected";
    journalDetail.innerHTML = `
      <div class="detail-stat"><span>Result</span><strong>Empty</strong></div>
      <p>Search results will populate journalId, field, impactFactor, and related Article records here.</p>
    `;
    return;
  }

  const field = getField(journal.fieldId);
  detailTitle.textContent = journal.title;
  journalDetail.innerHTML = `
    <div class="detail-stat"><span>journalId</span><strong>${journal.journalId}</strong></div>
    <div class="detail-stat"><span>field</span><strong>${field.fieldName}</strong></div>
    <div class="detail-stat"><span>impactFactor</span><strong>${journal.impactFactor}</strong></div>
    <div class="article-list">
      ${journal.articles
        .map((article) => {
          return `
            <div class="paper-line">
              <span>
                <strong>${article.title}</strong><br />
                ${article.articleId} - ${article.publicationDate} - authorId ${article.authorId}
              </span>
              <strong>${formatNumber(article.citations)} citations</strong>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderTrendTable() {
  trendTable.innerHTML = trendData
    .map((item) => {
      return `
        <tr>
          <td>${item.date}</td>
          <td>${getField(item.fieldId).fieldName}</td>
          <td>${formatNumber(item.publicationCount)}</td>
          <td>${formatNumber(item.citationCount)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderSavedSearches() {
  savedSearchList.innerHTML = savedSearches
    .map((search) => {
      return `
        <article class="saved-card">
          <span>
            <strong>${search.id}</strong>
            ${search.query}
          </span>
          <span class="impact-pill">${search.status}</span>
        </article>
      `;
    })
    .join("");
}

function renderEditorJournals() {
  editorJournalList.innerHTML = journals
    .map((journal, index) => {
      return `
        <article class="editor-card">
          <span>
            <strong>${journal.title}</strong>
            assignedJournals[${index}] - ${getField(journal.fieldId).fieldName}
          </span>
          <span class="impact-pill">${journal.articles.length} articles</span>
        </article>
      `;
    })
    .join("");
}

function renderUsers() {
  userTable.innerHTML = users
    .map((user) => {
      return `
        <tr>
          <td>${user.userId}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${user.status}</td>
        </tr>
      `;
    })
    .join("");
}

navItems.forEach((item) => {
  item.addEventListener("click", () => setView(item.dataset.view));
});

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewJump));
});

roleButtons.forEach((button) => {
  button.addEventListener("click", () => applyRole(button.dataset.role));
});

metricSelect.addEventListener("change", renderChart);
journalSearch.addEventListener("input", renderJournals);
fieldFilter.addEventListener("change", renderJournals);

journalList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-journal-id]");
  if (!card) return;
  selectedJournalId = card.dataset.journalId;
  renderJournals();
});

saveSearchButton.addEventListener("click", () => {
  const query = journalSearch.value.trim() || "all journals";
  savedSearches = [
    { id: `S-${String(savedSearches.length + 1).padStart(2, "0")}`, query, owner: "U-201", status: "Active" },
    ...savedSearches
  ];
  renderSavedSearches();
  setView("saved");
});

clearSavedButton.addEventListener("click", () => {
  savedSearches = savedSearches.filter((search) => search.status !== "Completed");
  renderSavedSearches();
});

reportButton.addEventListener("click", () => {
  const top = trendData
    .filter((item) => item.date === "2026")
    .sort((a, b) => b.publicationCount - a.publicationCount)[0];
  const field = getField(top.fieldId);
  reportTitle.textContent = `${field.fieldName} Growth Summary`;
  reportTopField.textContent = field.fieldName;
  reportBody.textContent = `${field.fieldName} leads 2026 tracked output with ${formatNumber(top.publicationCount)} publications and ${formatNumber(top.citationCount)} citations. The report combines Analyze Trends with Analyze Field Data from the UML workflow.`;
});

assignJournalButton.addEventListener("click", () => {
  setView("search");
});

addUserButton.addEventListener("click", () => {
  users.push({
    userId: `U-${400 + users.length + 1}`,
    name: "New System User",
    email: `user${users.length + 1}@scipub.test`,
    role: "Researcher",
    status: "Pending"
  });
  renderUsers();
});

renderFieldOptions();
renderChart();
renderFields();
renderJournals();
renderTrendTable();
renderSavedSearches();
renderEditorJournals();
renderUsers();
applyRole(activeRole);
