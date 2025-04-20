import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormService {
  resetForm(form: FormGroup) {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control instanceof FormControl) {
        control.reset();
      }
    });
  }

  patchForm(form: FormGroup, data: any) {
    form.patchValue(data);
  }
}
