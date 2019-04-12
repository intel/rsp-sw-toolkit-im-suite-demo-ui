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

@NgModule({
  declarations: [
    AppComponent,
    TheftDetectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatMenuModule, MatIconModule, MatListModule, MatCardModule,
    FlexLayoutModule
  ],
  providers: [
    BufferService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
