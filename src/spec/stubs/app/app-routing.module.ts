// tslint:disable: max-line-length
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscribeComponent } from './exercises/subscribe/subscribe.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'subscribe', pathMatch: 'full' },
  { path: 'subscribe', component: SubscribeComponent },
  { path: 'subscribe-next', loadChildren: () => import('./exercises/subscribe-next/subscribe-next.module').then(m => m.SubscribeNextModule) },
  { path: 'pipe', loadChildren: () => import('./exercises/pipe/pipe.module').then(m => m.PipeModule) },
  { path: 'distinct', loadChildren: () => import('./exercises/distinct/distinct.module').then(m => m.DistinctModule) },
  { path: 'take', loadChildren: () => import('./exercises/take/take.module').then(m => m.TakeModule) },
  { path: 'filter', loadChildren: () => import('./exercises/filter/filter.module').then(m => m.FilterModule) },
  { path: 'map', loadChildren: () => import('./exercises/map/map.module').then(m => m.MapModule) },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
