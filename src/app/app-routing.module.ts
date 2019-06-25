import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TheftDetectionComponent } from './theft-detection/theft-detection.component';
import { RFIDInventoryComponent } from './rfid-inventory/rfid-inventory.component';
import { BleComponent } from './ble/ble.component';

const routes: Routes = [
  { path: 'theft-detection', component: TheftDetectionComponent },
  { path: 'rfid-inventory', component: RFIDInventoryComponent },
  { path: 'ble', component: BleComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
