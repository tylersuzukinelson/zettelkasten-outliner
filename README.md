# Zettelkasten Outliner

## Assumptions

This plugin currently assumes that your Zettelkasten structure is dictated by the `parent` property in the note's frontmatter. Additionally, it assumes that this `parent` property is a single link to another note.

## How to use

- Open the note you want to generate an outline for. _Note: This plugin will generate an outline for the opened note and all its children based on the `parent` property in the frontmatter._
- Run `Zettelkasten Outliner: Create Zettelkasten Outline` from the command palette.
- A new note will be created with the resulting outline.
