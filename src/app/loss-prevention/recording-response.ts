/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/


export interface RecordingResponse {
  base_url: string;
  thumb_height: number;
  recordings: RecordingInfo[];
}

export interface RecordingInfo {
  folder_name: string;
  epc: string;
  product_id: string;
  timestamp: number;
  video: string;
  thumb: string;
  detections: string[];
}

