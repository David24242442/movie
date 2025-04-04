import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc , setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  constructor(private firestore: Firestore) {

    //session storage to store username
    const sessionUsername = sessionStorage.getItem('currentUser');
if(sessionUsername) {
  this.setUsername(sessionUsername);
}
  }


  async saveUserInfo(username: string, email: string): Promise<void> {
    const userDocRef = doc(this.firestore, `users` , email);
    await setDoc(userDocRef, { username: username, email: email }, {merge:true}); 
    sessionStorage.setItem('currentUser', username);
    this.setUsername(username);
  }

  async fetchusername(email: string): Promise<string | null> {
    const userDocRef = doc(this.firestore, `users/${email}`);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const username = userData['username']; 
      this.setUsername(username);
      return username;
    }
    return null;
  }

  setUsername(username: string) {
    this.usernameSubject.next(username);
  }

  getUsername(): string | null {
    return this.usernameSubject.getValue();
  }

  clearUsername() {
    this.usernameSubject.next(null);
  }
}