# FAQ/Help

> The Ctrl key mentioned in this document corresponds to the Command key on Mac systems.

- Open a hyperlink in a new tab  
  Ctrl + click the hyperlink.

- When the left button is set to frame-select nodes and the right button is used to drag the canvas, can the left button still be used to drag the canvas?  
  Yes, hold down the Space key and use the left button to drag the canvas.

- When the mouse wheel behavior is set to 【Move view up and down】, how can the mouse wheel be used to zoom the canvas?  
  Hold down the Ctrl key and use the mouse wheel to zoom the canvas.

- **Is free node supported?**  
  No.

- **Can nodes be added after a summary node?**  
  No. This feature will not be implemented in the short term.  

  **Current summary functionality:**  
  1. Supports selecting a single node to add a single summary.  
  2. Supports selecting multiple nodes to merge summaries (child nodes with the same parent become a *range summary*).  
  3. Hovering over a summary highlights its associated nodes.  

  **Existing issues:**  
  1. Range summaries don't update with child node changes (only auto-delete if the range becomes invalid).  
  2. Potential position conflicts between summary/regular nodes.  

---

- **How to insert a line break?**  
  `Shift + Enter`.

- **How to edit node text?**  
  1. Double-click the node.  
  2. Activate node + press any letter/number key.  

- **How to select multiple nodes?**  
  1. Set selection mode in bottom toolbar:  
     - *Left-drag canvas + Right-box-select* **or**  
     - *Left-box-select + Right-drag canvas*.  
  2. With *Left-drag canvas* mode: Hold `Ctrl/Cmd` + Left-box-select.  
  3. Hold `Ctrl/Cmd` to toggle single node selection.  

- **How to drag the canvas?**  
  1. Use the mouse button assigned in toolbar settings.  
  2. In *Left-box-select* mode: Hold `Space` + Left-drag.  
  3. Set *Mouse Wheel Behavior* to *Move view up/down* in Settings.  
  4. Hold down the Shift key while using the mouse wheel to move the canvas left and right.

- **How to adjust node width?**  
  Drag node edges → Release to confirm.  
  - **Reset width:** Right-click node → *Remove Custom Width*.  
  - **Reset all:** Right-click canvas → *Remove All Custom Widths*.  

---

- **Export outline as PDF?**  
  Open *Outline* panel → Click *Print* → Choose `pdf` printer.  

- **Restore layout after free drag?**  
  Right-click canvas → *Auto-Organize Layout*.  
  *(Enable free drag in Settings → *Enable Free Node Dragging*)*  

- **Format Painter?**  
  Activate node → Click *Format Painter* → Target nodes → Click canvas to exit.  

- **Paste clipboard data?**  
  `Ctrl+V` on selected node:  
  - *Image* → Embeds in node.  
  - *Text* → Creates child node.  
  *(Priority: Last copied action wins.)*  

---

- **Export to XMind?**  
  Not compatible with XMind ≤8. Use latest version.  

- **Edit math formulas?**  
  1. Activate node → Click *Formula* → Input in panel → *Done*.  
  2. Or edit directly: Wrap LaTeX in `$...$` (e.g., `$E=mc^2$`).  
  *Note:* Consecutive formulas may need separator text.  

- **View full-size node images?**  
  Double-click the image.  

- **Remove custom styles?**  
  - Single node: Right-click → *Remove Custom Styles*.  
  - All nodes: Right-click canvas → *Remove All Custom Styles*.  

---

- **Performance Mode**  
  Only renders visible nodes (improves speed for large maps).  
  *Enable:* Settings → *Enable Performance Mode*.  

- **Real-Time Rendering**  
  Live node updates during text edits (may lag with many nodes).  
  *Enable:* Settings → *Enable Real-Time Rendering During Text Editing*.  

- **Zen Mode**  
  Hide all toolbars for distraction-free editing.  
  *Toggle:* Right-click canvas → *Zen Mode*.  

---

- **Align Sibling Nodes**  
  *Enable:* Settings → *Align Sibling Nodes* + set *Initial Width*.  
  - Manually adjust width: Drag one node → Others sync.  
  - Reset: Canvas right-click → *Remove All Custom Widths*.  
  *Limitations:* Nodes with images/tags may misalign.  

- **Search notes content?**  
  No, only node text is searchable.  

- **Node Line Style Inheritance?**  
  If enabled, descendant nodes inherit line styles (unless they have custom styles).  
  *Toggle:* Settings → *Node Line Style Inherits from Ancestor*.  