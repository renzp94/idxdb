# playground

> create-rzpack创建的React项目

## 开发

```bash
npm run dev
```
## 打包

```bash
npm run build
```

## Vscode 插件

- `Biome`
- `Stylelint`
- `CSS Modules`

## 配置 Vscode

在`Vscode`配置文件`settings.json`中添加如下配置

```json
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
    "source.fixAll": true
}
```

### 配置 Biome

在根目录下创建`.vscode/settings.json`
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "editor.codeActionsOnSave": {
    "quickfix.biome": true,
    "source.organizeImports.biome": true
  }
}
```


