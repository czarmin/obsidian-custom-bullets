import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { Extension } from '@codemirror/state';

import { bulletListPlugin } from './view';

interface CustomBulletsSettings {
	dash: string;
	star: string;
	plus: string;
	doColor: boolean;
	color: string;
}

const DEFAULT_SETTINGS: CustomBulletsSettings = {
	dash: '•',
	star: '•',
	plus: '•',
	doColor: false,
	color: '#ffffff',
}

export default class CustomBullets extends Plugin {
	static settings: CustomBulletsSettings;

	private editorExtension: Extension[] = [];

	async onload() {
		await this.loadSettings();
		
		this.updateEditorExtension();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new BulletSettingTab(this.app, this));
		this.registerEditorExtension(this.editorExtension);
	}

	updateEditorExtension() {
		// Empty the array while keeping the same reference
		// (Don't create a new array here)
		this.editorExtension.length = 0;
	
		// Create new editor extension
		const bulletListExt = bulletListPlugin;
		// Add it to the array
		this.editorExtension.push(bulletListExt);
	
		const color = CustomBullets.settings.color.length == 7 ? CustomBullets.settings.color : "#ffffff";
		if(CustomBullets.settings.doColor) {
			if(document.querySelectorAll(".custom-style-bullet").length == 0) {
				const style = document.createElement('style');
				style.className = "custom-style-bullet";
				style.innerHTML = `
				.HyperMD-list-line > img + span {
					color: ${color};
				}
				`;
				document.querySelector('head')?.appendChild(style);
			} else {
				const style = document.querySelectorAll(".custom-style-bullet")[0];
				style.innerHTML = `
				.HyperMD-list-line > img + span {
					color: ${color};
				}
				`;
			}
		} else {
			if(document.querySelectorAll(".custom-style-bullet").length > 0) {
				const style = document.querySelectorAll(".custom-style-bullet")[0];
				style.innerHTML = ``;
			}
		}

		// Flush the changes to all editors
		this.app.workspace.updateOptions();
	}

	onunload() {
		if(document.querySelectorAll(".custom-style-bullet").length > 0) {
			const style = document.querySelectorAll(".custom-style-bullet")[0];
			style.remove();
		}
	}

	async loadSettings() {
		CustomBullets.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(CustomBullets.settings);
		this.updateEditorExtension();
	}
}

class BulletSettingTab extends PluginSettingTab {
	plugin: CustomBullets;

	constructor(app: App, plugin: CustomBullets) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings to customize bullet list'});

		new Setting(containerEl)
			.setName('Dash (-)')
			.setDesc('Display character for dash bullet')
			.addText(text => text
				.setPlaceholder('Enter character')
				.setValue(CustomBullets.settings.dash)
				.onChange(async (value) => {
					if(value == "")
						value = DEFAULT_SETTINGS.dash;
					CustomBullets.settings.dash = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
		.setName('Star (*)')
		.setDesc('Display character for star bullet')
		.addText(text => text
			.setPlaceholder('Enter character')
			.setValue(CustomBullets.settings.star)
			.onChange(async (value) => {
				if(value == "")
					value = DEFAULT_SETTINGS.star;
				CustomBullets.settings.star = value;
				await this.plugin.saveSettings();
			}));

		new Setting(containerEl)
		.setName('Plus (+)')
		.setDesc('Display character for plus bullet')
		.addText(text => text
			.setPlaceholder('Enter character')
			.setValue(CustomBullets.settings.plus)
			.onChange(async (value) => {
				if(value == "")
					value = DEFAULT_SETTINGS.plus;
				CustomBullets.settings.plus = value;
				await this.plugin.saveSettings();
			}));
		
		new Setting(containerEl)
		.setName('Custom Color')
		.setDesc('Enable custom coloring')
		.addToggle(but => but
			.setValue(CustomBullets.settings.doColor)
			.onChange(async (value) => {
				CustomBullets.settings.doColor = value;
				await this.plugin.saveSettings();
			}));
			
		new Setting(containerEl)
		.setName('Color')
		.setDesc('Custom color of bullets')
		.addColorPicker(col => col
			.setValue(CustomBullets.settings.color)
			.onChange(async (value) => {
				CustomBullets.settings.color = value;
				await this.plugin.saveSettings();
			}));
	}
}
