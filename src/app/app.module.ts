import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { WINDOW } from './custom.token';
import { CompareToTestDirective } from './compare-to-test.directive';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent,
    CompareToTestDirective
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    StoreModule.forRoot({}, {})
  ],
  providers: [
    { provide: WINDOW, useValue: 'yehehhe' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
