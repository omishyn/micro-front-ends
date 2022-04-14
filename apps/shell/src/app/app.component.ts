import {Component, OnInit} from '@angular/core';
import {MicroFrontendService} from "./microfrontends/micro-frontend.service";
import {MicroFrontend} from "./microfrontends/micro-frontend.model";

@Component({
  selector: 'micro-front-ends-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'shell';
  microFrontends: MicroFrontend[] = [];

  constructor(public mfService: MicroFrontendService) {}

  public ngOnInit(): void {
    this.microFrontends = this.mfService.getMicroFrontends();
    console.log('ngOnInit', this.microFrontends);
  }
}
