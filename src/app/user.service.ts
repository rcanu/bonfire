import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  setRoom(userId, roomId) {
    return this.afs.collection('users')
      .doc(userId)
      .update({
        room: roomId
      });
  }

  leaveRoom(userId) {
    return this.setRoom(userId, null);
  }

}
