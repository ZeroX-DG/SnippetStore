# Change Log

Every notable changes in each version will be listed in this file.

# 0.2.12 - Unreleased

## Features:

- **Interface**: New Turkish translation by [@zbahadir](https://github.com/zbahadir)

## Bugfixes:

- **Interface**: Fixed link not open in default browser when clicked in markdown preview (Fixed [#40](https://github.com/ZeroX-DG/SnippetStore/issues/40)) ([4864b8b](https://github.com/ZeroX-DG/SnippetStore/commit/4864b8b))
- **Interface**: Fixed can't preview github flavored markdown (Fixed [#39](https://github.com/ZeroX-DG/SnippetStore/issues/39))([9dec808](https://github.com/ZeroX-DG/SnippetStore/commit/9dec808))
- **Interface**: Fixed MarkdownPreview not update when changing snippet (Fixed [#38](https://github.com/ZeroX-DG/SnippetStore/issues/38))([0d3ab7d](https://github.com/ZeroX-DG/SnippetStore/commit/0d3ab7d))
- **Interface**: Fixed snippet not exiting preview mode when in edit mode (Fixed [37](https://github.com/ZeroX-DG/SnippetStore/issues/37))([64b74cc](https://github.com/ZeroX-DG/SnippetStore/commit/64b74cc))

# 0.2.11

## Features:

- **Interface**: Added input select for faster language picking in create snippet modal ([2e83a62](https://github.com/ZeroX-DG/SnippetStore/commit/2e83a62))
- **Interface**: Added markdown preview for markdown snippets
- **Interface**: Added about menu ([e298dfd](https://github.com/ZeroX-DG/SnippetStore/commit/e298dfd))
- **Interface**: Added check for update in menu ([5f233cb](https://github.com/ZeroX-DG/SnippetStore/commit/5f233cb))

## Bugfixes:

- **Interface**: Used `Lato` font for tooltip in `list-and-details` layout. ([a7f8ff4](https://github.com/ZeroX-DG/SnippetStore/commit/a7f8ff4))

## Security

- **Dependency update**: Updated `electron` to 1.8.8
- **Dependency update**: Updated `universal-analytics` to latest version

# 0.2.10

## Bugfixes:

- **Interface**: Fixed window not completely maximize when open ([afb19c6](https://github.com/ZeroX-DG/SnippetStore/commit/afb19c6))

- **Interface**: Fixed snippet list still accessible in edit mode (`list-and-detail` layout) ([5fee622](https://github.com/ZeroX-DG/SnippetStore/commit/5fee622))

- **Interface**: Fixed abort export snippet show error ([eb4b9d1](https://github.com/ZeroX-DG/SnippetStore/commit/eb4b9d1))

## Feature:

- **Language**: PHP open and close tag `<?php ?>` is now optional and can be configure in setting ([ffeca5b](https://github.com/ZeroX-DG/SnippetStore/commit/ffeca5b))

# 0.2.9

## Bugfixes:

- **Interface**: Fixed bug when create new multi-files snippet ([0ba8601](https://github.com/ZeroX-DG/SnippetStore/commit/0ba8601))

- **Interface**: Fixed bug when editing file name in multi-files snippet in original layout ([d5cb17c](https://github.com/ZeroX-DG/SnippetStore/commit/d5cb17c))

- **Interface**: Fixed bug when editing file name in multi-files snippet in `list and detail` layout ([0bbaaab](https://github.com/ZeroX-DG/SnippetStore/commit/0bbaaab))

## Improvement:

- **Development**: Improved dev script to fix blank screen on start ([920055c](https://github.com/ZeroX-DG/SnippetStore/commit/920055c))

# 0.2.8

## Bugfixes:

- **Interface**: Fixed search language that contain spaces ([8223abd](https://github.com/ZeroX-DG/SnippetStore/commit/8223abd))

- **Interface**: Fixed multi-file snippet with empty file extension ([4a5c8b1](https://github.com/ZeroX-DG/SnippetStore/commit/4a5c8b1))

- **Interface**: Fixed icon is too big on MacOS ([e70c9c4](https://github.com/ZeroX-DG/SnippetStore/commit/e70c9c4))

## Others:

- **License**: Change license to MIT

# 0.2.7

https://medium.com/@nguynvithng_34102/snippetstore-v0-2-7-is-out-aa934b1d25e7

## Features:

- **Interface**: Import snippet by drag & drop directly to the app

## Bugfixes:

- **Interface**: Fixed plain text mode bug ([3ad5c42](https://github.com/ZeroX-DG/SnippetStore/commit/3ad5c42))
- **Interface**: Fixed too many events bug ([0780dad](https://github.com/ZeroX-DG/SnippetStore/commit/0780dad))
- **Interface**: fixed import snippet empty path bug ([4236e0c](https://github.com/ZeroX-DG/SnippetStore/commit/4236e0c))

# 0.2.6

https://medium.com/@nguynvithng_34102/snippet-store-v0-2-6-b4eb896b924d

## Features:

- **Interface**: Import & Export all snippets or a specific snippet
- **Interface**: New icon pack
- **Core**: Custom storage location

## Bugfixes:

- **Interface**: Fixed flickering when switching snippets ([23a7e98](https://github.com/ZeroX-DG/SnippetStore/commit/23a7e98))
- **Interface**: Fixed macOS keyboard shortcut bug ([347339b](https://github.com/ZeroX-DG/SnippetStore/commit/347339b))

## Improvements:

- **Development**: Added analytics to improve user experience in the future

## Other:

- **Integration**: Visual Studio Code integration

# 0.2.5

## Features:

- **Interface**: New tags input with tag auto complete
- **Core**: Save snippet with keyboard shortcut `ctrl + s` ([84f1e45](https://github.com/ZeroX-DG/SnippetStore/commit/84f1e45))
- **Core**: Discard changes snippet with keyboard shortcut `esc` ([b0efd98](https://github.com/ZeroX-DG/SnippetStore/commit/b0efd98))
- **Core**: Navigate through snippet list in `list and details` layout using keyboard shortcut ([b9b4642](https://github.com/ZeroX-DG/SnippetStore/commit/b9b4642))

## Bugfixes:

- **Interface**: Fixed interface setting tab throw error ([d59ad3e](https://github.com/ZeroX-DG/SnippetStore/commit/d59ad3e))

## Improvements:

- **Development**: Added MobX provider so we can access store using `@inject` decorator

# 0.2.4

## Features:

- **Interface**: Highlight current line ([24762a8](https://github.com/ZeroX-DG/SnippetStore/commit/24762a8))
- **Interface**: Search & replace shortcut in snippet code ([b4d397a](https://github.com/ZeroX-DG/SnippetStore/commit/b4d397a))

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
