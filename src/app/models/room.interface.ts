import { IMessage } from "./message.interface";

export interface IChatRoom {
    id: string;
    roomName: string;
    messages: Array<IMessage>
    createdUserId: string;
}