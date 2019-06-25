export interface Command {
    created: number;
    modified: number;
    origin: number;
    id: string;
    name: string;
    get: GetCommand;
    put: PutCommand;
}

export interface GetCommand {
    path: string;
    responses: string;
}

export interface PutCommand {
    path: string;
    responses: string;
}

export interface CComand{
    name: string
    url: string
}