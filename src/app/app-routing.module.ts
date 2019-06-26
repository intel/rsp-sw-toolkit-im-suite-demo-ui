import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TheftDetectionComponent } from './theft-detection/theft-detection.component';
import { RFIDControllerComponent } from './rfid/rfid-controller.component';
import { BleComponent } from './ble/ble.component';
import { RFIDInventoryComponent } from './rfid/rfid-inventory.component';

const routes: Routes = [
  { path: 'theft-detection', component: TheftDetectionComponent },
  { path: 'rfid-inventory', component: RFIDInventoryComponent},
  { path: 'rfid-controller', component: RFIDControllerComponent },
  { path: 'ble', component: BleComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
