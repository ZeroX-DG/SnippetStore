# Change Log

Every notable changes in each version will be listed in this file.

# 0.2.4

## Bugfixes:

- **Interface**: Fixed tag overflow bug in snippet item ([15db53b](https://github.com/ZeroX-DG/SnippetStore/commit/15db53b))
- **Interface**: Fixed remove file in editing mode bug in snippet item ([1875a0f](https://github.com/ZeroX-DG/SnippetStore/commit/1875a0f))

## Improvements:

- **Development**: Improved dist command to clean up dist folder before packaging app
- **Development**: Make all snippet to use 1 code editor component

# 0.2.3

## Bugfix:

- **Interface**: Fixed delete file bug in create multi file snippet modal ([f88f138](https://github.com/ZeroX-DG/SnippetStore/commit/f88f138))

# 0.2.2

## Bugfixes:

- **Interface**: Fixed scroll unnecessary part in snippet list in `list and detail` mode ([67ee1c2](https://github.com/ZeroX-DG/SnippetStore/commit/67ee1c2))
- **Interface**: Fixed line clamping bug in snippet name ([a25c42e](https://github.com/ZeroX-DG/SnippetStore/commit/a25c42e))
- **Interface**: Fixed main window doesn't show when second instance is opened ([fa0a20d](https://github.com/ZeroX-DG/SnippetStore/commit/fa0a20d))
- **Interface**: Fixed tag overflow snippet item ([5adbfae](https://github.com/ZeroX-DG/SnippetStore/commit/5adbfae))
- **Interface**: Fixed about tab content overflow ([487a3ae](https://github.com/ZeroX-DG/SnippetStore/commit/487a3ae))
- **Interface**: Fixed create multi file snippet modal delete file bug ([16bc2bd](https://github.com/ZeroX-DG/SnippetStore/commit/16bc2bd))
- **Interface**: Fixed create new file in editing mode in multi file snippet ([58d95d1](https://github.com/ZeroX-DG/SnippetStore/commit/58d95d1))
- **Interface**: Fixed no tag in snippet item in original layout ([b99c410](https://github.com/ZeroX-DG/SnippetStore/commit/b99c410))
- **Interface**: Fixed file input background in editing mode in snippet item in original layout ([d8a4916](https://github.com/ZeroX-DG/SnippetStore/commit/d8a4916))
- **Interface**: Fixed text overflow on snippet name in snippet item in original layout ([d1f990b](https://github.com/ZeroX-DG/SnippetStore/commit/d1f990b))

# 0.2.1

## Features:

- **App**: Added tray bar icon menu ([b6a9c96](https://github.com/ZeroX-DG/SnippetStore/commit/b6a9c96))
- **App**: Close app will now hide app and the app still run in tray bar ([b6a9c96](https://github.com/ZeroX-DG/SnippetStore/commit/b6a9c96))
- **Interface**: Custom tag color (background and foreground) ([9373591](https://github.com/ZeroX-DG/SnippetStore/commit/9373591))

## Bugfixes:

- **Interface**: Fixed sidebar click conflict search bar on 2 layouts ([2a7f527](https://github.com/ZeroX-DG/SnippetStore/commit/2a7f527))
- **Interface**: Fixed height not reset in snippet item in original layout ([a828a3d](https://github.com/ZeroX-DG/SnippetStore/commit/a828a3d))

## Improvements:

- **Development**: Improved event handler in search bar in 2 layouts ([64934e4](https://github.com/ZeroX-DG/SnippetStore/commit/64934e4))
- **Development**: Restructured main process code ([b6a9c96](https://github.com/ZeroX-DG/SnippetStore/commit/b6a9c96))
- **Interface**: Updated snippet tags with new tag item ([cbca845](https://github.com/ZeroX-DG/SnippetStore/commit/cbca845))

# 0.2.0

## Features:

- **Interface**: Switch option with tab key in pick snippet type modal ([e85849e](https://github.com/ZeroX-DG/SnippetStore/commit/e85849e))
- **Interface**: New layout 'list and detail' ([ca74a3e](https://github.com/ZeroX-DG/SnippetStore/commit/ca74a3e))

## Bugfixes:

- **Interface**: Fixed side bar click doesn't trigger search ([165fa66](https://github.com/ZeroX-DG/SnippetStore/commit/165fa66))
- **Interface**: Fixed theme bug when restructured snippet list ([0a838a5](https://github.com/ZeroX-DG/SnippetStore/commit/0a838a5))
- **Interface**: Fixed scroll bar color for each theme ([99e0f96](https://github.com/ZeroX-DG/SnippetStore/commit/99e0f96))

## Improvements:

- **Development**: Restructured snippet list into smaller components ([354e499](https://github.com/ZeroX-DG/SnippetStore/commit/354e499))
- **Development**: Restructured components into their separate layouts ([ca74a3e](https://github.com/ZeroX-DG/SnippetStore/commit/ca74a3e))
- **Development**: Prettified the whole source code using prettier ([60646d9](https://github.com/ZeroX-DG/SnippetStore/commit/60646d9))
- **Interface**: Passed control to modal list so that only 1 modal can open at the time ([e85849e](https://github.com/ZeroX-DG/SnippetStore/commit/e85849e))
- **Interface**: Added ESC text bellow modal's close button ([eb16841](https://github.com/ZeroX-DG/SnippetStore/commit/eb16841))
- **Users**: Supported windows OS ([a6c3c9f](https://github.com/ZeroX-DG/SnippetStore/commit/a6c3c9f))

# 0.1.0

## Features:

- **Snippet**: Multi file snippet support
- **Interface**: Added snippet type picker when create new snippet
- **Core**: Updated search snippet API to fit multi file snippet structure
- **Core**: New shortcut ESC to close modal
- **Interface**: Added new menu bar which can be trigger using Alt key

## Bugfixes:

- **Interface**: Updated i18n support for some missing components
- **Interface**: Updated tag list & language list height and width overflow bug
- **Development**: Refactored single snippet item
- **Snippet**: Fixed snippet height not reset after switched from edit mode
- **Snippet**: Fixed codemirror load mode when load HTML mode & SQL mode

## Improvements:

- **Interface**: Updated snippet list to display 2 different types of snippet
- **Interface**: Prevent user select in some components
- **Development**: Added cross-env for better development in cross platform
- **Snippet**: Allow resize snippet description textarea in edit mode
- **Interace**: Bundled Fira Code font along with the app

# 0.0.1

- Single file snippet
- Language list
- Search snippet by name, language, tag
- Copy snippet to clipboard
- Keyboard shortcuts
- Sort snippet by create, date time & copy count
- i18n support for Vietnamese & English
- Added some tests for API system
- Added setting modal
