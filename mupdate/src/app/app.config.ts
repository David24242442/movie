import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"movie-6d6e2","appId":"1:654457926198:web:f9a6ed285131987ad19e97","storageBucket":"movie-6d6e2.firebasestorage.app","apiKey":"AIzaSyAvN6IVxBLDW11zmWSq9D8lgZBK5mYUwqs","authDomain":"movie-6d6e2.firebaseapp.com","messagingSenderId":"654457926198"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase())]
};
