# XÂY DỰNG ỨNG DỤNG HỌC TỪ VỰNG "EVOC" VỚI REACT NATIVE VÀ FIREBASE

[![Watch the video](https://img.youtube.com/vi/NPMtmUVonu4/hqdefault.jpg)](https://youtu.be/NPMtmUVonu4)

<img src="https://user-images.githubusercontent.com/93035668/221620867-0573cf12-cf8a-4e3f-9d17-111939fa0f39.jpg" width="300"> <img src="https://user-images.githubusercontent.com/93035668/221621322-875ec31f-5191-48d7-a9e2-0797d495ff14.jpg" width="300"> 
<img src="https://user-images.githubusercontent.com/93035668/221621339-ad279ce0-0946-4547-8283-5360934b3737.jpg" width="300"> <img src="https://user-images.githubusercontent.com/93035668/221621351-4de88eb5-5f29-4aa7-a951-e5a066d86cd7.jpg" width="300"> 
<img src="https://user-images.githubusercontent.com/93035668/221621356-122ab285-a3e8-4aa9-a385-490b4060188c.jpg" width="300"> <img src="https://user-images.githubusercontent.com/93035668/221621369-d6464ba9-5b4c-484e-addb-cfb781d09679.jpg" width="300"> 
<img src="https://user-images.githubusercontent.com/93035668/221621386-74c99cf9-3478-45d2-b1fe-052951620957.jpg" width="300"> <img src="https://user-images.githubusercontent.com/93035668/221621394-b184b8ff-ae25-4c90-acf0-8a9502016294.jpg" width="300"> <img src="https://user-images.githubusercontent.com/93035668/221621523-c7a2b9bb-2d1d-485d-b5b0-951caeaa9423.jpg" width="300"> 


# Welcome to your new ignited app!

[![CircleCI](https://circleci.com/gh/infinitered/ignite.svg?style=svg)](https://circleci.com/gh/infinitered/ignite)

## The latest and greatest boilerplate for Infinite Red opinions

This is the boilerplate that [Infinite Red](https://infinite.red) uses as a way to test bleeding-edge changes to our React Native stack.

Currently includes:

- React Native
- React Navigation
- MobX State Tree
- TypeScript
- And more!

## Quick Start

The Ignite boilerplate project's structure will look similar to this:

```
ignite-project
├── app
│   ├── components
│   ├── config
│   ├── i18n
│   ├── models
│   ├── navigators
│   ├── screens
│   ├── services
│   ├── theme
│   ├── utils
│   ├── app.tsx
├── test
│   ├── __snapshots__
│   ├── mockFile.ts
│   ├── setup.ts
├── README.md
├── android
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── keystores
│   └── settings.gradle
├── ignite
│   └── templates
|       |── app-icon
│       ├── component
│       ├── model
│       ├── navigator
│       └── screen
├── index.js
├── ios
│   ├── IgniteProject
│   ├── IgniteProject-tvOS
│   ├── IgniteProject-tvOSTests
│   ├── IgniteProject.xcodeproj
│   └── IgniteProjectTests
├── .env
└── package.json

```

### ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the `app` directory looks similar to the following:

```
app
├── components
├── config
├── i18n
├── models
├── navigators
├── screens
├── services
├── theme
├── utils
├── app.tsx
```

**components**
This is where your reusable components live which help you build your screens.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigators**
This is where your `react-navigation` navigators will live.

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truly shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application.

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find templates you can customize to help you get started with React Native.

### ./test directory

This directory will hold your Jest configs and mocks.

## Running Detox end-to-end tests

Read [Detox setup instructions](./detox/README.md).

## Previous Boilerplates

- [2018 aka Bowser](https://github.com/infinitered/ignite-bowser)
- [2017 aka Andross](https://github.com/infinitered/ignite-andross)
- [2016 aka Ignite 1.0](https://github.com/infinitered/ignite-ir-boilerplate-2016)

