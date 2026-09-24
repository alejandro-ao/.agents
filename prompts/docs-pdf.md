---
description: Build and preview a polished PDF from Markdown documentation
---
Build a polished, print-ready PDF from the Markdown documentation in the current repository. Additional user preferences, if any: $ARGUMENTS

## Safety and scope

- Read repository instructions first.
- Do not edit any repository file. Create all intermediate files under `/tmp/<repo-name>-print-preview/`.
- Include only documentation from the current repository unless explicitly asked otherwise. Do not follow links into adjacent repositories.
- Add presentation only: cover metadata, table of contents, chapter breaks, page numbers, typography, margins, table wrapping, and syntax highlighting. Do not add, remove, summarize, or rewrite substantive documentation text.
- Never send anything to a printer until the user explicitly approves the preview and asks to print.

## Discover and order the documentation

1. Inspect the repository and find its Markdown documentation (`*.md` and `*.mdx`), excluding `.git`, dependencies, build output, generated output, and vendor directories.
2. Read the root README and any documentation index/navigation file.
3. Determine the intended reading order from the README/index. Prefer that explicit order; otherwise use README first, then naturally sorted documentation files, then glossary/reference material.
4. Avoid duplicate files. Report exactly which source files are included.
5. Check for referenced local images or other assets and ensure Pandoc can resolve them from the repository root.

## Check tools and print settings

- Check for `pandoc`, `tectonic`, Python 3, `pypdf`, Pillow, `qlmanage`, `lpstat`, and `lpoptions`.
- Prefer Pandoc with Tectonic. If unavailable, explain what is missing rather than installing software without permission.
- If a printer exists, inspect its default paper size with `lpstat` and `lpoptions`. Use that size; otherwise use A4 unless the user requests Letter.

## Build the combined source

Create `/tmp/<repo-name>-print-preview/<repo-name>-documentation.md` with YAML metadata followed by each source document in the chosen order. Use:

```yaml
---
title: "<human-readable project title>"
subtitle: "<documentation subtitle, inferred conservatively>"
date: "<current date written out>"
lang: en-US
papersize: a4
fontsize: 10pt
geometry:
  - top=20mm
  - bottom=22mm
  - left=22mm
  - right=22mm
colorlinks: false
toc: true
toc-depth: 2
---
```

Adjust `papersize` to the printer/user preference. Do not insert extra prose between files.

Create `/tmp/<repo-name>-print-preview/print-layout.lua` to constrain Markdown table widths and prevent wide auto-sized tables:

```lua
function Table(tbl)
  local widths = {
    [2] = {0.24, 0.76},
    [3] = {0.20, 0.35, 0.45},
    [4] = {0.16, 0.28, 0.28, 0.28},
  }
  local selected = widths[#tbl.colspecs]
  if selected then
    for i, width in ipairs(selected) do
      tbl.colspecs[i][2] = width
    end
  end
  return tbl
end
```

## Render

Run from the repository root so relative assets resolve:

```bash
pandoc <combined.md> \
  --from=gfm+yaml_metadata_block \
  --lua-filter=<print-layout.lua> \
  --pdf-engine=tectonic \
  --top-level-division=chapter \
  --syntax-highlighting=tango \
  -V documentclass=report \
  -V classoption=openany,oneside \
  -V mainfont='STIX Two Text' \
  -V monofont=Menlo \
  --output=<output.pdf>
```

If those fonts are unavailable, select installed, readable serif and monospace fonts. Capture renderer warnings. Fix missing glyphs, clipped content, excessive blank pages, and meaningful overfull boxes before presenting the result. Do not claim a clean render if warnings remain.

Use `pypdf` to verify the PDF opens and report its page count. Keep the print-ready PDF in the temporary preview directory initially.

## Preview

1. Extract representative single-page PDFs with `pypdf`: cover, contents, a normal prose page, and a dense page containing a table or code.
2. Render those pages using Quick Look:
   ```bash
   qlmanage -t -s 1200 -o <preview-dir> <single-page.pdf>
   ```
3. Use Pillow to assemble the four rendered PNGs into a labeled 2x2 JPEG contact sheet.
4. Open both the contact sheet and full PDF with `open` so the user can inspect them.
5. Report page size, page count, included files, PDF path, contact-sheet path, detected printer, and any unresolved layout warnings. Explicitly state that nothing has printed.

## After approval

- Apply requested layout changes and regenerate previews as needed.
- If asked to save the PDF, copy or move it to `~/Downloads/<repo-name>-documentation.pdf`; never overwrite an existing file—append a timestamp instead.
- Print only after an explicit print request. Before printing, state printer name, page count, paper size, color/grayscale mode, simplex/duplex support, and intended copies. Use `lp` with explicit options only after confirmation.
