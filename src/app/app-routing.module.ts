import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TheftDetectionComponent } from './theft-detection/theft-detection.component';
import { BleComponent } from './ble/ble.component';

const routes: Routes = [
  { path: 'theft-detection', component: TheftDetectionComponent },
  { path: 'ble', component: BleComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
