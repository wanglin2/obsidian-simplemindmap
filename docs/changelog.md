# Official Version

## 0.2.3

Fixes:
1. Attempted to fix the issue where clicking the login button has no response on iOS systems;
2. Fixed the issue where enabling fill-in-the-blank mode in one tab affects other tabs when multiple tabs are open simultaneously;
3. Fixed the issue where images inserted into nodes are not saved in `![[]]` format when stored in the `# linkdata` block of the source file;
4. Fixed the issue where the replace button appears when using search in a mind map when a new tab previews Markdown as a mind map;
5. Fixed the issue where the outer frame button in the top toolbar is not disabled when the root node is activated;
6. Fixed the parsing failure caused by AI returning data in the format `<think>thinking content</think>main content`;
7. Fixed the generation failure caused by an occasional invalid JSON response during AI streaming generation;
8. Fixed the error that occurs when clicking an internal link in `[[xxx|xxx]]` format inserted into node text;

New Features:
1. When previewing a Markdown document as a mind map, if multiple root nodes are parsed, an additional root node will be added with the current file name as its text;
2. Added a "Search under this node" menu item to the node right-click menu;
3. The settings page reloads after modifying the language option in plugin settings;
4. Plugin Settings: Added tooltip for directory-related settings — only applies to newly inserted files afterwards; existing files will not be moved automatically;
5. Plugin AI Settings: Automatically fetches the list of available models after the API and key are filled in;
6. Automatically switches to non-streaming request mode for AI interfaces that do not support cross-origin requests;
7. Automatically converts `[[]]` format links when converting Markdown to a mind map or importing Markdown;
8. Dragging files from the Obsidian file list or local computer onto a node now adds them to the node text as `[[]]` link format, instead of hyperlink icons;
9. Removed the "Obsidian File" and "Local File" options from the dialog opened by the "Hyperlink" button in the top toolbar; only hyperlinks are supported now;
10. References in the mind map are updated synchronously when the file name or location of inserted images/files changes;
11. The "Preview as Mind Map" Obsidian command now toggles the preview — shows the preview when none exists, and closes it when one is already open;

## 0.2.2

Fixes:
1. Fixed an issue where the loading state would not close when selecting to import as a child of the active node while no node was activated;
2. Fixed an issue where the fill-in-blank mode in presentation mode would not take effect in real time and required reopening the window to apply;
3. Fixed incorrect protocol display when reloading regular hyperlinks added to nodes;
4. Optimized the display position of the file list popup triggered by typing [[ within node text;
5. Fixed an issue where keyboard shortcuts did not work inside modals from the Modal Opener plugin;
6. Fixed failed operations when opening files as Markdown documents for some users;
7. Fixed an issue where clicking the [Test] button after finishing AI configuration prompted incomplete configuration;
8. Fixed an issue where links added to text of free tree nodes were not saved to the # linkdata block in the source file;
9. Fixed an issue where text from free tree nodes was not saved to the # textdata block in the source file when the [Enable Obsidian Search] setting was turned on;

New Features:
1. Clicking the filename input box at the top of the mind map editing tab automatically selects the text before the .smm extension;
2. Press the F2 shortcut to rename the current mind map file when no node is activated;
3. Added support for custom protocols other than http/https when adding regular hyperlinks to nodes;
4. Added a setting in plugin options to switch math formula rendering modes;
5. When typing [[ inside node text, the text following [[ is used as the search filter for the file list, and the search box in the file list is removed;
6. Added an Obsidian command labeled [Preview as Mind Map];
7. Support converting between mind maps and Markdown by creating new files during conversion;
8. Added compatibility for xxx:// custom protocol links inserted via [[]] inside node text;

## 0.2.0

New Features:
1. Support logging in to PKMer account;
2. Add Pro version features;
3. Support configuring AI models. Once configured, AI features are supported (one-click mind map generation, node continuation, AI chat); logging in to a PKMer account allows the use of PKMer AI;
4. Add file preview popup on mouse hover over links, supporting only md, pdf, and image files;
5. Image data inserted into nodes is additionally saved to the #linkdata block of the source file, allowing other plugins to detect image references;
6. Add quick jump buttons to the top of the plugin settings interface;
7. Performance optimization: Sidebar component content changed to lazy loading to improve opening speed;
8. Performance optimization: Remove unused components; icon, note, and tag popups or sidebar node activation event listeners only initialize data when the popup or sidebar is open;
9. Improve multilingual translation;
10. Optimize interface styles;
11. Improve mobile interface display;
12. Add sibling node, child node, and delete node buttons to the mobile top toolbar;
13. Add superscript and subscript formats to the node rich text toolbar;
14. Support setting node images to load only when they enter the viewport;
15. Add numeric input boxes to all slider settings;
16. Remove built-in node stickers, as they are not very useful and increase the plugin size;
17. Outline editing: Maintain the focus state of the node text input box when moving nodes up or down;
18. Full-screen outline editing: Support selecting paste method (no line break, preserve hierarchy, ignore hierarchy) when pasting multi-line text;
19. When pasting multi-line text with multiple top-level root nodes into an active node using the preserve hierarchy method, an extra root node will no longer be created; instead, they will be inserted as sibling nodes under the current node;

Bug Fixes:
1. Fix the issue of abnormal free node tree structure after converting a node to a free node under the mind map layout structure;
2. Fix the issue of being unable to expand a node after converting a collapsed node to a free node;
3. Fix the issue of math formulas failing to render properly when they contain &, <, or > symbols;
4. Fix the issue of the status statistics in the bottom right corner not updating when switching between different mind map tabs;
5. Fix the issue of incorrect statistics for node text and node count in the bottom right corner;
6. Fix the issue of icons not highlighting in real-time after formatting in the rich text toolbar; optimize the display issue of overly long font lists;
7. Fix the issue of image export failing (image size is 0) when the mind map size is too large;
8. Fix the issue of math formulas not being automatically converted when converting a Markdown document to a mind map document;
9. Fix the issue of the app freezing when clicking an smm file in search results;
10. Fix the issue of being unable to drag free node positions on mobile;
11. Fix the issue of failing to add SVG format images to nodes;
12. Fix the error when installing the plugin on lower versions of Obsidian;

Pro Features:
1. Support exporting to Excel, Freemind, JPG, Mermaid, and HTML format files; node hyperlinks in exported PDF files support clicking;
2. Support importing xlsx and Freemind format files; support pasting Markdown and Txt content for import; support importing as children of the currently active node;
3. Support fill-in-the-blank mode: presentation mode and canvas right-click menu;
4. Add Pro-exclusive structures: table, timeline, fishbone diagram;
5. Nodes support adding markers, node numbering, and node to-dos;
6. Support hiding node text;
7. Node lines support dashed line flow effect;
8. Add Pro-exclusive node shapes;
9. Node outer frame style supports setting to exclude child nodes;
10. Canvas supports drag momentum effect;
11. Support smm code block embedded editing:
    1. Support embedding code blocks in ```smm``` format, which can be converted to a mind map view for editing after embedding;
    2. Only basic editing capabilities are supported: text editing (with rich text toolbar display), shortcut key operations, and mouse operations;
    3. Two action icons are provided in the bottom right corner of the editing view: back to root node, and fit canvas;
    3. After editing, clicking elsewhere in the document will automatically update the code block source data;
    4. Support setting the initial height of code block embedding in settings;
    5. Support dragging to adjust the height;
12. Support extending the fonts available for the mind map:
    1. Manage fonts in settings;
    2. Newly added fonts will be displayed in all font selectors of the mind map;
13. Support previewing as a mind map in a new tab:
    1. When opening a Markdown file, click the [Preview as Mind Map in New Tab] button in the more options at the top right corner to open the current file in a new tab and preview it as a mind map;
    2. After the Markdown file is modified, the previewed mind map will update automatically;
More Pro features are continuously being updated...

# Internal Version

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

# v0.1.6
**Fixes**:
1. Fixed the issue where when dragging image files directly onto a node, they are uploaded to the attachment directory instead of the image directory;

# v0.1.7

**New Features:**
1. **PDF Export:** Improved export clarity and added support for page-by-page export.
2. **Canvas Right-Click Menu:** Added a new menu item "Hide Associated Lines".
3. **Activation Behavior:** When activating associated lines or outer frames, the sidebar will no longer pop up immediately. Instead, a trigger button has been added.

**Bug Fixes:**
1. Optimized support for links to the pdf++ plugin.
2. Optimized internal link navigation.
3. Fixed an issue where dragging image files directly onto nodes would upload them to the attachment directory instead of the image directory.
4. Fixed an issue where modifying a mind map file's name after saving a preview image would cause the preview image file to change, but the path in the mind map data was not updated, resulting in the preview image not being displayed.
5. Fixed the issue where modifying the folder name would cause all files in the folder to be accidentally modified, resulting in inaccessible files;

# v0.1.8  
**New Features:**  
1. Intercept all shortcut keys to prevent them from not taking effect.  
2. After installing and enabling the pdf-plus plugin, the behavior of ignoring the Ctrl key when clicking on PDF file links.  
3. Improved the prompt message for embedded previews when no preview image is available.  
4. Optimized the theme sidebar style; automatically locate the currently used theme when opening the theme sidebar.  
5. Hyperlink popup - Obsidian files: Support filtering file types.  
6. Automatic focus on the search box after it is displayed.  
7. Adapted to the situation where the tab title bar is closed.  
8. For secondary and lower-level nodes with default text, double-clicking to edit the node will automatically select all text by default.  
9. Right-click menu:  
   - Height adapts to the current window height, scrolls up and down based on mouse position to display all menu items, consistent with Obsidian's right-click menu behavior.  
   - Optimized the issue of incomplete display of secondary menus at the edges.  

**Fixes:**  
1. Exporting data with tags, notes, summaries, and icons as md files:  
   - Escape code block syntax in note content to avoid conflicts.  
   - Fixed indentation issues when converting this content into code blocks.  
   - Fixed the issue of data loss when re-importing the file.  
2. Fixed style abnormalities in various radio button groups.  
3. Fixed abnormal prompt text for the save button in the upper right corner.