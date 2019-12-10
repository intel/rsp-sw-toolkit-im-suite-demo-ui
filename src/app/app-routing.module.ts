/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RFIDControllerComponent } from './rfid/rfid-controller.component';
import { RFIDInventoryComponent } from './rfid/rfid-inventory.component';
import { RFIDDashboardComponent } from './rfid/rfid-dashboard.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { NotifsFoodSafetyComponent } from './notifications/food-safety/food-safety.component';
import { LossPreventionComponent } from './loss-prevention/loss-prevention.component';
import { VideoViewerComponent } from './loss-prevention/video-viewer.component';

const routes: Routes = [
  { path: 'rfid-inventory', component: RFIDInventoryComponent},
  { path: 'rfid-controller', component: RFIDControllerComponent },
  { path: 'rfid-dashboard', component: RFIDDashboardComponent},
  { path: 'food-safety', component: NotifsFoodSafetyComponent},
  { path: 'loss-prevention', component: LossPreventionComponent},
  { path: 'loss-prevention/view', component: VideoViewerComponent},
  { path: 'temperature', component: TemperatureComponent },
  { path: '', redirectTo: 'rfid-dashboard', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
