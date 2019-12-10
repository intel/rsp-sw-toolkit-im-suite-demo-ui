/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {RecordingResponse} from './recording-response';

@Component({
  selector: 'app-loss-prevention',
  templateUrl: './loss-prevention.component.html',
  styleUrls: ['./loss-prevention.component.scss'],
  providers: [],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class LossPreventionComponent implements OnInit {

  constructor(private apiService: ApiService) {
  }

  loading: boolean;
  recordingResponse: RecordingResponse;

  async ngOnInit() {
    this.loading = true;
    this.apiService.myRecordingsEventEmitter.subscribe(
      (recordingResponse) => { this.loadRecordingResponse(recordingResponse); },
      (error) => { console.log(error); }
    );
    this.apiService.getRecordingsList();
  }

  private loadRecordingResponse(recordingResponse: RecordingResponse) {
    this.loading = false;
    this.recordingResponse = recordingResponse;
  }

  getFullPath(folder: string, file: string) {
    return this.recordingResponse.base_url + '/' + folder + '/' + file;
  }

  deleteRecording(foldername: string) {
    this.apiService.deleteRecording(foldername).subscribe(
      () => { this.apiService.getRecordingsList(); },
      (error) => { console.log(error); }
    );
  }
}
