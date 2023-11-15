import { Plugin, TFile } from 'obsidian';

export default class ZettelkastenOutliner extends Plugin {
	async onload() {
		this.addCommand({
			id: 'create-outline',
			name: 'Create outline',
			checkCallback: (checking: boolean) => {
				const currentFile = this.app.workspace.getActiveFile();

				if (!!currentFile) {
					if (checking) {
						return true;
					} else {
						this.app.vault.create(`Zettelkasten Outline ${new Date().getTime()}.md`, "").then((outputFile: TFile) => {
							this.parseZettel(outputFile, currentFile, 0);
						});
					}
				} else {
					return false;
				}
			},
		});
	}

	getChildrenFiles(file: TFile): TFile[] {
		let children = []	as TFile[];
		const linkToFile = `[[${file.path.replace(/\.md$/, "")}]]`;
		this.app.vault.getMarkdownFiles().forEach((markdownFile) => {
			if (this.app.metadataCache.getFileCache(markdownFile)?.frontmatter?.parent === linkToFile) {
				children.push(markdownFile);
			}
		});
		return children;
	}

	parseZettel(outputFile: TFile, zettel: TFile, indentationLevel: number) {
		this.app.vault.append(outputFile, this.generateListItem(zettel, indentationLevel));
		this.getChildrenFiles(zettel).forEach((child) => {
			this.parseZettel(outputFile, child, indentationLevel + 1);
		});
	}

	generateListItem(file: TFile, indentationLevel: number): string {
		let identation = "";
		for (let i = 0; i < indentationLevel; i++) {
			identation = identation.concat("  ");
		}

		return `${identation}- [[${file.path.replace(/\.md$/, "")}]]\n`;
	}
}
