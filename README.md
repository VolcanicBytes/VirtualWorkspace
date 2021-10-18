# Virtual Workspace

This extension allows you to save all the opened editors into a file, that can be restored later.

## Usage

1) Open a bunch of files from different locations (not under the same folder possibly... for that use native Workspaces instead) within a VSCode instance
   1) You could also create a new file on the fly and type something in it, without save
2) Run [VirtualWorkspace: Save Workspace As...](#virtualWorkspace.saveAs)
3) Close VSCode
4) Open a folder with VSCode
5) Close VSCode
6) Double click the file saved in step (2)
   1) Or select [VirtualWorkspace: Restore](#virtualWorkspace.restore) from the command palette
7) Select the files that you want to restore from the list saved in step (2)
   1) Or just hit <kbd>Enter</kbd> to load them all !

## Settings

- `virtualWorkspace.remember_last_open_dialog_location` : when enabled, your save & restore commands will re-open in the last opened location
- `virtualWorkspace.override_open_dialog_location`: if set, your save & restore commands will always be open in this location


## Tips

- `virtualWorkspace.saveAs` and	`virtualWorkspace.restore` can accept a location path argument which will override the settings and will open the dialog in this folder

## Known Issues

> VSCode, at the time this extension was created, didn't provide good support for working with open editors from extension API, so there are some limitations:
1.  It Works only with text editors and file not on disk
2.  There is no access to the grid layout system used, so when you save complex layout only column position can be recorded
3.  When there are multiple non writable editors opened, it seems that VSCode keep only 7 files reachable from the extension, so I added a mechanism that try to cycle more times. If it doesn't succeed in scanning all the files, try the following:
    1.  if you read in the bottom "Saving virtual space..." and it looks like the process is pending, just click on any tab to resume the save process
    2.  when you read, for example, "Save list of 7 file..." and you have 10 files, just add the three focusing them first and then replying with 'Add active file' for each of them
4.  Don't keep track of changes made in files saved on disk
