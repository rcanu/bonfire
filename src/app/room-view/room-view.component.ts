import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { AngularFireAuth } from '@angular/fire/auth';

class User {
  displayName: string;
  photoURL: string;
  uid: string;
}

@Component({
  selector: 'app-room-view',
  templateUrl: './room-view.component.html',
  styleUrls: ['./room-view.component.scss']
})
export class RoomViewComponent implements OnInit {

  users: Observable<User[]>;
  user: firebase.User;
  userRoom: string;
  room: any;

  constructor(
    private activatedRoute: ActivatedRoute,
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

    this.activatedRoute.params
      .subscribe(params => {
        const roomId = params.roomId;
        // Get the room details
        this.room = this.afs.doc(`rooms/${roomId}`)
          .snapshotChanges()
          .subscribe(room => {
            const id = room.payload.id;
            this.room = {id, ...room.payload.data()};
          });

        // Get list of users
        this.users = this.afs.collection(`rooms/${roomId}/users`)
          .valueChanges()
          .pipe(map(users => {
            return users.map(user => {
              return user as User;
            });
          }));

      });

  }

  leaveRoom() {
    this.userService.leaveRoom(this.user.uid)
      .then(() => {
        this.router.navigateByUrl('rooms');
      });
  }

}
