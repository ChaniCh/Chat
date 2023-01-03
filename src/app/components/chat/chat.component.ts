import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMessage } from 'src/app/models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Output() onSendMessage: EventEmitter<string> = new EventEmitter()
  @Input() messages: Array<IMessage> = [];

  constructor() { }

  ngOnInit(): void {
  }

  public sendMessage(message: string, input: HTMLInputElement): void {
    // console.log(message)
    this.onSendMessage.emit(message);
    input.value = ''
  }

}
