# todo-poc

Expo Android 發布流程驗證專案。

## 環境

| Variant | Package | 用途 |
|---|---|---|
| development | `com.example.todopoc.dev` | dev client,連 Metro |
| preview | `com.example.todopoc.preview` | 獨立 APK,內部測試 |
| production | `com.example.todopoc` | AAB,Play Console |

## 常用指令

```bash
npm run start          # 啟動 Metro(development 變體)
npm run lint
npm run typecheck
npm run config:dev     # 檢視解析後的設定

eas build --platform android --profile development
eas build --platform android --profile preview
eas build --platform android --profile production
```

## 分支

- `main` → production
- `develop` → preview
- `feature/*` → PR 回 develop

## 版本管理

- `version`(使用者可見)手動維護於 `app.config.ts`
- `versionCode` 由 EAS 遠端管理(`appVersionSource: remote` + `autoIncrement`)

## Keystore

production keystore 已備份至密碼管理器。**遺失無法復原。**