# v0.0.0

1:  
- Save files in Markdown format as `.smm.md`. The "More" menu in the top-right corner now supports switching to Markdown editing mode.  
- Node hyperlinks now support linking to Obsidian (`.md`) files.  
- Split-view mode now synchronizes the mind map’s core data (basic configurations and settings are not synchronized).  
- Clicking the save button in the top-right stores the current preview image, which can then be embedded into Markdown documents using `![[.smm.md]]` to display as an image. The image updates in real time when the source file is modified, and double-clicking the image opens the mind map editor.  
- Node statistics have been added to the bottom status bar.  
- A basic multilingual setting has been implemented.

2:  
- Mind map and SVG data are now compressed and encoded before saving.  
- Fixed duplicate entries for the **Open as Markdown Document** option in the top-right "More" menu.  
- Mind map settings are now persisted across sessions.  
- Added settings for specifying mind map file path, image file path, default structure, default theme, and auto-save interval.  
- Theme mode can now be set to: Follow Obsidian, Dark, or Light.  
- Files are automatically saved before closing a tab to prevent data loss.  
- Uploaded node and background images are stored in the vault; only file paths are saved in the mind map data to reduce file size.  
- Node images can now be selected directly from images already in the vault.  
- Embedded previews now use PNG instead of SVG. This significantly reduces saved data size but sacrifices SVG’s high resolution.  
- Added **Copy as Obsidian Internal Link** to the canvas right-click menu.  
- Added a "Saving..." indicator next to the save button.  
- Node text input now supports typing `[[` to trigger a popup listing Obsidian files for inserting internal links.  
- Obsidian files in the hyperlink dialog now support search.  
- Notification messages and tooltips have been migrated from Element UI to Obsidian’s native components.  
- Theme colors now follow Obsidian’s theme; non-Element UI component colors dynamically adapt to Obsidian’s theme.  
- Added a button in the top-right corner to switch to outline editing mode.

3:  
- **Multilingual support**:  
  - Automatically follows Obsidian’s language setting.  
  - Plugin code now fully supports Chinese, English, Vietnamese, and Traditional Chinese.  
- Image upload dialog for node images now supports dragging images directly from the Obsidian file list.  
- Pasted images are now automatically saved as files in the vault.  
- Added **Copy as Obsidian Internal Link** to the node right-click menu; opening the link automatically focuses on that node.  
- **Internal Links**:  
  - Improved editing of rich-text internal links within nodes: during editing, raw syntax like `[[xxx]]` is shown; after editing, it renders as a clickable link. Supports suffixes like `#`, `^`, and `|`.  
  - Unified handling of internal links in both node hyperlinks and node text; updates are synchronized to the Markdown document.  
  - Fixed ambiguity when inserting internal links to files with identical names in different directories.  
  - Deduplication of internal links.  
- Support embedding SMM-language code blocks in Markdown documents:  
  - Simple mind map editing is possible within the code block; all keyboard shortcuts and rich-text toolbar functions are available.  
  - Initial height can be set and adjusted by dragging.  
  - Action buttons: Return to root node, Fit to canvas.  
  - Command: Insert a mind map code block into the current document.  
- File selection popups for node text now support keyboard navigation (arrow keys and Enter).  
- Fixed abnormal rendering in the minimap.  
- Fixed errors in presentation mode.  
- Outline view now supports displaying and adding internal links.  
- Improved UI styling, layout, and dark mode compatibility.

4:  
- When importing `.smm`, `.json`, or `.xmind` files, base64-encoded node images are converted and stored in the vault.  
- Hyperlink icons now visually distinguish between Obsidian files and web URLs.  
- When exporting to `.smm`, `.json`, or `.xmind`, images using Obsidian paths are converted to base64.  
- Added links in settings for submitting issues and downloading the desktop client.  
- Double-clicking an embedded preview without an image still navigates to the mind map editor.  
- Hyperlinks now support adding local files; selected files are uploaded to the vault, and the storage path can be customized in settings.  
- Image compression for uploads is now supported; compression settings (enabled/disabled and parameters) are configurable.  
- Added setting to control whether double-clicking an `![[]]` embedded preview opens in a new tab.  
- Added setting to toggle transparent background for embedded previews.  
- Mind map file storage directory can be set to: vault root, a specified folder, or the same folder as the current file.  
- Image and general file storage directories support four options: vault root, specified folder, current file’s folder, or a subfolder under the current file’s folder.  
- Added settings for prefix and datetime format in new mind map filenames.  
- Added onboarding guidance for first-time plugin users.

5:  
- Added setting to extend the list of fonts available in mind maps.  
- Directory inputs in settings now support selecting vault folders.  
- Markdown documents can now be previewed as mind maps, with options to switch structure/theme and export as PNG, SVG, or PDF.  
- Structure options in settings are now localized; single-type structures no longer show redundant index labels.  
- Added a read-only mode toggle button in the top-right corner.  
- If a mind map contains image data, embedded previews use PNG; otherwise, SVG is used. SVG previews support transparent backgrounds.  
- Code block embedding now supports toggling transparent background.  
- Code block embedding supports switching structure and theme.  
- Components are now imported on-demand to reduce bundle size and fix interference with Obsidian’s table styles.

# v0.1.1
1. Added **Copy Current Node as Image to Clipboard** to the node right-click menu—can be pasted directly into Obsidian documents.  
2. Fixed an issue where editing the same file in multiple tabs caused node text to disappear when switching tabs.  
3. Fixed unresponsive Delete key during text editing when multiple tabs edit the same file.  
4. Automatically clears active states (e.g., text editing, node activation) when switching tabs.  
5. Fixed overlap between the bottom toolbar and Obsidian’s status bar.  
6. Default theme settings now differentiate between light and dark modes.  
7. Added **Show Bottom Toolbar** toggle in the mind map view’s sidebar settings.  
8. Intercepted Obsidian’s `Ctrl+S` and `Ctrl+F` shortcuts: `Ctrl+S` now triggers mind map save, and `Ctrl+F` opens the mind map search box.  
9. Added command to enter presentation mode.  
10. Fixed failure to auto-update preview images when `![[]]` embeds lacked an initial preview.  
11. Added a “File deleted” warning when an embedded file is removed.  
12. Fixed repeated file creation and failures from rapid clicks on the new-file icon due to incorrect directory resolution.  
13. Fixed ignored width/height settings for embedded previews in reading mode.  
14. Centered Obsidian whiteboard embeds and limited max dimensions to prevent overflow.  
15. Supported embedding mind maps as images in Excalidraw (display size issues remain).  
16. Added **Save and Update Image** command with shortcut `Ctrl+Shift+S`.  
17. Fixed empty content in the node notes sidebar.  
18. Holding `Ctrl`/`Command` while clicking a node hyperlink opens it in a new tab.  
19. Fixed hanging “loading” state when importing invalid Markdown files; added user feedback.

# v0.1.2
1. Added **Enable Search in Obsidian** setting. When enabled, all node text is saved to the file to support Obsidian search; clicking search results auto-focuses the relevant node.  
2. Added **Check for Updates** setting; checks for new versions on plugin startup.  
3. Filters out YAML frontmatter when previewing Markdown as a mind map.  
4. Holding `Shift` enables horizontal panning with the mouse wheel.  
5. Supports parsing online images in Markdown during import or preview.  
6. Prioritizes mind map rendering before loading UI elements to improve open speed.  
7. Preserves user-edited YAML data.  
8. Supports converting mind map documents to Markdown.  
9. Supports converting Markdown documents to mind map format.  
10. Notes images are now uploaded to the vault, consistent with node images.  
11. Mobile adaptation:  
    - Added right-click menu icon on the left.  
    - Added helper buttons in outline editing.  
    - Disabled Obsidian sidebar during horizontal canvas dragging.  
    - Hidden non-essential buttons.  
    - Disabled onboarding tips.  
12. Supports dragging files from the vault or local system onto nodes: images are inserted as node images; others become hyperlinks.  
13. Fixed hidden top-right search box obstructing canvas and node interactions.  
14. Fixed unintended canvas/toolbox shifts when editing text near canvas edges.  
15. Added **Save Canvas Position and Zoom** setting.  
16. Improved Markdown import: if multiple root nodes are detected, a new root wraps them instead of discarding extras.  
17. Changed UID symbol in **Copy Node as Obsidian Internal Link** from `#` to `#^`.  
18. When **Enable Search in Obsidian** is on, saved UIDs use `^` instead of `#`.  
19. Hover previews of `[[ ]]` embeds in reading mode now auto-resize images.

# v0.1.3
1. Fixed `undefined` errors during Markdown import.  
2. Added **Max Heading Level for Node-to-Markdown Conversion**: nodes above this level become Markdown headings; others become list items.  
3. Preview image data is now stored as separate files by default:  
    3.1. Added **Store Preview Image as File** setting (enabled by default). When on, SVG preview files are saved in the vault and only paths are stored in the mind map file. When off, base64 data is embedded (increasing file size).  
    3.2. Deleting a mind map file in Obsidian also deletes its preview file. Manual cleanup is needed if deleted via the OS. Auto-deletion may fail in some edge cases.  
4. Fixed loss of searchable text data when saving in outline mode.  
5. Optimized layout algorithm for **Logic Structure** diagrams: faster rendering, resolved position conflicts between summary and regular nodes, and fixed missing layout updates after summary node resizing.  
6. Added confirmation dialogs for mind map ↔ Markdown conversions.  
7. Import dialog now supports dragging files from the vault or local system.  
8. File name can now be edited directly in the title bar.

# v0.1.4
1. Fixed ability to drag files onto nodes in read-only mode.  
2. Node text editing now supports direct internal link input:  
    2.1. Typing `[[` triggers Obsidian file list; navigate with arrow keys, press Enter or click to insert; search supported.  
    2.2. After editing, `[[ ]]` renders as a clickable link; `Ctrl+Click` opens in a new tab.  
    2.3. Supports `#`, `^`, and `|` suffixes in pasted or typed links.  
3. Simplified new mind map filename format setting into a single field supporting variables.  
4. Added **Image Paste Naming Format** setting with variable support.  
5. Added **Open Node Links in New Tab** setting (enabled by default).  
6. Removed close buttons from all dialogs and disabled closing by clicking outside.  
7. Fixed canvas background turning into the preview image when double-clicking a node image with transparent background enabled.  
8. Added "+" button next to the tag input field.  
9. Added guidance text to the import dialog.  
10. Added **Bracket** style to line connection options under Basic Styles.  
11. Summary nodes now support connectors, formulas, and attachments.  
12. SVG export now supports transparent background.  
13. Added tooltips to clarify complex settings in the right-side configuration sidebar.

# v0.1.5
**New Features**:  
1. Added support for free-floating nodes.  
2. Enhanced internal link editing in node text:  
   - Parses aliases and block references.  
   - Fixed broken link opening.  
   - Typing `【【` auto-corrects to `[[` and triggers file selection.  
   - Creates new files if linked file doesn’t exist.  
3. Upgraded math formula rendering library for better output.  
4. Added support for importing `.txt` files.  
5. Automatic math formula rendering during import of `.mm`, `.xmind`, `.txt`, `.md`, and `.xlsx` files.  
6. Improved Markdown export:  
   - Preserves and renders bold, italic, and strikethrough.  
   - Preserves icons, tags, hyperlinks, and images.  
   - Wraps summary and note content in code blocks to avoid structural pollution; supports re-import.  
7. Preserves raw math formula syntax in `.md` and `.txt` exports for reliable re-import.  
8. Adds `$` delimiters around math formulas in `.xmind` exports for better recognition.  
9. Node width resizing now snaps to sibling node widths.  
10. Rainbow lines moved from instance options to theme settings for per-file customization.  
11. Added node margin controls in the node style sidebar.  
12. Added **Select All Nodes** to both node and canvas right-click menus.  
13. Added **Copy as Plain Text** to the node right-click menu.  
14. Grouped node creation and copy/paste actions into a submenu.  
15. Added keyboard shortcuts for bold, italic, underline, strikethrough, and font size adjustment on active nodes (may conflict with Obsidian shortcuts).  
16. Outline sidebar fixes:  
    - Fixed outdated outline after immediate node level changes post-editing.  
    - Fixed outline sync when promoting an already-active node.  
    - `Tab` key now demotes nodes (previously promoted).  
17. Fullscreen outline editing fixes:  
    - Fixed node text reverting to default after promotion post-editing.  
    - `Tab` key now demotes nodes.  
18. Added ability (and shortcut) to split text after cursor into a sibling node in outline mode (shortcut may conflict with Obsidian).  
19. Pasting multi-line text supports preserving or flattening hierarchy.  
20. With free-drag enabled, holding `Ctrl` ignores hierarchy during dragging.  
21. Line arrow styling:  
    - **Basic Styles**: set arrow direction.  
    - **Node Styles**: toggle arrow visibility.  
22. Switched node notes editor from modal to sidebar mode.  
23. Added support for configuring image hosting services (image beds).

**Fixes & Optimizations**:  
1. Fixed failure when converting mind maps to Markdown.  
2. Fixed duplicate file creation from **New Mind Map** in right-click menu.  
3. Fixed failed Markdown conversion after duplicating an `.smm` file via **Duplicate** in file explorer.  
4. Fixed save errors when editing a mind map with no preview file while it’s embedded via `![[]]` in another Markdown file.  
5. Fixed mismatched preview SVG filenames after renaming mind map files or converting to Markdown.  
6. Fixed delayed update of `path` metadata after renaming mind map files.  
7. Fixed background images in SVG exports ignoring stretch settings from Basic Settings.  
8. Resolved node collision in Directory Organization diagrams.  
9. Fixed export failures (PNG/SVG/PDF) when node text contained illegal characters.  
10. Fixed first background image upload failing after uploading a node image.  
11. Optimized Fishbone diagram code and node outer spacing.  
12. Improved text visibility in dark theme for level-3+ node text editors (fixed similar background/text colors).  
13. Added filename length validation and warning for Excel exports.  
14. Improved dark mode styling in file list dialogs.