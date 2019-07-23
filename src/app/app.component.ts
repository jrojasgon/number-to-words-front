import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Number to words'
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

    this.convertForm.controls['numberInput'].valueChanges
      .subscribe(() => {
        this.convert()
      });
  }

  convert() {
    let value: number = this.convertForm.get('numberInput').value
    this.showError = false;
    if (this.convertForm.valid) {
      if (this.validateValues(value)) {
        this.showLoading = true
        this.showError = false

        this.httpClient.get("http://localhost:9099/convertToWord/" + value, { responseType: 'text' })
          .subscribe(data => {
            this.result = data
            this.showLoading = false
          })
      }
      else {
        this.showError = true;
      }
    }
  }

  validateValues(value: number): boolean {
    return value > -2147483648 && value < 2147483648
  }
}
