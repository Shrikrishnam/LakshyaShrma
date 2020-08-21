import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Client } from '../client';
import { from } from 'rxjs';
import { UserService } from '../_services/user.service';


export class Fitness {
  constructor(
    public inr: number,
    public paisa: number,
    public streetaddress: string,
    public city: string,
    public state: string,
    public country: string,
    public pincode: number,
    public phonenumber: number,
    public email: string,
    public firstname: string,
    public lastname: string,
    public age: number,
    public trainerpreference: string,
    public physiotherapist: string,
    public packages: string
  ) { }
}

@Component({
  selector: 'app-place-fitness-trainer-appointment',
  templateUrl: './place-fitness-trainer-appointment.component.html'

})
export class PlaceFitnessTrainerAppointmentComponent implements OnInit {



  fitnessForm: FormGroup;
  fitness: Client;
  errMess: string;
  trainername = new FormControl;
  showBox: boolean = false;

  public obj: any = {

    id: 0

  };


  formErrors = {
    'firstname': '',
    'lastname': '',
    'phonenumber': '',
    'email': '',
    'age': '',
    'pincode': '',
    'city': '',
    'state': '',
    'country': '',
    'packages': '',
    'streetaddress': '',
    'inr': '',
    'paisa': '',
  };

  validationMessages = {
    'firstname': {
      'required': 'First Name is required.',
      'pattern': 'First Name contain only letters and spaces.'
    },
    'lastname': {
      'required': 'Last Name is required.',
      'pattern': 'Last Name contain only letters and spaces.'
    },
    'phonenumber': {
      'required': 'Phone number is required.',
      'pattern': 'phone number must contain 10 digit.'
    },
    'email': {
      'required': 'Email is required.',
      'pattern': 'Email not in valid format.'
    },
    'age': {
      'required': 'Age is required.',
      'pattern': 'Age should be between 18 and 60'
    },
    'pincode': {
      'required': 'Pincode is required.',
      'pattern': 'pincode contain 6 digit only.'
    },
    'city': {
      'required': 'City is required.'
    },
    'state': {
      'required': 'State is required.'
    },
    'country': {
      'required': 'Country is required.'
    },
    'packages': {
      'required': 'Select a Pakckage'
    },
    'streetaddress': {
      'required': 'Street address is required'
    },
    'inr': {
      'required': 'Inr address is required'
    },
    'paisa': {
      'required': 'Paisa address is required'
    },
  };

  constructor(private fb: FormBuilder,
    private userService: UserService) {
    this.createForm();
  }

  createForm(): void {
    this.fitnessForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      phonenumber: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.pattern]],
      age: ['', [Validators.required, Validators.pattern('^1[6-9]$|^[2-5][0-9]$|^60$')]],
      streetaddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],
      trainerpreference: ['', Validators.required],
      physiotherapist: ['', Validators.required],
      packages: [''],
      inr: ['', Validators.required],
      paisa: ['', Validators.required]
    });
    this.fitnessForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.fitnessForm) { return; }
    const form = this.fitnessForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  displayBox() {
    this.showBox = !this.showBox;
  }

  replaceValue() {
    this.fitnessForm.patchValue({
      trainerpreference: this.trainername.value
    })
  }

  updateValue() {
    this.fitnessForm.patchValue({
      inr: this.fitnessForm.value.packages,
      paisa: '.00'
    })
  }


  ngOnInit() {

  }

  onSubmit() {
    if( this.fitnessForm.value.trainerpreference == 'other'){
      this.replaceValue();
    }
    this.userService.postfitnessdata({ ...this.fitnessForm.value, ...this.obj }).subscribe(errmess => this.errMess = <any>errmess);
    this.fitnessForm.reset({
      firstname: '',
      lastname: '',
      email: '',
      age: '',
      phonenumber: '',
      streetaddress: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      trainerpreference: '',
      physiotherapist: '',
      inr: '',
      paisa: ''
    });
    this.trainername.reset('')
  }

}