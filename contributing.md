# Contributing

Thank you for intent to contribute to SnippetStore. As I only have one machine that run linux, I really need some help from you guys in order to distribute this app on MacOS.

## Build

Build for windows:

```
npm run dist:win
```

Build for macOS:

```
npm run dist:mac
```

Build for linux:

```
npm run dist:linux
```

## Development

1.  Install dependencies

```
cd SnippetStore
npm i
```

2.  Run Project

```
npm run dev
```

3.  Add some code and send me the PR

## Folder structure

```
|
|-- app // contains the main process code
|-- browser // contains the render process code
     |-- core // contains the core functions CRUD
     |-- lib // contains functions that can be used for both core functions and render components
     |-- render // contains render components, pages
          |-- components // small components
          |-- layouts // snippet list layouts
          |-- lib // lib for render functions
          |-- modals // setting modal, create modal,...
     |-- store // mobX store
|-- languages // contains the languages for i18n
|-- scripts // development scripts like webpack...
|-- test // tests
|-- resources // fonts, images, icons
```

## Remember

Please run eslint and check for error before submit a PR

```
npm run lint
```

Please add some tests for the new features, it make PR more easy to review and merge
