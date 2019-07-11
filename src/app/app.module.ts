import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatMenuModule, MatIconModule, MatListModule, MatCardModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { TheftDetectionComponent } from './theft-detection/theft-detection.component';
import { BufferService } from './services/buffer.service';
import { WebsocketService } from './services/websocket.service';
import { BleComponent } from './ble/ble.component';
import { HttpClientModule } from '@angular/common/http';
import { RFIDInventoryComponent} from './rfid/rfid-inventory.component';
import { RFIDControllerComponent } from './rfid/rfid-controller.component';
import { RFIDDashboardComponent } from './rfid/rfid-dashboard.component';
import { ApiService } from './services/api.service';
import { MatProgressSpinnerModule } from '@angular/material';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { TemperatureComponent } from './temperature/temperature.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    TheftDetectionComponent,
    RFIDControllerComponent,
    RFIDInventoryComponent,
    RFIDDashboardComponent,
    BleComponent,
    TemperatureComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatMenuModule, MatIconModule, MatListModule, MatCardModule,
    FlexLayoutModule,
    MatProgressSpinnerModule, MatFormFieldModule,MatInputModule,
    NgxJsonViewerModule,
    ChartsModule
  ],
  providers: [
    BufferService,
    WebsocketService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
