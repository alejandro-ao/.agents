---
description: Explore a codebase and create beginner-friendly HTML documentation with useful visuals
---

Explore the project and create comprehensive, beginner-friendly exploratory documentation as a single HTML document, not a series of Markdown files. Project path, output directory, and additional preferences: $ARGUMENTS

Use the provided project path. If missing, ask which project to explore. Read its repository instructions before exploring. Resolve relative output paths against the project root.

## 1. Confirm the Output Location

Before exploring or writing files, ask where the generated documentation should be located. Do not assume a directory. If the user already provided a location, use it without asking again.

Example: "Where should I place the HTML documentation? For example, `.exploration/`, `docs/`, or another path."

Wait for the answer before creating documentation files. Treat the chosen path as `<docs-directory>`. Write the final document to `<docs-directory>/index.html`. Preserve unrelated files and existing documentation; do not overwrite user-authored content without approval.

## 2. Understand the Project

- Inspect the directory structure, root README, package manifests, configuration, and repository instructions.
- Trace real entry points, core abstractions, component interactions, and data flow through the source.
- Read relevant tests and examples to verify behavior. Exclude dependencies, build output, vendor directories, and generated files from initial discovery.
- Use file-reading tools for source inspection. Ground explanations in actual code and file paths.
- Distinguish verified behavior from inference. Do not invent design rationale, APIs, measurements, or features.

## 3. Plan the Document

Organize the HTML into a natural learning sequence with numbered sections and a linked table of contents:

### Big Picture

1. **Architecture overview**: package/directory structure, component connections, and evidenced design decisions.
2. **Entry point / startup flow**: initialization and configuration discovery.
3. **Core concepts**: main abstractions, data structures, and interfaces.

### Deep Dives

4. **Major components**: responsibilities, key methods, and interactions.
5. **Data flow**: state management, event/hook systems, and important execution paths.
6. **Configuration**: settings, environment variables, and file formats.

### Reference

7. **API and usage reference**: real signatures, types, and runnable examples.
8. **Troubleshooting**: evidenced issues, debugging techniques, and migrations where applicable.

Adapt coverage to project size rather than forcing every section:

| Project Size | Suggested Major Sections | Focus |
|--------------|--------------------------|-------|
| Small (<10 source files) | 3-5 | Core concepts |
| Medium (10-50 source files) | 5-8 | Architecture and key components |
| Large (50+ source files) | 10-15 | Broad coverage with deep dives |

Project-specific topics:
- **Agent/SDK**: agent loop, tools, system prompt construction, event hooks, and extensions where present.
- **CLI**: entry point, argument parsing, commands, configuration, installation/uninstall.
- **Web**: frontend/backend architecture, routing, state, API layer, deployment.
- **Library**: public API, usage examples, integration patterns.

## 4. Write the HTML

Deliver a complete, polished HTML5 document that opens directly in a browser without a build step or server. Prefer a self-contained file with embedded CSS and inline SVG or embedded images; avoid network dependencies and CDN scripts.

- Include `<!doctype html>`, language, charset, viewport metadata, and a descriptive title.
- Use semantic headings, navigation, main content, sections, tables, code blocks, and figures.
- Provide a linked table of contents and stable section IDs; cross-reference related sections with fragment links rather than separate Markdown documents.
- Use readable typography, constrained line lengths, clear spacing, responsive layouts, and print styles.
- Make wide tables and code blocks usable on narrow screens. Escape source code correctly inside `<pre><code>`.
- Include source file references and function/class names so readers can verify explanations.
- Do not generate a parallel Markdown documentation series. Supporting local assets are acceptable when embedding is impractical; keep paths relative and include them in the delivery.

Each substantive section should explain:
1. What the component or concept is, why it exists, and how it fits into the system.
2. Key functions/classes, important patterns, and file locations.
3. Relevant visuals and real code examples.
4. Related sections and source references.

## 5. Include Useful Visuals

Include visuals, figures, diagrams, and plots wherever they improve understanding—not merely as decoration.

- Use architecture diagrams for component boundaries and dependencies.
- Use flowcharts or sequence diagrams for startup, agent loops, requests, and data movement.
- Use state diagrams or timelines when transitions or ordering matter.
- Use annotated figures to explain complex structures or interfaces when appropriate.
- Use plots for meaningful quantitative information only when supported by actual project data or reproducible measurements. Label units, axes, legends, and data sources; never fabricate benchmark results. Mark illustrative data clearly and do not present it as measured evidence.
- Prefer inline SVG for crisp, self-contained diagrams and plots. If using Mermaid or another renderer, embed the rendered output so the final document works offline without external scripts.
- Wrap visuals in `<figure>` with descriptive captions. Provide text alternatives or accessible labels, readable contrast, and explanations that do not depend on color alone.
- Keep labels legible at desktop and mobile sizes. Verify arrows, relationships, and plotted values against the source.

## 6. Validate Before Delivery

- Check HTML structure, unique section IDs, table-of-contents targets, internal links, and asset paths.
- Verify source file references and examples against the codebase. Run safe, relevant example checks when feasible and report anything not checked.
- Preview in a browser when available: inspect desktop/mobile layouts, code and tables, figures, and print rendering. Confirm visuals render without network access. Report if browser verification could not run.
- Use available project validation tools without installing dependencies unnecessarily.

### Quality Checklist

- [ ] One HTML document, not a Markdown series
- [ ] Clear, beginner-friendly language; jargon explained
- [ ] Architecture first, with "why" as well as "what"
- [ ] Real source references and accurate code examples
- [ ] Useful visuals, figures, diagrams, and plots where warranted
- [ ] Captions, text alternatives, and readable visual labels
- [ ] No invented APIs, rationale, or measurements
- [ ] Working table of contents, cross-references, and local assets
- [ ] Responsive, readable, offline-friendly presentation
- [ ] Validation results reported honestly

## Common Pitfalls

- Do not over-explain obvious operations or merely copy code comments.
- Do not skip the big picture or force irrelevant sections onto small projects.
- Do not use placeholder sections such as "This will be expanded later."
- Do not add unrelated source changes, tests, or README edits solely to deliver the documentation. Add a README link only if requested.

## Deliver

Report the HTML path, any supporting asset paths, coverage, and validation results. Ask whether any explanations need clarification. The goal is that a new developer can read the document, understand the project, and start contributing.
