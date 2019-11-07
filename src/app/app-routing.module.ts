import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RFIDControllerComponent } from './rfid/rfid-controller.component';
import { RFIDInventoryComponent } from './rfid/rfid-inventory.component';
import { RFIDDashboardComponent } from './rfid/rfid-dashboard.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { NotifsFoodSafetyComponent } from './notifications/food-safety/food-safety.component';

const routes: Routes = [
  { path: 'rfid-inventory', component: RFIDInventoryComponent},
  { path: 'rfid-controller', component: RFIDControllerComponent },
  { path: 'rfid-dashboard', component: RFIDDashboardComponent},
  { path: 'food-safety', component: NotifsFoodSafetyComponent},
  { path: '', redirectTo: 'rfid-dashboard', pathMatch: 'full'},
  { path: 'temperature', component: TemperatureComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
