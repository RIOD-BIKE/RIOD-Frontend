# RIOD-Frontend

This is the frontend app for RIOD. It displays any content to the user. It also sends e.g. its own location to Cloud Firestore for the [backend](https://github.com/RIOD-BIKE/RIOD-Backend) to cluster and receives available Assembly Points and Clusters from there.

## Setup
1. Install Node.js, npm and [Ionic](https://ionicframework.com/docs/intro/cli)
2. Run `npm install` to install dependencies
3. Install [Cordova](https://cordova.apache.org/docs/en/latest/guide/cli/) and [Xcode](https://apps.apple.com/de/app/xcode/id497799835) (for iOS) or [Android Studio](https://developer.android.com/studio/) (for Android)

## Run
### Browser
Run `ionic serve`. Your browser will open automatically.

### iOS
When developing for iOS you also want to install [CocoaPods](https://guides.cocoapods.org/using/getting-started.html) (`brew install cocoapods` / `geminstall cocoapods`) and [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) (`gem install xcodeproj`). When building for the first time, you´ll also need to select a developer certificate for proper codesigning, so make sure to open the project up in Xcode at least once.

Run `ionic cordova platform add ios`. Then run `ionic cordova run ios` to let Cordova automatically choose a target device (iOS Simulator or connected physical device).
You can also run `ionic cordova build ios` to only build the project and then open `platforms/ios/RIOD.xcworkspace` and run the project from there manually.

### Android
When building for the first time, you´ll need to copy `google-services.json` to `platforms/android/app`.
Run `ionic cordova platform add android`. Then run `ionic cordova run android`.