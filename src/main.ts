import { App, MarkdownView, Plugin, PluginSettingTab, Setting, View } from 'obsidian';

import { bulletListField } from './field';

interface MyPluginSettings {
	dash: string;
	star: string;
	plus: string;
	doColor: boolean;
	color: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	dash: '•',
	star: '•',
	plus: '•',
	doColor: false,
	color: '#ffffff',
}

export default class MyPlugin extends Plugin {
	static settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new BulletSettingTab(this.app, this));
		this.registerEditorExtension([bulletListField]);
		if(MyPlugin.settings.doColor) {
			if(document.querySelectorAll(".custom-style-bullet").length == 0) {
				let style=document.createElement('style');
				style.className = "custom-style-bullet";
				style.innerHTML = `
				div > img + span {
					color: ${MyPlugin.settings.color};
				}
				`;
				document.querySelector('head')?.appendChild(style);
			} else {
				let style = document.querySelectorAll(".custom-style-bullet")[0];
				style.innerHTML = `
				div > img + span {
					color: ${MyPlugin.settings.color};
				}
				`;
			}
		} else {
			if(document.querySelectorAll(".custom-style-bullet").length > 0) {
				let style = document.querySelectorAll(".custom-style-bullet")[0];
				style.innerHTML = ``;
			}
		}
	}

	onunload() {

	}

	async loadSettings() {
		MyPlugin.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(MyPlugin.settings);
		if(MyPlugin.settings.doColor)
			if(document.querySelectorAll(".custom-style-bullet").length == 0) {
				let style=document.createElement('style');
				style.className = "custom-style-bullet";
				style.innerHTML = `
				div > img + span {
					color: ${MyPlugin.settings.color};
				}
				`;
				document.querySelector('head')?.appendChild(style);
			} else {
				let style = document.querySelectorAll(".custom-style-bullet")[0];
				style.innerHTML = `
				div > img + span {
					color: ${MyPlugin.settings.color};
				}
				`;
			}
		else
			if(document.querySelectorAll(".custom-style-bullet").length > 0) {
				let style = document.querySelectorAll(".custom-style-bullet")[0];
				style.innerHTML = ``;
			}
		console.log("asd");
	}
}

class BulletSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
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
				.setValue(MyPlugin.settings.dash)
				.onChange(async (value) => {
					if(value == "")
						value = DEFAULT_SETTINGS.dash;
					MyPlugin.settings.dash = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
		.setName('Star (*)')
		.setDesc('Display character for star bullet')
		.addText(text => text
			.setPlaceholder('Enter character')
			.setValue(MyPlugin.settings.star)
			.onChange(async (value) => {
				if(value == "")
					value = DEFAULT_SETTINGS.star;
				MyPlugin.settings.star = value;
				await this.plugin.saveSettings();
			}));

		new Setting(containerEl)
		.setName('Plus (+)')
		.setDesc('Display character for plus bullet')
		.addText(text => text
			.setPlaceholder('Enter character')
			.setValue(MyPlugin.settings.plus)
			.onChange(async (value) => {
				if(value == "")
					value = DEFAULT_SETTINGS.plus;
				MyPlugin.settings.plus = value;
				await this.plugin.saveSettings();
			}));
		
		new Setting(containerEl)
		.setName('Custom Color')
		.setDesc('Enable custom coloring')
		.addToggle(but => but
			.setValue(MyPlugin.settings.doColor)
			.onChange(async (value) => {
				MyPlugin.settings.doColor = value;
				await this.plugin.saveSettings();
			}));
			
		new Setting(containerEl)
		.setName('Color')
		.setDesc('Custom color of bullets')
		.addColorPicker(col => col
			.setValue(MyPlugin.settings.color)
			.onChange(async (value) => {
				MyPlugin.settings.color = value;
				await this.plugin.saveSettings();
			}));
	}
}
