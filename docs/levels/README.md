# Per-Level Development Records

Every newly developed level must use the same five-file structure:

```
docs/levels/levelN/
  STATE.md
  SPEC.md
  DESIGN.md
  GEOMETRY.md
  ASSETS.md
```

Start a future level by copying `docs/levels/_TEMPLATE/`.

Do not improvise a different documentation layout for each level.

Read order and authority:
1. project-wide `AGENTS.md`
2. `docs/DEVELOPMENT_PLAYBOOK.md`
3. `docs/WORK_PROGRESS.md`
4. active level `STATE.md`
5. `SPEC.md`
6. `GEOMETRY.md` / `ASSETS.md` as relevant
7. `DESIGN.md` for proposals/history

The purpose is to let a new developer, Chat or Work session resume development without depending on prior conversation memory.
