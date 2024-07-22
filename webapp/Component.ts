import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import Device from "sap/ui/Device";
import Theming from "sap/ui/core/Theming";
import Localization from "sap/base/i18n/Localization";

interface IUserSettingsPreference {
	theme: string;
	language: string;
}

/**
 * @namespace br.com.myweekplanner
*/
export default class Component extends UIComponent {
	private _userSettingsPreference: IUserSettingsPreference;

	public static metadata = {
		manifest: "json",
	};

	private contentDensityClass: string;

	public init(): void {
		// call the base component's init function
		super.init();

		// create the device model
		this.setModel(models.createDeviceModel(), "device");

		// get the user settings preference
		this._userSettingsPreference = {
			theme: this.getUserThemePreference(),
			language: this.getLanguagePreference(),
		}

		// save the user settings preference in the user settings browser
		this.setUserSettingsPreference();

		// apply the user settings preference
		Theming.setTheme(this._userSettingsPreference.theme);
		Localization.setLanguage(this._userSettingsPreference.language);

		// create the views based on the url/hash
		this.getRouter().initialize();
	}

	/**
	 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
	 * design mode class should be set, which influences the size appearance of some controls.
	 * @public
	 * @returns css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
	 */
	public getContentDensityClass(): string {
		if (this.contentDensityClass === undefined) {
			// check whether FLP has already set the content density class; do nothing in this case
			if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
				this.contentDensityClass = "";
			} else if (!Device.support.touch) {
				// apply "compact" mode if touch is not supported
				this.contentDensityClass = "sapUiSizeCompact";
			} else {
				// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
				this.contentDensityClass = "sapUiSizeCozy";
			}
		}
		return this.contentDensityClass;
	}

	private getUserSettingsPreference(): IUserSettingsPreference {
		const sUserSettingsPreference = localStorage.getItem("userSettingsPreference");

		if (sUserSettingsPreference) {
			return JSON.parse(sUserSettingsPreference) as IUserSettingsPreference;
		}

		return {
			theme: this.getUserThemePreference(),
			language: this.getLanguagePreference(),
		};
	}

	private getUserThemePreference(): string {
		// get the user theme preference from the user settings browser
		const sUserThemePreference = localStorage.getItem("userThemePreference");

		if (sUserThemePreference) {
			return sUserThemePreference;
		}

		const bDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
		return bDarkTheme.matches ? "sap_horizon_dark" : "sap_horizon";
	}

	private getLanguagePreference(): string {

		const sLanguage = Localization.getLanguage();
		return sLanguage;
	}

	private setUserSettingsPreference(): void {
		localStorage.setItem("userSettingsPreference", JSON.stringify(this._userSettingsPreference));
	}

}
