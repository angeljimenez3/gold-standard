/* THE GOLD STANDARD — Member Area App
   Single-page app: login gate → dashboard / course player / exercise library.
   Progress + auth state persist in localStorage. Videos stream from Google Drive
   via the driveId values in content.js. */

(function () {
  const LS_AUTH = "gs.member";
  const LS_PROGRESS = "gs.progress";
  const LS_LAST = "gs.lastLesson";

  const $app = document.getElementById("app");

  /* ---------- state ---------- */
  const auth = () => { try { return JSON.parse(localStorage.getItem(LS_AUTH)); } catch { return null; } };
  const progress = () => { try { return JSON.parse(localStorage.getItem(LS_PROGRESS)) || {}; } catch { return {}; } };
  const saveProgress = (p) => localStorage.setItem(LS_PROGRESS, JSON.stringify(p));

  const lessonKey = (cid, n) => `${cid}:${n}`;
  const isDone = (cid, n) => !!progress()[lessonKey(cid, n)];
  const toggleDone = (cid, n) => {
    const p = progress();
    const k = lessonKey(cid, n);
    if (p[k]) delete p[k]; else p[k] = Date.now();
    saveProgress(p);
  };

  const flatLessons = (course) => course.modules.flatMap((m) => m.lessons);
  const courseById = (id) => COURSES.find((c) => c.id === id);

  /* ---------- per-track entitlements ---------- */
  const unlockedTracks = () => (auth() && auth().tracks) || [];
  const hasAccess = (cid) => unlockedTracks().includes(cid);
  const codeToTracks = (code) => CONFIG.accessCodes[code.trim().toUpperCase()] || CONFIG.accessCodes[code.trim()] || null;
  const addTracks = (tracks) => {
    const m = auth(); if (!m) return;
    m.tracks = [...new Set([...(m.tracks || []), ...tracks])];
    localStorage.setItem(LS_AUTH, JSON.stringify(m));
  };
  const driveIdOf = (lesson) => (lesson.shared ? SHARED[lesson.shared].driveId : lesson.driveId) || "";
  const courseProgress = (course) => {
    const all = flatLessons(course);
    const done = all.filter((l) => isDone(course.id, l.n)).length;
    return { done, total: all.length, pct: Math.round((done / all.length) * 100) };
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Official GS mark — same SVG as the sales page nav */
  const logoSvg = () => `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,2 93,20 98,50 93,80 50,98 7,80 2,50 7,20" fill="none" stroke="#E8C96A" stroke-width="5"/>
      <polygon points="50,12 83,26 87,50 83,74 50,88 17,74 13,50 17,26" fill="none" stroke="#E8C96A" stroke-width="3"/>
      <text x="50" y="62" text-anchor="middle" font-family="'Bebas Neue', sans-serif" font-size="42" font-weight="700" fill="#E8C96A" letter-spacing="2">GS</text>
    </svg>`;

  /* ---------- router ---------- */
  function route() {
    if (!auth()) { renderLogin(); return; }
    const h = location.hash || "#/dashboard";
    const parts = h.replace(/^#\//, "").split("/");
    if (parts[0] === "course" && parts[1]) {
      const course = courseById(parts[1]);
      if (course) { renderCourse(course, parts[2] ? parseInt(parts[2], 10) : null); return; }
    }
    if (parts[0] === "library") { renderLibrary(); return; }
    renderDashboard();
  }
  window.addEventListener("hashchange", route);

  /* ---------- chrome ---------- */
  function shell(active, inner) {
    const m = auth();
    return `
      <header class="topbar">
        <a class="logo" href="#/dashboard">
          <span class="logo-mark">${logoSvg()}</span>
          <span>THE GOLD STANDARD <span class="by">·</span></span>
        </a>
        <nav class="nav">
          <a href="#/dashboard" class="${active === "dash" ? "active" : ""}">Dashboard</a>
          ${COURSES.map((c) => `<a href="#/course/${c.id}" class="${active === c.id ? "active" : ""}">${hasAccess(c.id) ? "" : '<span class="nav-lock" aria-label="locked">🔒</span> '}${esc(c.navLabel)}</a>`).join("")}
          <a href="#/library" class="${active === "lib" ? "active" : ""}">Exercise Library</a>
        </nav>
        <div class="topbar-right">
          <span class="user-chip"><span class="dot"></span><span class="email">${esc(m.email)}</span></span>
          <button class="logout-btn" id="logoutBtn">Log out</button>
        </div>
      </header>
      ${inner}
      <nav class="mobile-nav">
        <a href="#/dashboard" class="${active === "dash" ? "active" : ""}">Home</a>
        ${COURSES.map((c) => `<a href="#/course/${c.id}" class="${active === c.id ? "active" : ""}">${esc(c.navLabel.replace("Lean ", ""))}</a>`).join("")}
        <a href="#/library" class="${active === "lib" ? "active" : ""}">Library</a>
      </nav>`;
  }

  function wireChrome() {
    const btn = document.getElementById("logoutBtn");
    if (btn) btn.onclick = () => { localStorage.removeItem(LS_AUTH); location.hash = ""; route(); };
  }

  /* ---------- login ---------- */
  function renderLogin() {
    $app.innerHTML = `
      <div class="login-wrap">
        <div class="login-card">
          <div class="logo-mark logo-mark--lg">${logoSvg()}</div>
          <h1>THE GOLD STANDARD</h1>
          <p class="sub">Member Area — by Hannah Goldy</p>
          <form id="loginForm">
            <div class="field">
              <label>Email</label>
              <input type="email" id="lEmail" placeholder="you@email.com" required />
            </div>
            <div class="field">
              <label>Access Code</label>
              <input type="password" id="lCode" placeholder="Your access code" required />
            </div>
            <button class="login-btn" type="submit">Enter</button>
            <p class="login-err" id="lErr">That access code isn't right. Check your welcome email.</p>
          </form>
          <p class="login-foot">Need help? <a href="mailto:${esc(CONFIG.supportEmail)}">${esc(CONFIG.supportEmail)}</a></p>
        </div>
      </div>`;
    document.getElementById("loginForm").onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById("lEmail").value.trim();
      const code = document.getElementById("lCode").value.trim();
      const tracks = codeToTracks(code);
      if (tracks) {
        localStorage.setItem(LS_AUTH, JSON.stringify({ email, tracks, at: Date.now() }));
        location.hash = "#/dashboard";
        route();
      } else {
        document.getElementById("lErr").style.display = "block";
      }
    };
  }

  /* ---------- dashboard ---------- */
  function renderDashboard() {
    const m = auth();
    const last = (() => { try { return JSON.parse(localStorage.getItem(LS_LAST)); } catch { return null; } })();
    const lastCourse = last && courseById(last.cid);
    const firstName = esc((m.email || "").split("@")[0]);

    const firstOwned = COURSES.find((c) => hasAccess(c.id)) || COURSES[0];
    const heroCta = (lastCourse && hasAccess(lastCourse.id))
      ? `<button class="continue-btn" onclick="location.hash='#/course/${lastCourse.id}/${last.n}'">Continue: ${esc(lastCourse.name)} — Lesson ${last.n} →</button>`
      : `<button class="continue-btn" onclick="location.hash='#/course/${firstOwned.id}/1'">Start with Lesson 1 →</button>`;

    $app.innerHTML = shell("dash", `
      <main class="page">
        <section class="dash-hero">
          <p class="eyebrow">MEMBER AREA</p>
          <h1 class="page-title">WELCOME BACK.</h1>
          <p class="page-sub">Three tracks. Twelve weeks each. Everything Hannah learned in 12 years as a professional athlete — structured so you can use it for life. Pick your track and keep showing up.</p>
          ${heroCta}
        </section>

        <a class="waitlist-banner" href="${esc(CONFIG.groupWaitlistUrl)}" target="_blank" rel="noopener">
          <div class="wb-text">
            <span class="wb-eyebrow">GROUP COACHING · 8-WEEK INTENSIVE</span>
            <span class="wb-line">Train directly with Hannah — advanced programming, every specialty covered, live group calls.</span>
          </div>
          <span class="wb-cta">Join the Waitlist →</span>
        </a>

        <p class="section-label">YOUR TRACKS</p>
        <div class="course-grid">
          ${COURSES.map((c) => {
            if (!hasAccess(c.id)) {
              return `
            <div class="course-card course-card--locked" onclick="location.hash='#/course/${c.id}'">
              <span class="badge">${esc(c.badge)} · <span class="lock-ico" aria-hidden="true">🔒</span> LOCKED</span>
              <h3>${esc(c.name).toUpperCase()}</h3>
              <p>${esc(c.tagline)}</p>
              <div class="unlock-row">
                <span class="member-deal"><s>${esc(c.price)}</s> <b>${esc(c.memberPrice)}</b> members</span>
                <span class="unlock-cta">Unlock →</span>
              </div>
            </div>`;
            }
            const pr = courseProgress(c);
            return `
            <div class="course-card" onclick="location.hash='#/course/${c.id}'">
              <span class="badge">${esc(c.badge)}</span>
              <h3>${esc(c.name).toUpperCase()}</h3>
              <p>${esc(c.tagline)}</p>
              <div class="progress-row">
                <div class="progress-track"><div class="progress-fill" style="width:${pr.pct}%"></div></div>
                <span>${pr.pct}%</span>
              </div>
              <span class="meta">${pr.done} of ${pr.total} lessons · ${c.weeks} weeks · 3 phases</span>
            </div>`;
          }).join("")}
        </div>

        <p class="section-label">EXERCISE DEMO LIBRARY</p>
        <div class="course-grid">
          <div class="course-card" onclick="location.hash='#/library'">
            <span class="badge">FORM REFERENCE</span>
            <h3>EVERY MOVEMENT, DEMONSTRATED</h3>
            <p>${EXERCISE_LIBRARY.length} exercise demos with Hannah's cues and the most common mistakes to avoid. Check your form any time, mid-workout.</p>
            <span class="meta">Browse by body part or search by name →</span>
          </div>
        </div>

        <p class="section-label">WORK WITH HANNAH</p>
        <div class="coach-grid">
          ${COACHING.map((k) => `
            <div class="coach-card ${k.featured ? "featured" : ""}">
              <span class="price">${esc(k.price)}</span>
              <h4>${esc(k.name)}</h4>
              <p>${esc(k.desc)}</p>
              <button class="coach-btn" onclick="location.href='mailto:${esc(CONFIG.supportEmail)}?subject=${encodeURIComponent(k.name)}'">${esc(k.cta)}</button>
            </div>`).join("")}
        </div>
      </main>`);
    wireChrome();
  }

  /* ---------- upgrade page (locked track) ---------- */
  function renderUpgrade(course) {
    $app.innerHTML = shell(course.id, `
      <main class="page">
        <div class="upgrade-wrap">
          <div class="upgrade-card">
            <span class="lock-ico-lg" aria-hidden="true">🔒</span>
            <p class="eyebrow">${esc(course.badge)} · NOT IN YOUR PLAN YET</p>
            <h1 class="page-title">${esc(course.name).toUpperCase()}</h1>
            <p class="page-sub" style="margin:14px auto 0">${esc(course.tagline)}</p>
            <ul class="upgrade-list">
              <li>17 video lessons with Hannah — full 12-week program in 3 phases</li>
              <li>The complete printable program PDF + workout log</li>
              <li>Nutrition lessons, eating guide, and calorie worksheet</li>
              <li>Full access to the ${EXERCISE_LIBRARY.length}-movement Exercise Demo Library</li>
            </ul>
            <div class="upgrade-price">
              <span class="was">${esc(course.price)}</span>
              <span class="now">${esc(course.memberPrice)}</span>
              <span class="deal-tag">MEMBERS SAVE 40%</span>
            </div>
            <a class="continue-btn" href="${esc(course.buyUrl)}" target="_blank" rel="noopener">Unlock ${esc(course.name)} →</a>
            <div class="code-redeem">
              <p class="code-label">ALREADY PURCHASED? ENTER YOUR ACCESS CODE</p>
              <div class="code-row">
                <input class="search-box" id="upCode" placeholder="Access code" aria-label="Access code" style="width:220px;margin:0" />
                <button class="coach-btn" id="upBtn">Unlock</button>
              </div>
              <p class="login-err" id="upErr">That code doesn't unlock this track. Check your purchase email.</p>
            </div>
          </div>
        </div>
      </main>`);
    wireChrome();
    document.getElementById("upBtn").onclick = () => {
      const tracks = codeToTracks(document.getElementById("upCode").value);
      if (tracks && tracks.includes(course.id)) {
        addTracks(tracks);
        renderCourse(course, null);
      } else {
        document.getElementById("upErr").style.display = "block";
      }
    };
  }

  /* ---------- course player ---------- */
  function renderCourse(course, lessonN) {
    if (!hasAccess(course.id)) { renderUpgrade(course); return; }
    const all = flatLessons(course);
    if (!lessonN) {
      const firstUndone = all.find((l) => !isDone(course.id, l.n));
      lessonN = (firstUndone || all[0]).n;
    }
    const lesson = all.find((l) => l.n === lessonN) || all[0];
    const idx = all.indexOf(lesson);
    const prev = all[idx - 1];
    const next = all[idx + 1];
    const pr = courseProgress(course);
    const did = driveIdOf(lesson);
    const done = isDone(course.id, lesson.n);
    const moduleOf = course.modules.find((mo) => mo.lessons.includes(lesson));

    localStorage.setItem(LS_LAST, JSON.stringify({ cid: course.id, n: lesson.n }));

    $app.innerHTML = shell(course.id, `
      <main class="page">
        <div class="course-layout">
          <aside class="syllabus">
            <div class="syllabus-head">
              <p class="eyebrow" style="margin-bottom:6px">${esc(course.badge)}</p>
              <p class="t">${esc(course.name).toUpperCase()}</p>
              <div class="progress-row p">
                <div class="progress-track"><div class="progress-fill" style="width:${pr.pct}%"></div></div>
                <span>${pr.done}/${pr.total}</span>
              </div>
              ${course.programPdf ? `<a class="syllabus-pdf" href="resources/${esc(course.programPdf)}" download target="_blank" rel="noopener"><span aria-hidden="true">⬇</span> Download the 12-Week Program (PDF)</a>` : ""}
            </div>
            ${course.modules.map((mo) => `
              <div class="module-group ${mo.lessons.includes(lesson) ? "open" : ""}">
                <button class="module-title">${esc(mo.module)} <span class="chev">▶</span></button>
                <div class="module-lessons">
                  ${mo.lessons.map((l) => `
                    <div class="lesson-row ${l.n === lesson.n ? "active" : ""} ${isDone(course.id, l.n) ? "done" : ""}" data-n="${l.n}">
                      <span class="check">${isDone(course.id, l.n) ? "✓" : ""}</span>
                      <span class="num">${l.n}</span>
                      <span>${esc(l.title)}</span>
                    </div>`).join("")}
                </div>
              </div>`).join("")}
          </aside>

          <section class="player-col">
            <div class="video-shell">
              ${did
                ? `<iframe src="https://drive.google.com/file/d/${esc(did)}/preview" allow="autoplay; fullscreen" allowfullscreen></iframe>
                   <button class="vs-close" type="button" aria-label="Exit full screen">✕</button>
                   <p class="vs-rotate">Turn your phone sideways for a bigger picture</p>`
                : `<div class="video-placeholder"><div class="inner">
                     <div class="vp-mark">${logoSvg()}</div>
                     <p class="vt">VIDEO COMING SOON</p>
                     <p class="vd">This lesson is being finalized. Check back shortly — you can keep moving through the written materials in the meantime.</p>
                   </div></div>`}
            </div>
            ${did ? `<div class="vs-bar"><button class="vs-expand" type="button">⤢ Full screen</button></div>` : ""}
            <div class="lesson-head">
              <div>
                <p class="crumb">${esc(moduleOf.module)} · LESSON ${lesson.n} OF ${all.length}</p>
                <h2>${esc(lesson.title).toUpperCase()}</h2>
              </div>
              <button class="complete-btn ${done ? "done" : ""}" id="markBtn">${done ? "✓ Completed" : "Mark Complete"}</button>
            </div>
            <p class="lesson-desc">${esc(lesson.desc)}</p>
            ${lesson.res && lesson.res.length ? `
              <div class="res-block">
                <p class="res-label">LESSON RESOURCES</p>
                <div class="res-row">
                  ${lesson.res.map((r) => `
                    <a class="res-btn" href="resources/${esc(r.file)}" download target="_blank" rel="noopener">
                      <span class="res-ico" aria-hidden="true">⬇</span>${esc(r.label)}
                    </a>`).join("")}
                </div>
              </div>` : ""}
            <div class="lesson-nav">
              <button ${prev ? "" : "disabled"} id="prevBtn"><span class="dir">← PREVIOUS</span>${prev ? esc(prev.title) : "—"}</button>
              <button ${next ? "" : "disabled"} id="nextBtn" style="text-align:right"><span class="dir">NEXT →</span>${next ? esc(next.title) : "—"}</button>
            </div>
          </section>
        </div>
      </main>`);
    wireChrome();

    document.querySelectorAll(".module-title").forEach((b) => {
      b.onclick = () => b.parentElement.classList.toggle("open");
    });
    document.querySelectorAll(".lesson-row").forEach((r) => {
      r.onclick = () => { location.hash = `#/course/${course.id}/${r.dataset.n}`; };
    });
    document.getElementById("markBtn").onclick = () => {
      toggleDone(course.id, lesson.n);
      renderCourse(course, lesson.n);
    };
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    if (prevBtn && prev) prevBtn.onclick = () => { location.hash = `#/course/${course.id}/${prev.n}`; };
    if (nextBtn && next) nextBtn.onclick = () => {
      if (!isDone(course.id, lesson.n)) toggleDone(course.id, lesson.n); // auto-complete on advance
      location.hash = `#/course/${course.id}/${next.n}`;
    };
  }

  /* ---------- exercise library ---------- */
  let libFilter = "All";
  let libSearch = "";

  function libList() {
    return EXERCISE_LIBRARY.filter((e) =>
      (libFilter === "All" || e.cat === libFilter) &&
      e.name.toLowerCase().includes(libSearch.toLowerCase())
    );
  }

  function libGridHtml(list) {
    if (!list.length) {
      return `<div class="lib-empty">
        <p class="t">NO MOVEMENTS MATCH</p>
        <p class="d">Try a different spelling, or clear the filter — every movement in the programs is in here.</p>
      </div>`;
    }
    return list.map((e) => `
      <div class="lib-card ${e.driveId ? "has-video" : ""}" data-i="${EXERCISE_LIBRARY.indexOf(e)}" role="button" tabindex="0" aria-label="Open demo: ${esc(e.name)}">
        <span class="cat-tag">${esc(e.cat)}</span>
        <span class="nm">${esc(e.name)}</span>
        <span class="status"><span class="s-dot"></span>${e.driveId ? "Watch demo" : "Coming soon"}</span>
      </div>`).join("");
  }

  function wireLibCards() {
    document.querySelectorAll(".lib-card").forEach((card) => {
      const open = () => openDemo(EXERCISE_LIBRARY[parseInt(card.dataset.i, 10)]);
      card.onclick = open;
      card.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } };
    });
  }

  function refreshLibGrid() {
    const list = libList();
    document.getElementById("libCount").textContent = `${list.length} movement${list.length === 1 ? "" : "s"}`;
    document.getElementById("libGrid").innerHTML = libGridHtml(list);
    wireLibCards();
  }

  function renderLibrary() {
    const cats = ["All", ...new Set(EXERCISE_LIBRARY.map((e) => e.cat))];
    const list = libList();

    $app.innerHTML = shell("lib", `
      <main class="page">
        <p class="eyebrow">FORM REFERENCE</p>
        <h1 class="page-title">EXERCISE DEMO LIBRARY</h1>
        <p class="page-sub">Every movement in the programs, demonstrated by Hannah — slow reps with cues, then training pace, plus the most common mistakes. Open any demo mid-workout to check your form.</p>
        <div class="res-row" style="margin-top:14px">
          <a class="res-btn" href="resources/exercise-library-index.pdf" download target="_blank" rel="noopener"><span class="res-ico" aria-hidden="true">⬇</span>Printable Exercise Index (PDF)</a>
        </div>

        <div class="filter-bar" role="group" aria-label="Filter by body part">
          ${cats.map((c) => `<button class="chip ${libFilter === c ? "active" : ""}" data-cat="${esc(c)}" aria-pressed="${libFilter === c}">${esc(c)}</button>`).join("")}
          <input class="search-box" id="libSearch" placeholder="Search exercises…" value="${esc(libSearch)}" aria-label="Search exercises" />
        </div>
        <p class="lib-count" id="libCount" aria-live="polite">${list.length} movement${list.length === 1 ? "" : "s"}</p>
        <div class="lib-grid" id="libGrid">${libGridHtml(list)}</div>
      </main>
      <div id="modalRoot"></div>`);
    wireChrome();

    document.querySelectorAll(".chip").forEach((c) => {
      c.onclick = () => {
        libFilter = c.dataset.cat;
        document.querySelectorAll(".chip").forEach((x) => {
          x.classList.toggle("active", x.dataset.cat === libFilter);
          x.setAttribute("aria-pressed", String(x.dataset.cat === libFilter));
        });
        refreshLibGrid();
      };
    });
    document.getElementById("libSearch").oninput = (e) => {
      libSearch = e.target.value;
      refreshLibGrid(); // grid-only refresh: input keeps focus, no page re-render
    };
    wireLibCards();
  }

  function openDemo(ex) {
    const root = document.getElementById("modalRoot");
    root.innerHTML = `
      <div class="modal-veil" id="veil">
        <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(ex.name)} demo">
          <div class="modal-head">
            <div><p class="t">${esc(ex.name).toUpperCase()}</p><p class="c">${esc(ex.cat)}</p></div>
            <div class="modal-actions">
              ${ex.driveId ? `<button class="vs-expand vs-expand--sm" type="button">⤢ Full screen</button>` : ""}
              <button class="modal-close" id="mClose" aria-label="Close demo">✕</button>
            </div>
          </div>
          <div class="video-shell">
            ${ex.driveId
              ? `<iframe src="https://drive.google.com/file/d/${esc(ex.driveId)}/preview" allow="autoplay; fullscreen" allowfullscreen></iframe>
                 <button class="vs-close" type="button" aria-label="Exit full screen">✕</button>
                   <p class="vs-rotate">Turn your phone sideways for a bigger picture</p>`
              : `<div class="video-placeholder"><div class="inner">
                   <div class="vp-mark">${logoSvg()}</div>
                   <p class="vt">DEMO COMING SOON</p>
                   <p class="vd">This demo clip is being filmed. It'll appear here automatically once it's uploaded.</p>
                 </div></div>`}
          </div>
        </div>
      </div>`;
    const opener = document.activeElement;
    const close = () => { exitTheater(); root.innerHTML = ""; if (opener && opener.focus) opener.focus(); };
    document.getElementById("mClose").focus();
    document.getElementById("mClose").onclick = close;
    document.getElementById("veil").onclick = (e) => { if (e.target.id === "veil") close(); };
    document.addEventListener("keydown", function esc2(e) {
      if (e.key !== "Escape" || document.body.classList.contains("vs-theater-open")) return;
      close(); document.removeEventListener("keydown", esc2);
    });
  }

  /* ---------- full screen video ---------- */
  function shellFor(btn) {
    const scope = btn.closest(".player-col, .modal");
    return scope ? scope.querySelector(".video-shell") : null;
  }
  function enterTheater(shell) {
    shell.classList.add("is-theater");
    document.body.classList.add("vs-theater-open");
    const x = shell.querySelector(".vs-close");
    if (x) x.focus();
  }
  function exitTheater() {
    const shell = document.querySelector(".video-shell.is-theater");
    if (shell) shell.classList.remove("is-theater");
    document.body.classList.remove("vs-theater-open");
  }
  function goFullscreen(shell) {
    const req = shell.requestFullscreen || shell.webkitRequestFullscreen;
    if (!req) { enterTheater(shell); return; }
    try {
      const p = req.call(shell);
      const lock = () => { try { screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").catch(() => {}); } catch (e) {} };
      if (p && p.then) p.then(lock).catch(() => enterTheater(shell)); else lock();
    } catch (e) { enterTheater(shell); }
  }
  document.addEventListener("click", (e) => {
    const expand = e.target.closest(".vs-expand");
    if (expand) { const shell = shellFor(expand); if (shell) goFullscreen(shell); return; }
    if (e.target.closest(".vs-close")) exitTheater();
  });
  // Registered before any demo opens, so it runs first: exit full screen and stop the
  // same Escape from also closing the demo popup underneath.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("vs-theater-open")) {
      e.stopImmediatePropagation();
      exitTheater();
    }
  });
  // Leaving the page or closing the demo while in theater mode must not leave scrolling locked
  window.addEventListener("hashchange", exitTheater);

  /* ---------- boot ---------- */
  route();
})();
