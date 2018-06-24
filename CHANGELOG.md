# Change Log

Every notable changes in each version will be listed in this file.

# 0.1.1

## Features:

- **Interface**: Switch option with tab key in pick snippet type modal ([e85849e](https://github.com/ZeroX-DG/SnippetStore/commit/e85849e))

## Bugfixes:

- **Interface**: Fixed theme bug when restructured snippet list ([0a838a5](https://github.com/ZeroX-DG/SnippetStore/commit/0a838a5))

## Improvements:

- **Development**: Restructured snippet list into smaller components ([354e499](https://github.com/ZeroX-DG/SnippetStore/commit/354e499))
- **Development**: Prettified the whole source code using prettier ([60646d9](https://github.com/ZeroX-DG/SnippetStore/commit/60646d9))
- **Interface**: Passed control to modal list so that only 1 modal can open at the time ([e85849e](https://github.com/ZeroX-DG/SnippetStore/commit/e85849e))
- **Interface**: Added ESC text bellow modal's close button ([eb16841](https://github.com/ZeroX-DG/SnippetStore/commit/eb16841))

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
