import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from './app.constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Numbers to words'
  public convertForm: FormGroup
  public showLoading = false
  public showError = false
  public result = ""

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.convertForm = this.formBuilder.group({
      numberInput: ['', Validators.required]
    });

    this.convertForm.valueChanges.pipe(
      debounceTime(100)
    ).subscribe(val => {
      this.convert()
    });
  }

  convert() {
    let value: number = this.convertForm.get('numberInput').value
    this.showError = false;
    this.result = ""
    if (this.convertForm.valid) {
      if (this.validateValues(value)) {
        this.showLoading = true
        this.showError = false

        this.httpClient.get<ResultResponse>(AppConstants.SERVICE_ENDPOINT + value, { responseType: 'json' })
          .subscribe(data => {
            this.result = data.result
            this.showError = data.hasError
            this.showLoading = false
          })
      }
      else {
        this.showError = true;
      }
    }
  }

  validateValues(value: number): boolean {
    return value >= -2147483648 && value <= 2147483648
  }
}

export interface ResultResponse {
  result: string
  hasError: boolean
}
