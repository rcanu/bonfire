import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

class Room {
  name: string;
  maxCapacity: number;
  currentCapacity: number;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {

  rooms: Observable<Room[]>;
  user: firebase.User;
  userRoom: string;

  constructor(
    private afs: AngularFirestore,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {

    this.afAuth.user
      .subscribe(user => {
        this.user = user;

        this.afs.doc(`users/${user.uid}`)
          .get()
          .subscribe(userDetails => {
              const data = userDetails.data() as any;
              this.userRoom = data.room;
              console.log(this.userRoom);
              return;
            });

      });

    this.rooms = this.afs.collection<Room>('rooms')
      .snapshotChanges()
      .pipe(map(snapshot => {
        return snapshot.map(room => {
          const id = room.payload.doc.id;
          return { id, ... room.payload.doc.data() } as Room;
        });
      }));

  }

  enterRoom(roomId: string) {
    this.userService.setRoom(this.user.uid, roomId)
      .then(() => {
        this.router.navigateByUrl(`rooms/${roomId}`);
      });
  }

}
