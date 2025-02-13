import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthorizationService } from '../services/authorization.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLogin: boolean = true;
  errorMessage: string = "";
  isLoading: boolean = false;
  authToken: string = '';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private authorizationService: AuthorizationService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  ngOnInit() {
    this.authorizationService.clearAuthToken();
  }



  login(): void {
    this.isLoading = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authorizationService.login(email, password).subscribe(
        (resultData: any) => {
          if (resultData.status) {
            this.authorizationService.setAuthToken('authToken');
            this.router.navigateByUrl('/inspection');
          } else {
            this.errorMessage = "Incorrect Email or Password";
            alert(this.errorMessage);
            this.isLoading = false;
            this.authorizationService.clearAuthToken();
          }
        },
        error => {
          this.errorMessage = "An error occurred during login";
          this.isLoading = false;
        }
      );
    } else {
      this.errorMessage = "Please fill in the form correctly";
      this.isLoading = false;
    }
  }
}


// F9sEsT0Ll2x55rWEYLnBfBLJXXt30uRTPHjhZGzp7ZepRpvnNDwgJQQJ99AKACAAAAAU7KOiAAASAZDOBUUq
