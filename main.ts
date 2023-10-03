import { Plugin, TFile } from 'obsidian';

interface ZettelkastenOutlinerSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ZettelkastenOutlinerSettings = {
	mySetting: 'default'
}

export default class ZettelkastenOutliner extends Plugin {
	settings: ZettelkastenOutlinerSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'zettelkasten-outliner-create-outline',
			name: 'Create Zettelkasten Outline',
			callback: async () => {
				const currentFile = this.app.workspace.getActiveFile();
				if (currentFile) {
					const outputFile = await this.app.vault.create(`Zettelkasten Outline ${new Date().getTime()}.md`, "");
					this.parseZettel(outputFile, currentFile, 0);
				}
			}
		});
	}

	onunload() {

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

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
