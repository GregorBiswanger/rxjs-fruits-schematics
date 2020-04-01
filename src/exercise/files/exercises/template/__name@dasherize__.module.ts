import { NgModule } from '@angular/core';

import { <%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';
import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [<%= classify(name) %>Component],
  imports: [
    SharedModule,
    <%= classify(name) %>RoutingModule
  ]
})
export class <%= classify(name) %>Module { }
