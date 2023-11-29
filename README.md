# 使用Vue.js技术栈搭建的一个网页应用（**PWA**）

## 使用如下技术栈
- Vue.js
- Vite
- Vue Router
- Naive UI

## 建议的IDE环境

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## `.vue` 文件中 `ts` 语言的 `import` 类型检查支持

TypeScript 默认不处理 `.vue` 文件中的 `import` 语句，因此，为了进行类型检查，需要将 `tsc CLI` 替换为 `vue-tsc`。在编辑器中，需要安装拓展 [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) 来让 TypeScript 语言处理 `.vue` 类型的文件。

如果独立的 TypeScript 插件对你来说不够快速，Volar 也实现了称为 [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) 的一种性能更优秀的模式. 你可以通过以下方式启用它：
1. 禁用内置的 TypeScript 拓展
    1) 在 VS Code 的命令面板中运行 `Extensions: Show Built-in Extensions`
    2) 找到 `TypeScript and JavaScript Language Features`，右键点击并选择 `Disable (Workspace)`
2. 在 VS Code 的命令面板中运行 `Developer: Reload Window` 以重启 VS Code 窗口

## 自定义配置

参见 [Vite Configuration Reference](https://vitejs.dev/config/)

## 项目命令

### 项目设置

```sh
npm install
```

### 开发环境编译运行并使用热更新（使用 [Vite.js](https://vitejs.dev/) ）

```sh
npm run dev
```

### 进行类型检查、构建并缩减文件体积用于生产环境部署

```sh
npm run build
```

### 使用 [Vite.js](https://vitejs.dev/) 进行本地部署预览

```sh
npm run preview
```

### 使用 [ESLint](https://eslint.org/) 进行代码提示

```sh
npm run lint
```

### 使用 [Prettier](https://prettier.io/) 进行代码格式化

```sh
npm run format
```

### 构建离线运行版本

```sh
npm run legacy
```

### 构建用于[Github Pages]([https://pages.github.com](https://pages.github.com/))的页面

```sh
npm run gitpages
```

