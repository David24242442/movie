import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,CommonModule,ProgressBarModule, ToastModule] 
})

export class SigninComponent {
  username: string | null = null;
  errorMessage: string | null = null;
  loginForm: FormGroup;
  showValidationMessages = false;
  progressbar = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private auth: Auth, 
    private service: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (!this.loginForm.valid) {
      this.showValidationMessages = true;
      return;
    }

    const { email, password } = this.loginForm.value;
    this.progressbar = true;

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        const fetchedUsername = await this.service.fetchusername(email);
        if (fetchedUsername) {
          this.service.setUsername(fetchedUsername);
          await this.router.navigate(['/home']);
        } else { 
          console.log(userCredential.user);
          console.log('Debug: Email used for fetch:', email);
          this.errorMessage = 'Username not found for this account';
        }
      }
    } catch (error: any) {
      this.handleAuthError(error);
    } finally {
      this.progressbar = false;
    }
  }

  private handleAuthError(error: any) {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/user-not-found': 'No account found with this email.',
      'default': 'An error occurred during sign in. Please try again.'
    };
    
    this.errorMessage = errorMessages[error.code] || errorMessages['default'];
    console.error('Auth error:', error);
  }

  hideValidation(controlName: string) {
    const control = this.loginForm.get(controlName);
    if (control) {
      control.markAsUntouched();
    }
    this.showValidationMessages = false;
  }
}