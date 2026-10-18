<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All backend calls go through `src/lib/api.ts`; base URL and demo toggle live only in `src/lib/config.ts` — single switch point, no silent mock fallback in real mode.
- Only the six existing Express endpoints may be called — the backend is external and fixed.
- Demo data lives in `src/lib/mock-data.ts`, in memory only (never localStorage) — records must not persist in the browser.
