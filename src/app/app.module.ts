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
import { RFIDInventoryComponent } from './rfid-inventory/rfid-inventory.component';
import { ApiService } from './services/api.service';
import { MatProgressSpinnerModule } from '@angular/material'

@NgModule({
  declarations: [
    AppComponent,
    TheftDetectionComponent,
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
    MatProgressSpinnerModule
  ],
  providers: [
    BufferService,
    WebsocketService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
