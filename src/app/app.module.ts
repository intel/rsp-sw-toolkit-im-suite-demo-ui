/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatPaginatorModule,
  MatTableModule,
  MatGridListModule,
  MatDatepickerModule, MatNativeDateModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RFIDInventoryComponent} from './rfid/rfid-inventory.component';
import { RFIDControllerComponent } from './rfid/rfid-controller.component';
import { RFIDDashboardComponent } from './rfid/rfid-dashboard.component';
import { ApiService } from './services/api.service';
import { MatProgressSpinnerModule } from '@angular/material';
import { TemperatureComponent } from './temperature/temperature.component';
import { ChartsModule } from 'ng2-charts';
import { NotifsFoodSafetyComponent} from './notifications/food-safety/food-safety.component';
import {AppConfigService} from './services/app-config-service';
import {LossPreventionComponent} from './loss-prevention/loss-prevention.component';
import {VideoViewerComponent} from './loss-prevention/video-viewer.component';



const appInitializer = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    RFIDControllerComponent,
    RFIDInventoryComponent,
    RFIDDashboardComponent,
    TemperatureComponent,
    NotifsFoodSafetyComponent,
    LossPreventionComponent,
    VideoViewerComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule, MatTableModule, MatPaginatorModule, MatGridListModule,
    MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatMenuModule, MatIconModule, MatListModule, MatCardModule,
    FlexLayoutModule,
    MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    ChartsModule
  ],
  providers: [
    RFIDDashboardComponent,
    ApiService,
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AppConfigService]
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
