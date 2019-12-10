/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

import {AbstractControl, FormBuilder, FormControl} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {DatePipe} from '@angular/common';

export class CustomValidators {
  constructor(private apiService: ApiService, private datePipe: DatePipe, private builder: FormBuilder) {}


  static alphaNumeric(control: FormControl) {
    if (!control.value || control.value.match(/^[a-zA-Z0-9_\s\-]*$/)) {
      return undefined;
    } else {
      return { alphaNumeric: true };
    }
  }
  static DateError(control: FormControl) {
    const date = new Date( control.value );
    if (!control.value || isNaN(date.getMonth())) {
      return {DateError: true};
    } else {
      return undefined;
    }
  }
}
