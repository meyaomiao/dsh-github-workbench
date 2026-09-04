# Changelog

## 0.2.5

- ModuleLoader client id now comes from `package.json` `name`, so the Desktop 2.0.5 client-modules check passes. Closes the host-only 0.2.3 gap.
- Compatible with DeepSeek Harness `0.1.2-rc.1` (also `0.1.1-rc.2` / `0.1.2-alpha.4`). Use `dsh-better-sidebar@0.18.0` on that host.

## 0.2.4

- Compatible with DeepSeek Harness `0.1.2-alpha.4` (also `0.1.1-rc.2`).
- Drop `@deepseek-ai/dsh-client-runtime` from `dsh.client.inject` — that package was removed in DSH 0.1.2-alpha.1. Loader still waits on `dsh-better-sidebar`; Cordis `inject=['betterSidebar']` is unchanged.

## 0.2.3

- Issues/PR 全量列表与加载更多。
