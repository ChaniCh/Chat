import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter, Observable, Subscription } from 'rxjs';
import { IChatRoom, IMessage } from 'src/app/models';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { AddRoomComponent } from '../add-room/add-room.component';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss']
})
export class ChatContainerComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  private userId: string = ""
  private roomId?: string

  public rooms$!: Observable<Array<IChatRoom>>;
  public messages$!: Observable<Array<IMessage>>;

  constructor(
    public chatService: ChatService, 
    public auth: AuthService, 
    public dialog: MatDialog,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    ) {

    this.rooms$ = this.chatService.getRooms();
    if(activatedRoute.snapshot.url.length > 1) {
      this.roomId = activatedRoute.snapshot.url[1].path
      this.messages$ = this.chatService.getRoomMessages(this.roomId);
    }

    this.subscription.add(router.events
      .pipe(filter((data) => data instanceof NavigationEnd))
      .subscribe(data => {
        const routeEvent: RouterEvent = <RouterEvent> data;
        const urlArr = routeEvent.url.split('/');
        if(urlArr.length > 2) {
          this.messages$ = this.chatService.getRoomMessages(urlArr[2]);
        }
    }))

   }

  ngOnInit(): void {
    this.subscription.add(
      this.auth
      .getUserData()
      .pipe(filter(data => !!data))
      .subscribe(user => {
        this.userId = user.uid;
      })
    );
    this.subscription.add(
      this.router.events.pipe(filter(routerEvent => routerEvent instanceof ActivationEnd)).subscribe(data => {
        const routeEvent = data as ActivationEnd
        this.roomId = routeEvent.snapshot.paramMap.get('roomId') || '';
        console.log(this.roomId);
      })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public openAddRoomModal(): void {
    const dialogRef = this.dialog.open(AddRoomComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.onAddRoom(result, this.userId);
    });
  }

  public onAddRoom(roomName: string, userId: string) {
    this.chatService.addRoom(roomName, userId);
  }

 public onSendMessage(message: string): void {
  if(this.userId && this.roomId) {
    this.chatService.sendMessage(this.userId, message, this.roomId);
  }
 }

}
