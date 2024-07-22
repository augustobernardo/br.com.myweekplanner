import BaseController from "./BaseController";

/**
 * @namespace br.com.myweekplanner.controller
 */
export default class App extends BaseController {
	public onInit(): void {
		// apply content density mode to root view
		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		// apply the user theme preference
		this.applyUserThemePreference();
	}
}
