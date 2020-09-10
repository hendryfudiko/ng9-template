import { Component, OnInit } from '@angular/core';
import { getData } from './hello';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular9-template';
  data: any;

  ngOnInit() {
    this.data = getData();
  }
}
