import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';

const admin = firebase.initializeApp();

export const dbUserOnUpdate = functions.firestore.document('users/{userId}')
  .onUpdate((change, context) => {

    const userDataAfter = change.after.data();
    const userDataBefore = change.before.data();
    const room = userDataAfter.room;

    if (room !== userDataBefore.room) {
      if (room === '' || room === null) {
        // User left the room, remove from room
        return admin.firestore().collection('rooms')
          .doc(userDataBefore.room)
          .collection('users')
          .doc(userDataAfter.uid)
          .delete()
      } else if (room === undefined) {
        return null;
      } else {
        // User entered, add to room
        return admin.firestore().collection('rooms')
          .doc(room)
          .collection('users')
          .doc(userDataAfter.uid)
          .set({
            displayName: userDataAfter.displayName,
            photoURL: userDataAfter.photoURL,
            uid: userDataAfter.uid
          })
          .then(() => {
            // Delete the previous
            return admin.firestore().collection('rooms')
              .doc(userDataBefore.room)
              .collection('users')
              .doc(userDataAfter.uid)
              .delete()
          })
      }
    } else {
      // No changes in room
      return null;
    }

  });
