export interface Command {
    device: string;
    origin: number;
    readings: CommandReading[];
}

export interface CommandReading {
    device: string;
    name: string;
    origin: number;
    value: string;
}


export interface DeviceResponses {
    code: string;
    description: string;
    expectedValues: string[];
  }

export interface Get {
    path: string;
    responses: DeviceResponses[];
    url: string;
  }

export interface Put {
    url: string;
  }

export interface DeviceCommand {
    created: any;
    modified: any;
    id: string;
    name: string;
    get: Get;
    put: Put;
  }

export interface DeviceCommandRegistration {
    id: string;
    name: string;
    adminState: string;
    operatingState: string;
    lastConnected: number;
    lastReported: number;
    labels: string[];
    location?: any;
    commands: DeviceCommand[];
  }


