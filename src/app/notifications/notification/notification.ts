/* Apache v2 license
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

export interface Notification {
  created: string;
  modified: number;
  id: string;
  slug: string;
  sender: string;
  category: string;
  severity: string;
  content: string;
  status: string;
  labels: string[];
}
