// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,


  mapbox: {
    accessToken: 'pk.eyJ1Ijoiamt1c2VybmFtZSIsImEiOiJjazhyZDg4bW4wODhwM3NxYWN5d3RwbjdqIn0.MmwEx7ODb85Iy8pHZu5gcQ'
  },
  firebase:{
    apiKey: "AIzaSyCk212gSACMgaE6J9OYsHt7WOnPzxM0xyk",
    authDomain: "riod-bike.firebaseapp.com",
    databaseURL: "https://riod-bike.firebaseio.com",
    projectId: "riod-bike",
    storageBucket: "riod-bike.appspot.com",
    messagingSenderId: "946261770679",
    appId: "1:946261770679:web:3a657cce692cefab622832"
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
