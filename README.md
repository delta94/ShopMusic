# build

## prerequisite
1. npm 10.x.x
2. yarn 1.6.x

## command

1. yarn install
2. react-native run-ios

# Folder Structure Conventions

### Folder Structure

    src
    ├── app                        # @app: Contain application root logic
    │   ├── navigation             # Contain stack navigation configs
    │   └── layout                 # Contain root components (e.g. CustomHeader, CustomBottomBar, ...)
    │
    ├── assets                     # @assets: Asset files
    ├── components                 # @components: Contain only dummy UI components
    ├── moduless                    # @modules: Contain modules and its related components
    ├── store                      # @store: Contain slices of redux store
    ├── theme                      # @theme: Native-base ejected theme
    └── utils                      # @utils: Contain utilities

### Essential conventions

1. Do not use **var**
2. Do not use **function**
3. Use **const** whenever possible instead of **let**
4. Use prettier
5. Use stateless component whenever possible.
6. Use react hook api

### Coding conventions

1. Use absolute import when importing from other module
2. Use relative import when importing from the same module
3. Separate import sections with a blank line.
4. Import sections and order:
  - Third party modules (e.g. react, react-native, native-base, ...)
  - Other modules (e.g. @components, @utils, ...)
  - Same modules (e.g. ./Example.js)

### Coding style conventions

1. Maximum line length is 100
2. Indent lines with spaces
3. Use 2 spaces per indentation-level
4. Print spaces between brackets in object literals
5. Put the > of a multi-line JSX element at the end of the last line instead of being alone on the next line
6. Use single quotes instead of double quotes
7. No trailing commas

### Naming conventions

1. Components and containers must be title case
2. Functions and variables must be camel case
3. Private methods must use a leading underscore

### Rules of git commit message

1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain what and why vs. how

### run ios
rm -rf node_modules/ && yarn && cd ios && rm -rf Pods && rm -rf build && rm -rf Podfile.lock && pod install && cd .. && yarn ios




### build android
1. build Debug

<!-- npx jetifier && react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res && cd android/app && cp google-services_dev.json google-services.json &&  cd .. && ./gradlew clean && ./gradlew assembleDebug && cd .. -->

npx jetifier && react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res && cd android && ./gradlew clean && ./gradlew assembleDebug && cd ..


2. buil Relase

<!-- npx jetifier && cd android/app && cp buildRelease.gradle build.gradle && cp google-services_prod.json google-services.json  && cd .. && ./gradlew clean && ./gradlew assembleRelease && cd .. -->

npx jetifier && cd android && ./gradlew clean && ./gradlew assembleRelease && cd ..

### codepush

1. ios 

appcenter codepush release-react -a ngon.dat97/Betimate-IOS -d Staging -t '*'
appcenter codepush release-react -a ngon.dat97/Betimate-IOS -d Production -t '*'

~/Desktop/chiaki-mobile-app/ios/pods/Crashlytics/IOS/Crashlytics.framework/upload-symbols -gsp ~/Downloads/GoogleService-Info.plist -p ios ~/Downloads/appDsyms.zip

~/Desktop/chiaki-mobile-app/ios/pods/Fabric/IOS/Fabric.framework/upload-symbols -gsp  ~/Downloads/GoogleService-Info.plist -p ios ~/Downloads/appDsyms.zip


2. android

appcenter codepush release-react -a ngon.dat97/Betimate-ANDROID -d Staging -t '*'
appcenter codepush release-react -a ngon.dat97/Betimate-ANDROID -d Production -t '*'