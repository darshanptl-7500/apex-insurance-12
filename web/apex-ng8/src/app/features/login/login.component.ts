import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { environment } from '../../../environments/environment';

export interface DemoAccount {
  username: string;
  role: string;
  name: string;
  home?: string;
}

@Component({
  selector: 'apex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  busy = false;
  error: string | null = null;
  demoAccounts: DemoAccount[] = environment.demoAccounts || [];
  demoPassword = environment.demoPassword || 'Password1!';

  constructor(private auth: AuthService, private router: Router) {}

  submit(account?: DemoAccount): void {
    if (!this.username || !this.password) {
      this.error = 'Enter both a username and password.';
      return;
    }
    this.busy = true;
    this.error = null;

    this.auth.login(this.username, this.password).subscribe(
      () => {
        this.busy = false;
        this.router.navigateByUrl((account && account.home) || '/dashboard');
      },
      (err: any) => {
        this.busy = false;
        if (err && err.status === 0) {
          this.error = `Could not reach the Apex API at ${environment.apiBaseUrl}. Confirm the service is running.`;
        } else if (err && err.status === 401) {
          this.error = (err.error && err.error.message) || 'Invalid username or password.';
        } else {
          this.error = (err && err.error && err.error.message) || 'Login failed. Please try again.';
        }
      }
    );
  }

  useDemo(account: DemoAccount): void {
    if (!account || this.busy) {
      return;
    }
    this.username = account.username;
    this.password = this.demoPassword;
    this.submit(account);
  }
}
