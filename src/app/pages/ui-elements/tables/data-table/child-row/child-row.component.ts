import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-child-row',
  templateUrl: './child-row.component.html',
  styleUrls: ['./child-row.component.scss']
})
export class ChildRowComponent implements OnInit {
  @ViewChild('myTable', /* TODO: add static flag */ {static: false}) table: any;

  public rows: any[] = [];
  public expanded: any = {};
  public timeout: any;

  constructor() {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  ngOnInit() {}

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/100k.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {}

}
