import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Client } from '../client';
import { UserService } from '../_services';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html'
})
export class ViewAppointmentComponent implements OnInit {
  errMess: string;
  fitnessForm: FormGroup;
  fitness: Client;
  users: Client[];
  updateUsersDetails: Client;
  deleteUser: Client;
  trainername = new FormControl;
  showBox: boolean;

  public obj: any = {
    id: 0
  };

  @ViewChild('closeBtn', { static: false }) closeBtn: ElementRef;
  @ViewChild('hideModal', { static: false }) hideModal: ElementRef;

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


  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.createForm();
  }


  ngOnInit() {
    this.loadData();
  }

  displayBox() {
    this.showBox = !this.showBox;
  }

  replaceValue() {
    this.fitnessForm.patchValue({
      trainerpreference: this.trainername.value,
    })
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

  loadData() {
    this.userService.getfitnessdata().subscribe(users => this.users = users, errmess => this.errMess = <any>errmess);
  }

  setValue(user) {
    this.deleteUser = user;
    this.obj.id = user.id;
  }

  deleteAppointment() {
    this.userService.deleteappointmentdata({ ...this.deleteUser, ...this.obj }).subscribe(() => this.loadData(), errmess => this.errMess = <any>errmess);
    this.closeBtn.nativeElement.click();
  }

  updateValue() {
    this.fitnessForm.patchValue({
      inr: this.fitnessForm.value.packages,
      paisa: '.00'
    })
  }

  updateDetails(editUser) {

    this.fitnessForm.patchValue({
      firstname: editUser.firstname,
      lastname: editUser.lastname,
      phonenumber: editUser.phonenumber,
      email: editUser.email,
      age: editUser.age,
      pincode: editUser.pincode,
      city: editUser.city,
      state: editUser.state,
      country: editUser.country,
      packages: editUser.packages,
      trainerpreference: editUser.trainerpreference,
      physiotherapist: editUser.physiotherapist,
      streetaddress: editUser.streetaddress,
      inr: editUser.inr,
      paisa: editUser.paisa,
    })
    if ((editUser.trainerpreference != 'Male Trainer') &&
      (editUser.trainerpreference != 'Female Tariner') &&
      (editUser.trainerpreference != 'No preference')) {
      this.fitnessForm.patchValue({
        trainerpreference: 'other'
      })
      this.showBox = true;
      this.trainername.setValue(editUser.trainerpreference);
    }
    else {
      this.showBox = false;
      this.trainername.setValue('');
    }
    this.obj.id = editUser.id;
  }

  updateApointment() {
    if( this.fitnessForm.value.trainerpreference == 'other'){
      this.replaceValue();
    }
    this.userService.updatefitnessdata( { ...this.fitnessForm.value, ...this.obj }).subscribe(() => this.loadData(), errmess => this.errMess = <any>errmess);
    this.hideModal.nativeElement.click();
  }
}
