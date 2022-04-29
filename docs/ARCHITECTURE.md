# Architecture

Updated 2021 June 23

This document relates to the high level architecture of the mobile app. It follows these principles:

1. Keep it short
2. Define things unlikely to change
3. Is not synchronized with code

## Introduction

The architecture of the app follows similarly to a common React Native typescript app, albeit with a few discrepancies due to the past historical operations and restructuring of our team.

## Modules

These modules are the bread and butter of the app.

| Module              | Purpose                                |
| ------------------- | -------------------------------------- |
| Amplitude           | Analytics                              |
| React Navigation    | Handles navigation across the app      |
| Redux               | Global store                           |
| Firebase            | Notifications                          |
| Redux ToolKit       | Simplifies redux                       |
| Axios               | Networking                             |
| Luxon               | Time/date control                      |
| Yup                 | Form validation                        |
| SendBird            | 3rd party chat                         |
| Extended Stylesheet | More features to the default style API |
| Keyboard Accessory  | Controls keyboard views                |
| Flipper             | Debugger                               |
| Reactotron          | Debugger                               |
| Modal/Modalize      | Better modal                           |
| Snap Carousel       | Main carousel component                |
| Portalize           | Force view to show globally            |
| Redux Persist       | Store hydration/rehydration            |
| Fast Image          | Image optimization                     |
| React Native Config | ENV Vars                               |
| Async Storage       | Device storage access                  |
| Shimmer Placeholder | Pre-loading animation                  |
| Redux Saga          | Side effect manager                    |

## Codemap

This codemap is designed to name important modules and types. I won't link them here but encourage you to symbol search to find these entities. This allows this document to not require frequent maintenance to keep up with the living codebase.

```
├── animations # animations that could be used from redash/gesture-handler
├── components # general components
│   ├── Buttons # has all the general buttons
│   ├── Card # card for carousel
│   ├── Conversations # components for conversation screen
│   ├── Gradients # generic gradient views
│   ├── MessageInput # the input field for messages
│   ├── MessageProgressBar # progress bar for messaging
│   ├── Messaging # more messaging components
│   ├── Modals # generic global modal views
│   ├── Toasts # top and bottom notifiers (for warnings, errors)
│   ├── Widgets # all generic widgets and views
├── constants # hard-coded values go here
├── features # all the app state/logic go
│   ├── Analytics
│   ├── App
│   ├── Chat
│   ├── Chats # most outstanding june 2021
│   ├── Interests
│   ├── Login
│   ├── Register
│   ├── Request
│   ├── User
│   └── Widgets
├── interfaces # generic interfaces
├── lang # il8n
├── nav # navigation mappping
│   └── stacks # inner and outer describe user flow
├── screens
│   ├── Auth
│   ├── Browse
│   │   └── components
│   │       ├── Carousel
│   │       └── CarouselModal
│   ├── Chat # old chat for reference
│   ├── Chats # new (sb) chat
│   ├── CustomizeAvatar
│   ├── Intercom # unused tutorial bot
│   ├── Login
│   ├── Messages
│   ├── National
│   ├── Onboard
│   ├── PasswordChange
│   ├── Profile
│   ├── Quiz
│   ├── Register
│   ├── Requests
│   ├── Settings
│   └── Welcome
│       └── images
├── services # 3rd party stuff into dirs, general networking
│   └── sendbird
├── store # redux/global store initalizer
├── styles # generic styles
└── util # device/systems utilities
    └── analytics # amplitude and logging user data
```

## CI/CD

Refer to [here](../fastlane/README.md)
