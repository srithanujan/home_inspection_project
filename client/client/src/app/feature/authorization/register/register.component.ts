import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthorizationService } from '../services/authorization.service';




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authorizationService: AuthorizationService) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {

  }

  // register() {
  //   this.isLoading = true;
  //   if (this.registerForm.valid) {
  //     const bodyData = this.registerForm.value;
  //     this.http.post("http://localhost:3000/teachers/createStudent", bodyData).subscribe(
  //       (resultData: any) => {
  //         alert("Inspector Registered Successfully");
  //         this.router.navigateByUrl('/login');
  //       },
  //       error => {
  //         console.error("Error registering Inspector", error);
  //         this.isLoading = false;
  //       }
  //     );
  //   } else {
  //     alert("Please fill in the form correctly");
  //     this.isLoading = false;
  //   }
  // }

  register(): void {
    this.isLoading = true;
    if (this.registerForm.valid) {
      const bodyData = this.registerForm.value;
      this.authorizationService.register(bodyData).subscribe(
        (resultData: any) => {
          alert("Inspector Registered Successfully");
          this.router.navigateByUrl('/login');
        },
        error => {
          console.error("Error registering Inspector", error);
          this.isLoading = false;
        }
      );
    } else {
      alert("Please fill in the form correctly");
      this.isLoading = false;
    }
  }


  save() {
    this.register();
  }
}
