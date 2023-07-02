import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree
} from "@angular/router";
import { AuthenticationService } from '../services/authentication.service';
// import { AuthService } from "";
// debugger
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private authService: AuthenticationService,
		private router: Router) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean | Promise<boolean> {
		var isAuthenticated = true;
		// this.authService.getAuthStatus();
		if (!isAuthenticated) {
			this.router.navigate(['/login']);
		}
		return isAuthenticated;
	}
}
