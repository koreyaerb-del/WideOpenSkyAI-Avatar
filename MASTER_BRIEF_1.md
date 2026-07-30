<!-- ============================================================= -->
<!--  WIDE OPEN SKY AI · CANONICAL MASTER BRIEF · reload instructions  -->
<!-- ============================================================= -->

# 🔁 How to reload this brief in a new chat

**This is the canonical, always-current master brief for Wide Open Sky AI's Live Avatar build.**
It lives at this stable link (overwrite this one file to update — the link never changes):

`https://raw.githubusercontent.com/koreyaerb-del/WideOpenSkyAI-Avatar/main/MASTER_BRIEF.md`

**To bring a new chat fully up to speed, paste this:**

> Read my Wide Open Sky AI master brief at
> https://raw.githubusercontent.com/koreyaerb-del/WideOpenSkyAI-Avatar/main/MASTER_BRIEF.md
> and get fully up to speed before we continue.

**Notes**
- If the link ever fails, just **attach this file** to the chat instead — that's the most reliable, exact-fidelity way.
- If your repo's default branch is `master` (not `main`), swap that word in the URL.
- **Keep it current:** at the end of each working session, ask Claude for the updated `MASTER_BRIEF.md` and re-upload it over this file. Same filename → same link.

---

# Wide Open Sky AI — LiveAvatar Pipeline · Master Build Brief

**Owner:** Korey Erb, Founder — Wide Open Sky AI (wideopenskyai.com), Prescott Valley, AZ
**Purpose of this file:** Paste this at the start of any new chat to bring Claude fully up to speed on the LiveAvatar → HubSpot lead pipeline build. Keep the canonical copy in the avatar-page GitHub repo (or a notes folder you connect), and update the Changelog at the bottom after each working session.
**Last updated:** 2026-07-27

> How to use: In a fresh chat, paste this whole file and say "Here's the current build state — let's continue." Claude does **not** have shared cross-chat memory in Cowork/Code sandboxes, so this file is the real continuity mechanism. It is meant to be inspectable and owned by Korey, not stored in an invisible memory system.

> ▶ **NEXT SESSION — START HERE (paused 2026-07-29):** All marketing/front-end pieces are DONE and live (avatar page v2, showcase, homepage banner → liveavatarinfo). **Next focus = build the DATA FLOW for the Live AI Avatar performance dashboard, wired to email + HubSpot — on WOSA's OWN account first ("eat our own dog food"), so every client demo shows a real working system with real data, not a mockup.** Plan: **(1)** run the LiveAvatar postMessage capture test to lock how session data is ingested; **(2)** Korey creates a **Supabase** account + project, then Claude supplies the DB schema + the avatar-page instrumentation snippet; **(3)** build **Make.com scenarios** that fetch each session transcript, summarize it with an LLM, and write to Supabase → push an **email/Gmail** alert (founder notification) and a **HubSpot** contact/deal record; **(4)** point the white-label dashboard at the live Supabase data. Dogfooding = the WOSA instance IS the demo instance shown to prospects. Full build plan in Section 6 ("Dashboard data pipeline"). **Also now locked (2026-07-30): the productized "Live Avatar Package" (3 client deliverables) + the KEY per-client page/dashboard TEMPLATE requirement (config-driven so we never hand-build each client) — see the "Productized Client Offering" section.** Reminder: NEVER ask Korey to share/screenshot API keys.

---

## 1 · What we're building (one paragraph)

An avatar-to-client lead system. Cold prospects (via Explee outreach) land on a HeyGen **LiveAvatar** page where **Jenny** (the WOSA voice agent) answers questions, qualifies interest, captures name/email/phone, and steers them to book a free 15-minute consult through an **on-page HubSpot scheduler modal** ("tap the green button"). Every completed conversation pushes contact info + transcript into **HubSpot CRM**, fires an instant founder alert email with an AI summary, feeds a performance **dashboard**, and triggers **Explee suppression** so booked/known prospects stop getting cold email. The whole stack is designed to later be white-labeled and replicated per client.

---

## 2 · Master data flow

```
Explee (cold email) → Prospect clicks link → Avatar Page (LiveAvatar embed + booking modal + page analytics)
     → Live Avatar Conversation with Jenny (answers FAQs, qualifies, captures name/email/phone, steers to consult)
         → "Yes, book now" → HubSpot Meeting Scheduler modal → Calendar Invite → Google Calendar
         → contact + transcript → HubSpot CRM (deal opened at "Consult Booked")
         → session report → Real-time founder alert email (AI summary)
         → every event → Dashboard App (event DB + white-label reporting UI)
     → Demo booked / contact created → Explee suppression (STOP follow-up emails)
Feedback loop: questions asked (incl. anonymous visitors) → tune Jenny's knowledge base → book more consults
```

---

## 3 · Current state (what's live / broken / decided)

**Live and working**
- Avatar page is live with Jenny embedded.
- Make.com scenario exists: Webhook trigger → HubSpot "Create Contact".
- Make.com webhook URL: `https://hook.us2.make.com/iw7opjvlz3yna8n338c4vr83xfgzo2x1`
- HubSpot connected to Make.com as "Korey's HubSpot CRM connection".
- Jenny updated to ask for name, email, phone after 1–2 questions.
- Avatar page (current, 2026-07-29 — Korey deploying via GitHub upload): headline → **"Meet Your LIVE AI Avatar"**; green box heading **"Talk with our LIVE AI Avatar now!"** (enlarged, mic icon + voice/text tips + scroll-to-avatar button); inline **banner** between green box and video → links to `wideopenskyai.com/liveavatarinfo`; header **"Learn More"** link to the same info page; YouTube overview video (ID `ZWaU7aYC22U`) between banner and avatar.
- **White-label dashboard mockup COMPLETE and demo-ready (2026-07-27):** brand-styled + animated, with KPI tiles, a six-stage funnel (Page visits → Browsed → Started a conversation → Partial → Captured → Booked), a weekly conversations-vs-contacts trend, top-questions + stall analytics, per-session **AI-summary cards** (with an outcome legend: Browsed / Partial / Captured / Booked), and a **Download report** button (PDF + CSV, by date range). Placeholder data; saved as a desktop artifact ("wosa-live-avatar-dashboard"). Next: connect live data.
- LiveAvatar plan: **Essential**, ~542 credits remaining (as of 2026-07-26). Usage is almost entirely FULL mode; a large session spike occurred the week of Jul 19.

**The problem we hit**
- The HeyGen webhook registered in the developer portal fires on **video-generation** events, **not** live-chat sessions — so the Make.com scenario never triggers during a real avatar conversation.
- LiveAvatar Essential has no built-in transcript email.

**Decisions locked**
- Avatar does NOT negotiate scheduling in-conversation at launch; it points to the on-page HubSpot scheduler modal. (Full conversational booking is a Version 2 investigation.)
- Dashboard lives OUTSIDE HubSpot as a white-label web app on Vercel/Netlify (+ small event DB, e.g. Supabase). GitHub Pages can't receive live data.
- Recording disclosure must be visible on the avatar page (e.g., "conversations are recorded to serve you better") — required for WOSA and every client deployment.

---

## 4 · Corrected technical design (verified against LiveAvatar docs, 2026-07-26)

This supersedes the earlier "poll the Sessions API hourly" plan. Two corrections:

**A. There is NO server-side webhook from LiveAvatar/HeyGen for live-chat session end.** Don't build around one.

**B. Capture sessions with the client-side event, not hourly polling.** LiveAvatar FULL-mode emits a real-time `session.stopped` event (via the LiveKit protocol) that includes `session_id` and `end_reason`. Because the avatar page is a site Korey controls, the plan is:

```
On the avatar page: listen for session.stopped → POST { session_id } to the Make.com webhook
Make.com: GET /v1/sessions/{session_id}/transcript  (header: X-API-KEY)
        → extract name/email/phone from transcript
        → create/update HubSpot contact + attach transcript & AI summary
        → email korey.erb@wideopenskyai.com the AI summary
```

Why not hourly polling: the sessions **list** endpoint (`GET /v1/sessions`) appears to return only *active* sessions, so an hourly poll would miss most already-ended conversations. (Validate this during build; if a completed-session list with date filtering exists, polling becomes a viable fallback.)

**C. CRITICAL CONSTRAINT (found 2026-07-27).** The avatar is embedded as a *third-party, cross-origin iframe* (`embed.liveavatar.com/v1/4105cefa-…`). The host page (liveavatar.wideopenskyai.com) is standalone HTML we control, but browsers block it from reading the iframe's internal `session.stopped` event. So event-driven capture only works if the embed **broadcasts events to the host via `window.postMessage`** — which is undocumented and unconfirmed. **NEXT:** run the browser-console postMessage test during a live session (paste a `window.addEventListener('message', …)` logger, run a session, check for events from `embed.liveavatar.com`). Outcome decides: (a) embed posts events → tiny host-page script forwards session_id to Make.com; (b) it posts nothing → rebuild the page with the LiveAvatar streaming SDK (native events) or fall back to polling.

**Verified LiveAvatar API facts**
- Base URL: `https://api.liveavatar.com`
- Auth header: `X-API-KEY` (never paste the key into chat — see operating rules)
- Sessions endpoints: `POST /v1/sessions/token`, `POST /v1/sessions` (start), `GET /v1/sessions` (list *active*), `GET /v1/sessions/{id}`, `DELETE /v1/sessions/{id}` (stop), `POST /v1/sessions/{id}/keep-alive`, `GET /v1/sessions/{id}/transcript`.
- Transcript response (`GET /v1/sessions/{id}/transcript`):
  ```json
  {
    "code": 0,
    "data": {
      "session_active": false,
      "next_timestamp": 0,
      "transcript_data": [
        { "role": "user|avatar", "transcript": "…", "absolute_timestamp": 0, "relative_timestamp": 0 }
      ]
    },
    "message": "…"
  }
  ```
- Optional query params on transcript: `start_timestamp`, `end_timestamp` (integers).

---

## 5 · Phased build plan

**Phase 1 — GLUE (now)**
- Avatar page live (done) + booking button/modal
- HubSpot scheduler + calendar invites
- Transcript emails / captures parsed into CRM (manual or Zapier to start)
- Manual Explee suppression checklist
- Custom subdomain for the avatar page

**Phase 2 — AUTOMATE**
- Auto contact + transcript into HubSpot (via the session.stopped → Make.com flow above)
- HubSpot write access (upgrade) or Zapier bridge
- Instant founder/sales-manager session alerts
- Automated Explee suppression on booking
- Follow-up email safety net automated

**Phase 3 — PRODUCTIZE**
- White-label dashboard app (Vercel/Netlify + DB, e.g. Supabase)
- Anonymous funnel + question analytics (the 100-interactions→10-contacts story)
- Client CRM connections → ROI/deals-closed view
- Multi-client architecture, per-client branding
- Replicate the whole stack per client

---

## 6 · Next steps (priority order)

**Korey's near-term priority framing (2026-07-27), in sequence:**
1. **Capture pipeline live** — connect Jenny → HubSpot for testing, with the session transcript pushed via HubSpot/Gmail to korey.erb@wideopenskyai.com.
2. **Separate white-label dashboard** — stand it up for WOSA first (our own live instance) so it can be demoed to prospective clients, then productize / white-label per client. Elevated priority: it's the core sellable + retention piece. Can begin as a static branded mockup before the live data exists.
3. **Explee.com (lead gen + targeting)** — once #1 and #2 work, fully investigate Explee and integrate it for appointment-setting and lead gathering, driving all traffic to liveavatar.wideopenskyai.com.

Detailed task list:

1. Test Jenny's contact collection on the live avatar page (does she reliably ask for name/email/phone after 1–2 questions, and does it land in the transcript?).
2. Confirm sessions are logged with retrievable session IDs — check **Usage → Table** view in app.liveavatar.com (the Graph view shows credits, not IDs).
3. Build the capture automation in Make.com using the **session.stopped → GET transcript → HubSpot → email** design (Section 4), not hourly polling.
4. Add the HubSpot meeting-scheduler booking button/modal to the avatar page (+ visible recording disclosure).
5. Set up Explee campaigns driving traffic to the avatar page — and verify suppression works (see checklist below) BEFORE paying for Explee.
6. Build dashboard.wideopenskyai.com (Supabase + Vercel), starting with page analytics + per-session detail.

**Dashboard data pipeline — build plan (Supabase + Vercel):**

Stack: **Supabase** (Postgres DB + auto REST API + realtime) for storage; **Vercel** hosts dashboard.wideopenskyai.com and serverless functions; **Make.com** stays as the glue that moves data into Supabase (it is not the database). Free tiers to start (~$0); ~$25/mo Supabase Pro + ~$20/mo Vercel Pro at productization.

Two data streams feed the dashboard:
- **Top-of-funnel (anonymous):** a small instrumentation script on the avatar page posts `page_view` / `engaged` / `chat_start` events to Supabase → fills Visits / Browsed / Started. Independent of the capture test — buildable anytime.
- **Session data:** on session end, get `session_id` → LiveAvatar `GET /v1/sessions/{id}/transcript` (server-side, `X-API-KEY`) → LLM summarizes + classifies outcome + extracts name/email/phone/company → write to Supabase, upsert HubSpot contact, email Korey. HubSpot "meeting booked" webhook flips outcome → Booked.

Sequenced build steps:
1. **Run the LiveAvatar postMessage capture test** — GATES how session data is ingested.
2. **Korey: create Supabase account + project.** Then Claude supplies the schema — `sessions` (id, started_at, ended_at, duration, name, email, phone, company, outcome, ai_summary, questions, transcript) and `events` (anon_id, session_id, type, ts).
3. **Add the page-instrumentation snippet** to the avatar page (funnel events). Claude can write this.
4. **Build the Make.com scenario(s):** fetch transcript → LLM summary/outcome → write Supabase + HubSpot + email. (Waits on step 1.)
5. **Deploy dashboard to Vercel,** swap placeholder data for live Supabase queries, point the DNS.
6. **Wire the HubSpot booked-webhook** to update outcomes.

Security: LiveAvatar API key + LLM key live **server-side only** (Vercel/Supabase env vars or the Make.com connection) — never in the avatar page. Korey enters keys himself.

Unblocked right now: steps 2 (schema) and 3 (instrumentation snippet) — Claude can produce both on request.

**Explee verification checklist (run during trial, before spending money):**
- Suppression / do-not-contact list — updatable via API or Zapier?
- Auto-remove a contact from an active sequence on reply, and on an external event (demo booked)?
- HubSpot integration: direct, via Zapier, or CSV-only?
- Reply detection + reply handling reliable?
- Actual daily send volume on the plan, and is deliverability managed (warmup/domains)?

---

## 7 · Tech details & accounts

- LiveAvatar API base: `https://api.liveavatar.com` · App: `app.liveavatar.com`
- Avatar page (current live URL): `https://liveavatar.wideopenskyai.com`
- Avatar page (blueprint target subdomain): `avatar.wideopenskyai.com` — **OPEN: confirm which is canonical** (affects DNS, embed, and every outbound link)
- Hosting now: GitHub Pages (static). Phase 3: consolidate page + dashboard on Vercel/Netlify.
- Avatar embed: cross-origin iframe `https://embed.liveavatar.com/v1/4105cefa-aa0d-4296-b95e-dad727111710` (an embed ID, not a self-minted session token — sessions are created inside the embed).
- Overview video: YouTube `ZWaU7aYC22U`, embedded on the avatar page.
- Page CTAs ("Free Consultation", "Contact Us") currently route to `wideopenskyai.com/blank-5` (Wix). No HubSpot booking button on the avatar page yet (Step 4).
- Brand palette (for booking modal / dashboard to match): navy `#0A0E1A`, card `#131929`, cyan `#00D4FF`, green `#1BAF7A`, purple `#8B5CF6`, amber `#EDA100`; fonts Rajdhani + Inter.
- Voice agent: "Jenny — Wide Open Sky Live Avatar"
- HeyGen developer portal: `app.heygen.com/developers` (webhook at `app.heygen.com/developers/webhook` — fires on video-gen events only; not used for live chat)
- Make.com webhook URL: `https://hook.us2.make.com/iw7opjvlz3yna8n338c4vr83xfgzo2x1`
- HubSpot ↔ Make.com connection name: "Korey's HubSpot CRM connection"
- Transcript/alert email: `korey.erb@wideopenskyai.com`
- Dashboard target: `dashboard.wideopenskyai.com` (Supabase + Vercel)

---

## 8 · Operating rules for working with Claude

- **Never ask Korey to share, paste, or screenshot API keys or secrets.** If a step needs a key, tell him where to enter it himself; work around it in examples with a placeholder like `YOUR_API_KEY`.
- **Screenshots are the primary way Korey shows state.** When a step depends on what a screen shows, ask for a screenshot of the specific page/panel and say exactly what to capture (e.g., "Make.com scenario canvas with the module list visible," "HubSpot workflow enrollment triggers," "LiveAvatar Usage → Table view"). Read carefully and confirm what you see before advising the next click.
- Prefer verifying young-product capabilities (LiveAvatar, Explee, HeyGen) against current docs during build — their features change fast.
- Keep this brief current: append a one-line entry to the Changelog whenever something material changes, and hand Korey the updated file to save.
- **END-OF-SESSION RITUAL (standing rule — don't wait to be asked):** After every significant work session, Claude regenerates the full `MASTER_BRIEF.md` — reload header + updated body + a fresh Changelog entry capturing the session's decisions and progress — and hands it to Korey to **re-upload over the GitHub file** (`koreyaerb-del/WideOpenSkyAI-Avatar` → `MASTER_BRIEF.md`). Same filename → same link, so the canonical brief always reflects the latest conversations. Proactively offer this near the end of a session; Korey shouldn't have to remember to ask.

---

## 9 · Open questions / decisions pending

- Canonical avatar subdomain: `liveavatar.` vs `avatar.` wideopenskyai.com?
- Does `GET /v1/sessions` return completed sessions (with date filtering), or active only? (Determines whether polling is a usable fallback.)
- HubSpot plan: does it allow the write access / associations we need, or is a Zapier bridge required for Phase 2?
- Section 1 of the Systems Blueprint ("The System at a Glance") contains a stray dictation artifact and should be rewritten to match the master diagram.
- **postMessage test result** (does `embed.liveavatar.com` broadcast session events to the host page?) — PENDING; decides the entire capture architecture.
- **Outreach tool CONFIRMED (2026-07-27): Explee.com** ("Xbleed"/"Xsplee" were dictation slips). Still to do: full capability investigation (suppression, HubSpot integration, reply handling, send volumes) per the Explee checklist in Section 6.
- **Recording disclosure** — the avatar page still says "Your conversation is confidential." This must be replaced with an accurate recording/data-use notice before driving traffic and capturing transcripts into HubSpot.

---

## Productized Client Offering — "Live Avatar Package" (defined 2026-07-30)

Every client — regardless of avatar type — gets **three deliverables** for a usage-based **monthly fee**, plus one-time **Setup ($750)** and **Discovery (from $500)**:

1. **Branded Banner** — a WOSA-built banner styled with THEIR avatar (like the WOSA homepage banner). The client's team places it on their own website; it links visitors to the client's live avatar page.
2. **Live AI Avatar on a white-label branded page** — hosted by WOSA at `liveavatar.wideopenskyai.com/<client>` (e.g., `/client1`). Branded with the client's logo, a "return to main website" button, and a few **limited, consistent** callout options. Part of WOSA hosting + monthly fee.
3. **White-label Performance Dashboard** — connected to their avatar, tracks all conversations, aggregates the questions visitors ask. Immediate access at launch.

**Done-for-you process (the sales narrative):**
1. Client picks their avatar (library / custom / cloned) and chooses **voice & personality**.
2. **Discovery phase** (from $500) — WOSA gleans FAQs, market/industry info, and company info to build the avatar's **knowledge base**.
3. WOSA programs the avatar (knowledge base + personality + voice).
4. WOSA **brands & launches** the client's avatar page, banner, and dashboard.
5. Ongoing tracking; a **30-day review session** to explain metrics and recommend how to grow traffic & conversations.

**Terms (MUST be in the contract):**
- **Usage-based pricing** — monthly fee includes a set of **Avatar Minutes**; cost scales up with usage (overage / tier upgrade). Must be written into contracts.
- **30-day notice to cancel** — practically a ~60-day minimum (e.g., launch Sept 1, notify Oct 1 → still pay through the following month). Gives clients time to learn/practice their avatar.
- WOSA provides **best-practices guidance** on promoting and "feeding" the avatar.

**Upsell doors:** on Basic, the client drives their own traffic — WOSA is **not responsible** for visitors on the basic package, but tracks everything and shows results. If they lack a traffic source, this opens **AI lead-gen** and other AI services. The 30-day review is the natural upsell moment.

**KEY ENGINEERING REQUIREMENT — per-client template (do NOT hand-build each client):**
- A **template system** to spin up each client's branded avatar page at `/<client>` from a simple input Korey supplies (logo, avatar embed ID, brand colors, return-URL, callouts).
- The **dashboard must support per-client, easily-updatable "top questions / stalling points"** (like WOSA's own) — swappable per client via config, **not** bespoke reprogramming.
- **Future idea — client selection page:** let clients preview/listen to HeyGen **voices** and browse **default-library avatar images** as a starting point before discovery.

**Dashboard access & security (STANDARD, decided 2026-07-30):** Standard = **individual per-user login (email + password / magic link) via Supabase Auth**, included in every plan. Confirmed feasible & essentially free: Supabase Auth is built in, Free tier covers **50,000 monthly active users** (WOSA needs a handful per client), Pro is $25/mo for 100k. **Row-Level Security (RLS)** isolates each client's data so no client can ever see another's — the real protection, beyond the login screen. Per-user accounts give **instant revoke** (solves the former-employee risk; a shared password can't). **Everything beyond that is an upcharge:** "Sign in with Microsoft" (Entra/Azure OAuth — moderate, per-client config) and full **SAML enterprise SSO** (large orgs, higher tier, IT coordination). Auth is built **once** into the per-client template and reused — near-zero marginal effort per client for the standard tier.

**Session continuity & visitor identity — best practices (2026-07-30):** LiveAvatar sessions are **stateless between sessions by default** — a returning visitor starts fresh; the avatar has no memory of a prior (e.g., idle-timed-out) conversation. True continuity ("welcome back, last time we discussed…") requires **identity + stored transcript + injecting a prior-conversation summary into the new session's context** — a build on the Supabase data layer, positioned as a **premium/advanced feature**, not standard. Identity options: **(a)** anonymous browser `visitor_id` (cookie/localStorage) to group repeat sessions **from the same device** for analytics — privacy-safe, no PII, but breaks across devices / incognito / cleared cookies; **(b)** **lead capture** (name/email) — the real solution, and it's already the business goal; once captured you can stitch sessions and personalize; **(c)** authenticated login (patient/employee portals) = reliable identity, custom. **Dashboard reports at the session + aggregate level:** anonymous sessions stay as separate records — that's fine, because the value is the **aggregate** (top questions, common "stalling"/drop-off points, volume, outcomes), not per-person tracking. **Client-facing message:** "Each conversation is handled as its own private session; the avatar doesn't retain memory between sessions by default. To recognize returning visitors or personalize, we identify them — usually by capturing their name/email (which also feeds your leads). Your dashboard's insights are aggregate — the patterns in what people ask and where they get stuck — so anonymous visits are still fully useful." **Compliance flag:** disclose recording/data use + get consent; sensitive verticals (healthcare/patients, employee data) need a proper privacy notice and possibly HIPAA/compliance review → treat identified/continuity flows there as **custom** (upcharge). Ties to the open **recording-disclosure** item and the **postMessage capture** architecture.

**Branding standard (2026-07-30):** ALL client-facing and internal deliverables carry the **WOSA branded header** (navy band + white "WIDE OPEN SKY AI" logo + right-aligned kicker). Logo asset was cropped & cleaned (luminance alpha) from a page screenshot into a transparent PNG; PDFs use a full-bleed navy HTML header band, Word docs use a shaded header table (`docx_header.js` helper). Korey can supply a higher-res/transparent original (PNG/JPEG) to swap in.

---

## Workflow tips (reusable)
- **Updating a file on GitHub Pages (best method):** Don't copy-paste the HTML into GitHub's web editor — this page embeds the avatar photos as base64, so it's long and pasting often corrupts/breaks. Instead, **upload the file**: repo → **Add file → Upload files** → drag the file in → **Commit to main**. Same filename replaces the old one. Live in ~1–2 min; check in an **incognito** window (avoids cache). The file must be named exactly **`index.html`**.
- **macOS "The name 'index.html' is already taken":** an old copy is already in that folder. Fastest fix: make a **new empty folder**, drag only the new file into it, and rename to `index.html` there (no conflict). Or trash the old copy first. Clearing out old downloads prevents the clash next time.

## Changelog
- **2026-07-30 (continuity system + branding + standing ritual)** — Stood up the canonical brief on GitHub: `MASTER_BRIEF.md` in repo `koreyaerb-del/WideOpenSkyAI-Avatar` (branch `main`); raw URL `https://raw.githubusercontent.com/koreyaerb-del/WideOpenSkyAI-Avatar/main/MASTER_BRIEF.md`. **Reload loop VERIFIED** — Claude fetched it back successfully. To reload a new chat, paste the phrase in this file's top header (or attach the file for exact fidelity). **Established standing rule: regenerate & re-upload `MASTER_BRIEF.md` after every significant work session** (see Operating rules §8). Also this session: branded ALL deliverables with the WOSA logo header (navy band; `docx_header.js` for Word, HTML band for PDFs); set dashboard-auth standard (Supabase per-user email+password login included, 50k MAU free tier, RLS data isolation, instant revoke; Microsoft/SAML SSO = upcharge); logged session-continuity & visitor-identity best practices (stateless by default; identity via lead capture / anon cookie / login; dashboard value is aggregate); delivered a combined branded client one-pager (package + Avatar Minutes + overages, 2-page PDF).
- **2026-07-30 (productized offering + pricing model + client docs)** — Locked the **"Live Avatar Package"** model: 3 client deliverables (branded banner, white-label avatar page at `liveavatar.wideopenskyai.com/<client>`, white-label dashboard) for a usage-based monthly fee + one-time Setup ($750) & Discovery (from $500). See new "Productized Client Offering" section for the full process, terms (usage-based escalation in contract; 30-day notice ≈ 60-day effective min; best-practices guidance; 30-day review), upsell path (AI lead gen), and the KEY per-client page/dashboard **TEMPLATE** requirement (config-driven, updatable top-questions/stalling-points per client) + future voice/image selection page. Finalized the client-facing usage metric **"Avatar Minutes"** (1 = 1 min conversation = 2 HeyGen Full-mode credits ≈ $0.20 cost); client tiers Basic $300/300 min, Growth $750/900 min, Premium $1,500/2,400 min; overage $0.50/$0.45/$0.40 per min. Documented **idle-timeout** cost logic (default 120s, set to 30–60s; abandoned sessions auto-close, so billed for real talk + short tail, not the full 20-min cap). Corrected **discovery-fee policy**: separate from-$500 fee (scales with content prep), NOT credited for standard/Basic, credited only as incentive on 3-month+ retainers. Delivered: client **plan-overview** handout (PDF), client **offering one-pager** (PDF), internal **Pricing & Cost Operations** doc (DOCX), and an AI-avatar **pricing benchmark** (MD + DOCX). Researched HeyGen LiveAvatar official tiers (Free/Starter/Essential $99·1k/Business $475·5k; Full 2cr/min, Lite 1cr/min) — Korey on Essential.
- **2026-07-29 (homepage banner + file system + next-phase set)** — Fixed the homepage "Learn About Our AI Avatars" banner (Wix HTML embed element on Home) to link to `https://www.wideopenskyai.com/liveavatarinfo` instead of the raw `liveavatar.wideopenskyai.com/showcase.html`. Reason confirmed visually: raw `showcase.html` has NO site header/nav (looks bare); the **liveavatarinfo** Wix page wraps the same content in the full WOSA header + menu + Free Consultation button — so that's the correct destination for all "Learn About Our AI Avatars" links. Delivered updated banner as `.html` and a `.txt` copy (double-click opens raw code, avoids the render-instead-of-code problem) for pasting into Wix → Settings → Code. Korey applied + published; **confirmed fixed**. Banner anchor uses `target="_top"` so it navigates the whole page, not just inside the embed iframe. Also delivered a tailored **File & Workflow System** doc (`WOSA_File_and_Workflow_System.md`): one `~/WideOpenSkyAI/` home w/ numbered rooms (00_Inbox…04_Archive), send Mac screenshots to Inbox not Desktop, deploy folder holds exactly one `index.html`, weekly 10-min reset, Research→Build→Deploy→Log rhythm. Offered to build the folder structure + sweep Desktop via the desktop connection next time. **Set next phase:** build the dashboard data flow + email + HubSpot on WOSA's own account (dogfooding for demos) — see START-HERE marker.
- **2026-07-29 (avatar page v2 deploy)** — Updated the live avatar page (`index.html`) per Korey's annotated screenshot: hero "Assistant"→**"Avatar"** ("Meet Your LIVE AI Avatar"); green box heading → **"Talk with our LIVE AI Avatar now!"** and enlarged (kept mic icon, body tips, scroll-to-avatar button); added an inline **banner** between the green box and the video (6 avatar faces + "Learn About Our AI Avatars" + green "Learn more →", mobile-stacks) linking to `https://www.wideopenskyai.com/liveavatarinfo`; added a header **"Learn More"** link to that same info page. Goal = two clear paths, less reading: (1) test the sample avatar, or (2) get more info via banner/header link. Delivered as drop-in `index.html` (~43KB); Korey deploying via GitHub upload. Built on the last uploaded index.html.
- **2026-07-29 (marketing showcase)** — Built a combined "showcase" HTML section (`wosa_showcase.html`): hero, auto-scrolling avatar library (3 types: Library / Custom-designed / Cloned), the Live Avatar→Real-Time Dashboard flow diagram (with an optional CRM tag: HubSpot/Salesforce/etc.), a LIVE animated mini performance-dashboard (KPIs count up + gently tick, funnel, trend), a modular services row, and a simple free-consult CTA (no pricing). All generic data, no personal identifiers. **Planned (Korey):** host it as its own page on liveavatar.wideopenskyai.com (or its own site), and possibly place the top section above the avatar on the avatar page. Deploy via host + iframe ("Embed a Site" in Wix) — file is ~343KB (embedded avatar photos), too large for Wix's paste-code embed.
- **2026-07-27 (dashboard + backend plan)** — Built the white-label dashboard (brand-styled, animated; funnel, trend, question analytics, AI-summary session cards, outcome legend, PDF/CSV download); saved as desktop artifact "wosa-live-avatar-dashboard". Defined the go-live backend plan: **Supabase** (DB) + **Vercel** (host) + **Make.com** (glue), two data streams and sequenced steps (Section 6). Set the "START HERE" resume marker at the top of this file.
- **2026-07-27 (priorities)** — Confirmed outreach tool = **Explee.com**. Logged Korey's near-term priority order: (1) Jenny→HubSpot capture + Gmail transcript push, (2) white-label dashboard (build for WOSA first as the demo instance, then productize per client), (3) Explee lead-gen integration driving traffic to the avatar page.
- **2026-07-27** — Updated avatar page (LIVE headline, YouTube overview video `ZWaU7aYC22U`, consolidated voice/text tip with blue "Chat now" pill + mic icons); delivered full drop-in index.html. Found the avatar is a cross-origin iframe embed → event capture needs a `postMessage` bridge (test pending). Logged outreach-tool name ambiguity (Explee / Xbleed / Xsplee) and the recording-disclosure fix.
- **2026-07-26** — Brief created. Verified LiveAvatar Sessions API; replaced "hourly polling" plan with client-side `session.stopped` → Make.com capture. Confirmed no live-chat server webhook exists. Logged open items (subdomain, sessions-list behavior, HubSpot write access).
