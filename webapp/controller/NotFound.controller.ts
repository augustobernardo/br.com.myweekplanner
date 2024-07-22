import BaseController from "br/com/myweekplanner/controller/BaseController"

/**
 * @namespace br.com.myweekplanner.controller
 */
export default class NotFound extends BaseController {
	private onBackToLogin() {
		this.getRouter().navTo("login");
	}
}
