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

## Required Explanation Style

Use beginner-friendly explanations throughout every generated document, including deep dives, reference introductions, diagram labels, and troubleshooting. Do not satisfy this requirement only in the opening summary or delivery message.

- Assume basic familiarity with the project's programming language, but no knowledge of its architecture, domain terms, or internal APIs.
- Start with what the project does, who it is for, and a simple problem it solves. Explain related packages or products before comparing their internals.
- Use plain language, short sentences, and reader-facing headings such as "How a request gets answered" rather than abstract labels alone.
- Define each unfamiliar term before using it. Introduce the plain-language meaning first, then the exact code name: for example, "a saved step, called a checkpoint." Avoid dense noun phrases and unexplained acronyms.
- Explain non-trivial behavior in this order: **problem → concrete example or short trace → solution**. State why the solution is necessary and what limits remain. Reuse a small running example when it helps connect sections.
- Introduce one idea at a time. Explain responsibilities and observable behavior before method inventories, schemas, signatures, or implementation details.
- Put a minimal complete example near the beginning. Explain prerequisites, where code goes, what each important step does, and the expected result. Label fragments and reference notation clearly; identify variables supplied by earlier examples. Do not present an unverified expected result as an observed result.
- Keep advanced material comprehensive but clearly marked as optional or reference. Offer a first-reading path and feature-specific paths; do not make beginners memorize lookup tables to understand the basics.
- Use concrete explanations for failure and recovery: what was saved, what happened next, what may repeat, and what the user or application must do. Explain safety caveats in plain language without weakening them.
- Preserve exact API names, accurate source references, and important edge cases. Beginner-friendly means easier to understand, not less technically correct. Do not invent analogies that imply unsupported guarantees.

## 3. Plan the Document

Organize the HTML into a natural learning sequence with numbered sections and a linked table of contents. Lead with the practical problem and a small example; introduce vocabulary before relying on it:

### Big Picture

1. **What the project does**: the problem it solves, a concrete example, its relationship with neighboring packages/products, then the main components. Put detailed source maps in optional reference material.
2. **First useful example**: a minimal complete usage example with prerequisites, setup steps, expected output, and limitations; explain actual initialization and configuration discovery.
3. **Names readers will see**: plain-language definitions of core concepts, followed by their code names and a small example of how they work together.

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
1. The practical question or problem, in plain language.
2. A concrete example or short trace showing the behavior.
3. How the component solves it, why it is needed, and its limitations.
4. Relevant visuals and code examples with explanations and expected outcomes.
5. Optional implementation/API reference, related sections, and source links.

Do not lead a section with a dense implementation summary and expect the example or glossary later to make it understandable.

## 5. Include Useful Visuals

Include visuals, figures, diagrams, and plots wherever they improve understanding—not merely as decoration.

- Use architecture diagrams for component boundaries and dependencies.
- Use flowcharts or sequence diagrams for startup, agent loops, requests, and data movement.
- Use state diagrams or timelines when transitions or ordering matter.
- Use annotated figures to explain complex structures or interfaces when appropriate.
- Use plots for meaningful quantitative information only when supported by actual project data or reproducible measurements. Label units, axes, legends, and data sources; never fabricate benchmark results. Mark illustrative data clearly and do not present it as measured evidence.
- Prefer inline SVG for crisp, self-contained diagrams and plots. If using Mermaid or another renderer, embed the rendered output so the final document works offline without external scripts.
- Wrap visuals in `<figure>` with descriptive captions. Provide text alternatives or accessible labels, readable contrast, and explanations that do not depend on color alone.
- Keep labels legible at desktop and mobile sizes. Use plain-language labels where possible, define necessary code names in the surrounding text, and explain how to follow each diagram. Verify arrows, relationships, and plotted values against the source.

## 6. Validate Before Delivery

- Check HTML structure, unique section IDs, table-of-contents targets, internal links, and asset paths.
- Verify source file references and examples against the codebase. Run safe, relevant example checks when feasible and report anything not checked.
- Preview in a browser when available: inspect desktop/mobile layouts, code and tables, figures, and print rendering. Confirm visuals render without network access. Report if browser verification could not run.
- Use available project validation tools without installing dependencies unnecessarily.
- Review the document as a first-time reader: check that terms are defined before use, the opening example has enough setup to follow, advanced material is clearly marked, and explanations use concrete behavior rather than unexplained implementation language.

### Quality Checklist

- [ ] One HTML document, not a Markdown series
- [ ] Beginner-friendly explanations throughout, not just in the introduction
- [ ] Unfamiliar terms defined before use; plain-language headings and diagram labels
- [ ] Problem → concrete example/trace → solution for non-trivial behavior
- [ ] Practical big picture first, with "why" as well as "what"
- [ ] Minimal complete example near the beginning, with setup and expected results
- [ ] Advanced/reference material clearly marked; easy first-reading path
- [ ] Real source references and accurate code examples
- [ ] Useful visuals, figures, diagrams, and plots where warranted
- [ ] Captions, text alternatives, and readable visual labels
- [ ] No invented APIs, rationale, or measurements
- [ ] Working table of contents, cross-references, and local assets
- [ ] Responsive, readable, offline-friendly presentation
- [ ] Validation results reported honestly

## Common Pitfalls

- Do not merely copy code comments or repeat boilerplate. Explain unfamiliar setup and multi-step behavior rather than assuming they are obvious.
- Do not substitute words such as "kernel," "authority," or "convergence" for an explanation. Describe what actually happens, then introduce a technical term only when useful.
- Do not simplify away failure modes, recovery limits, or distinctions between similar APIs.
- Do not skip the big picture or force irrelevant sections onto small projects.
- Do not use placeholder sections such as "This will be expanded later."
- Do not add unrelated source changes, tests, or README edits solely to deliver the documentation. Add a README link only if requested.

## Deliver

Report the HTML path, any supporting asset paths, coverage, and validation results. Ask whether any explanations need clarification. The goal is that a new developer can read the document, understand the project, and start contributing.
