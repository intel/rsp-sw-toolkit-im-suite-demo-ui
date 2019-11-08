import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import * as Plyr from 'plyr';
import {RecordingInfo} from './recording-response';
import {ApiService} from '../services/api.service';

@Component({
  selector: 'app-video-viewer',
  templateUrl: './video-viewer.component.html',
  styleUrls: ['./video-viewer.component.scss']
})

export class VideoViewerComponent implements OnInit {

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.loading = true;
  }

  id: string;
  index: number;
  loading: boolean;
  player: Plyr;
  recording: RecordingInfo;
  baseUrl: string;
  videoFilename: string;

  ngOnInit() {
    if (this.apiService.recordingResponse === undefined) {
      // todo: navigate away
    }

    this.player = new Plyr('#player', {
      autoplay: false,
      loop: {
        active: false
      }
    });

    this.id = this.route.snapshot.params.id;

    if (this.apiService.recordingResponse === undefined) {
      this.apiService.myRecordingsEventEmitter.subscribe(
        () => { this.loadVideo(); },
        (error) => { console.log(error); }
      );
      this.apiService.getRecordingsList();
    } else {
      this.loadVideo();
    }
  }

  loadVideo() {
    this.index = this.apiService.recordingsMap[this.id];
    this.recording = this.apiService.recordingResponse.recordings[this.index];
    this.baseUrl = this.apiService.recordingResponse.base_url;
    this.videoFilename = this.getFullPath(this.recording.video);

    this.player.source = {
      type: 'video',
      title: this.recording.folder_name,
      sources: [
        {
          src: this.videoFilename,
          type: 'video/mp4'
        }
      ]
    };

    this.loading = false;
  }

  getFullPath(name: string) {
    return this.baseUrl + '/' + this.recording.folder_name + '/' + name;
  }
}
