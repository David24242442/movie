import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { ProgressBarModule } from 'primeng/progressbar';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule , RouterModule,CommonModule, ProgressBarModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {
  username = ""
  loginForm: FormGroup;
  showValidationMessages = false;
  errorMessage: string | null = null;
  progressbar = false;

  constructor(private fb: FormBuilder, private router: Router, private auth: Auth, private service:UserService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required]
    });
  }
  onSignup(){
    const username = this.loginForm.get('username')?.value;
    if (username) {
      this.service.setUsername(username);
    } 
  }

  async onSubmit() {
    if (this.loginForm.valid && this.loginForm.get('password')?.value === this.loginForm.get('confirmpassword')?.value) {
      this.progressbar = true;
      try {
        const email = this.loginForm.get('email')?.value;
        const username = this.loginForm.get('username')?.value;
        
        const userCredential = await createUserWithEmailAndPassword(
          this.auth,
          email,
          this.loginForm.get('password')?.value
        );
  
        if (username && email) {
          await this.service.saveUserInfo(email, username);
          console.log('Username saved:', username, 'for email:', email);
        }
        
        this.service.setUsername(username);
        await this.router.navigate(["/home"]);
      } catch (error: any) {
        this.errorMessage = 'Failed to sign up. Please check your credentials.';
        console.error('Signup error:', error);
      } finally {
        this.progressbar = false;
      }
    }
  }
  
  hideValidation(controlName: string) {
    const control = this.loginForm.get(controlName);
    if (control) {
      control.markAsUntouched();
    }
    this.showValidationMessages = false; // Hide validation messages
  }
}