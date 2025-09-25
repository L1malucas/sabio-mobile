rm educanet.apk 
jarsigner  -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore educanet.keystore android/app/build/outputs/apk/release/app-release-unsigned.apk educanet && /Users/gustavohra/Library/Android/sdk/build-tools/30.0.3/zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk educanet.apk
