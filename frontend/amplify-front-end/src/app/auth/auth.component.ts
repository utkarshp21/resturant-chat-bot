import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AmplifyService } from 'aws-amplify-angular'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  isLoggedIn = false;

  constructor(private amplifyService: AmplifyService, public router: Router) {
    this.amplifyService.authStateChange$.subscribe(authState => {
      const isLoggedIn = authState.state === 'signedIn' || authState.state === 'confirmSignIn';
      if (this.isLoggedIn && !isLoggedIn) {
        router.navigate(['']);
      } else if (!this.isLoggedIn && isLoggedIn) {
        router.navigate(['/chatBot']);
      }
      this.isLoggedIn = isLoggedIn;
    });
  }

}
