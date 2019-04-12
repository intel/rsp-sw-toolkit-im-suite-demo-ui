import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TheftDetectionComponent } from './theft-detection/theft-detection.component';

const routes: Routes = [
  { path: 'theft-detection', component: TheftDetectionComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
