# Change Log

All notable changes to the "virtual-space" extension will be documented in this file.

## [Unreleased]

- Initial release

## 0.0.2

- Renamed the extension to avoid confusion
  - Visual Studio 2019 already has a concept of [Virtual Space](https://docs.microsoft.com/en-us/visualstudio/ide/how-to-manage-editor-modes?view=vs-2019) that appear to be completely different from what this extension provides. ([#1](https://github.com/VolcanicBytes/VirtualWorkspace/issues/1))


## 1.0.0

- If user cancel the `restore` command operation, open editor groups are kept  ([#2](https://github.com/VolcanicBytes/VirtualWorkspace/issues/2))
- Added Settings  ([#3](https://github.com/VolcanicBytes/VirtualWorkspace/issues/3))
  - `virtualWorkspace.remember_last_open_dialog_location`: when enabled, your save & restore commands will re-open in the last opened location
  - `virtualWorkspace.override_open_dialog_location`: if set, your save & restore commands will always be open in this location
- Save and Restore commands can accept a folder path parameter, in order to open dialogs in the specified location