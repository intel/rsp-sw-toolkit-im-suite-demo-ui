import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatMenuModule, MatIconModule, MatListModule, MatCardModule } from '@angular/material';
import { TheftDetectionComponent } from './theft-detection/theft-detection.component';
import { BufferService } from './services/buffer.service';
import { WebsocketService } from './services/websocket.service';
import { BleComponent } from './ble/ble.component';
import { HttpClientModule } from '@angular/common/http';
import { RFIDInventoryComponent} from './rfid/rfid-inventory.component';
import { RFIDControllerComponent } from './rfid/rfid-controller.component';
import { ApiService } from './services/api.service';
import { MatProgressSpinnerModule } from '@angular/material';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
  declarations: [
    AppComponent,
    TheftDetectionComponent,
    RFIDControllerComponent,
    RFIDInventoryComponent,
    BleComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatMenuModule, MatIconModule, MatListModule, MatCardModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    NgxJsonViewerModule
  ],
  providers: [
    BufferService,
    WebsocketService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
