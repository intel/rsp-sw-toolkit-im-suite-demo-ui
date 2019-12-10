/* Apache v2 license 
*  Copyright (C) <2019> Intel Corporation
*
*  SPDX-License-Identifier: Apache-2.0
*/

export interface TagResults {
    results: Tag[];
}
export interface Tag {
    uri: string;
    epc: string;
    product_id: string;
    filter_value: number;
    tid: number;
    encode_format: string;
    facility_id: string;
    event: string;
    arrived: number;
    last_read: number;
    source: string;
    location_history: LocationHistory[];
    epcState: string;
    qualified_state: string;
    ttl: string;
    epc_context: string;
    confidence: number;
    temperature: string;
    expanded?: boolean;
}

export interface LocationHistory {
    location: string;
    source: string;
    timestamp: number;
}
