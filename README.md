<p align='center'>
  <img src='resources/image/screenshot.png' />
</p>
<h1 align='center'>SnippetStore</h1>
<p align='center'>
<i>A snippet management app for developers</i>
</p>
<p align='center'>
<img src='https://travis-ci.org/ZeroX-DG/SnippetStore.svg?branch=master' alt='travis'>
</p>

## About this project

SnippetStore is a application for developers to store their snippets and quickly retrieve them when needed. SnippetStore mainly focus on storing code therefor its interface is small and simple, perfect for busy developers who doesn't care about small details.

## Download

Currently SnippetStore only available for linux and windows.

If you're using MacOS, you can also build a version for you OS too (not guarantee it will work!)

```
npm run dist:mac
```

You can get the latest release of SnippetStore [here](https://github.com/ZeroX-DG/SnippetStore/releases)

## Theme

SnippetStore currently support 2 themes dark and light

| Light theme                                        | Dark theme                                        |
| -------------------------------------------------- | ------------------------------------------------- |
| <img src='resources/image/screenshot-light.png' /> | <img src='resources/image/screenshot-dark.png' /> |

## Tag support

With SnippetStore you can assign multiple tags to your snippet and easy find them using the tag list on the right bar

<p align='center'>
  <img src='resources/image/screenshot-tag.png'>
</p>

## Multi file snippet

Not satisfied with a single file snippet? With SnippetStore you can now store multiple files within a snippet

<p align='center'>
  <img src='resources/image/screenshot-multi-file.png'>
</p>

## Snippet list layout

SnippetStore currently support 2 snippet list layout:

| Original                                                     | List and details                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------------- |
| <img src='resources/image/screenshot-layout-original.png' /> | <img src='resources/image/screenshot-layout-list-and-detail.png' /> |

## Internalization

SnippetStore currently support 2 languages:

- English
- Vietnamese

## Shortcut

| Action                    | Key      |
| ------------------------- | -------- |
| Open create snippet modal | ctrl + n |
| Open setting modal        | ctrl + , |
| Toggle small sidebar mode | ctrl + b |
| Close all modal           | esc      |

## Tech Stack

- Framework: [Electron](https://electronjs.org/)
- Bundler: [Webpack](https://webpack.js.org/), [Babel](https://babeljs.io/), [Electron-builder](https://github.com/electron-userland/electron-builder)
- Language: [ES6](https://babeljs.io/learn-es2015/), [Sass](http://sass-lang.com/)
- Library: [React](https://reactjs.org/), [MobX](https://mobx.js.org/), [Mousetrap](https://craig.is/killing/mice), [react-toastify](https://fkhadra.github.io/react-toastify/), [react-tooltip](http://wwayne.com/react-tooltip/), [CodeMirror](https://github.com/codemirror/CodeMirror)
- Lint: [ESLint](https://eslint.org/)
- Test: [Jest](https://facebook.github.io/jest/)

## Contributing

Check out [contributing.md](contributing.md)

## Author & Maintainer

- [Hung Nguyen](https://github.com/ZeroX-DG)
