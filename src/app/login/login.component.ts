import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, FirebaseError, User } from 'firebase';
import { Router } from '@angular/router';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
  }

  login() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider)
      .then((result: firebase.auth.UserCredential) => {
        // Update the current user's data
        this.updateUserData(result.user);
        this.ngZone.run(() => this.router.navigate(['rooms']));
      })
      .catch((error: FirebaseError) => {
        // TODO: Handle
        console.error(error);
      });
  }

  // Update with the latest information about the user
  private updateUserData(user) {

    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const userData: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified
    };

    // merge flag will create or update the document in a non-destructive way
    return userRef.set(userData, { merge: true });

  }

}
