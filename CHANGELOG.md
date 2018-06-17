# Change Log
Every notable changes in each version will be listed in this file.

# 0.1.0
## Features:
- **Snippet**: Multi file snippet support
- **Interface**: Added snippet type picker when create new snippet
- **Core**: Updated search snippet API to fit multi file snippet structure
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