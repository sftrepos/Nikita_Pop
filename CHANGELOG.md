# Changelog

Build 1.68.0005: 2020-09-06

- Configure Apple background mode
- Enable Apple background fetch, fixes notification on real iOS devices
- Change avatar border-background to global theme card
- Configure badge reader AuthAPI route

Build 1.68.0010: 2020-09-06

- Equalize HW rem units on standard action button on rounded flag
- Adjust field placeholder text color to be visible on normal theme
- Get NativeModules scriptURL to Reactotron configuration host to link real iOS phone devices
- Add code verification error handler on unverified response
- Add white Pop logo SVGR
- Add Bubble loading background as SVGR
- Create Bubble Loading screen as spec
- Add registration loading from store
- Add and link register sagas

Build 1.68.0015: 2020-09-07

- Capture authentication event given from verifying
- Create image background edit button
- Configure image background selector header
- Add undef/null case to custom avatar handling
- Configure default avatar styling to adapt flexible size changes
- Add home tab navigator profile avatar icon
- Format the active widget add containers

Build 1.68.0020: 2020-09-07

- Lower localUser object level preventing user?.user?.any
- Add Widget types
- Add Widget display renderer
- Map real localUser data to My Card screen
- Add the primary widget to My Card screen
- Link image bucket background image to My Card screen

Build 1.68.0025: 2020-09-08

- Port and create interest chip section component to 1.68 compatibility, display on interest widget instances
- Create layout effect native container oversize detection if list elements extend max parent container size

Build 1.68.0030: 2020-09-09

- Remove the oversize detector to fade out clipped child elements instead
- Map local user widgets to profile edit
- Adjust local user background image on profile edit
- Fill local user profile information on profile edit
- Create question displaying widget
- Create questions widget creation screen to stack
- Create interests widget creation screen to stack
- Fix default navigation headers for all widget creator screens
- Implement drag sorting into profile edit scrollview

Build 1.68.0035: 2020-09-10

- Optimize filtering callback and rendering
- Fix adding widgets not working
- Move global modal wrapper a level down to get working theme hook
- Merge intercom feature branch
  - Add intercom autocompletion for majors
  - Add intercom screens to stack
  - Create staging for user onboarding
  - Create onboarding response panel
  - Configure staging conditionals on chat screen
  - Add ScrollView ref to enable scroll to end of page on intercom screens
- Jump incoming data to local user data reducer

Build 1.68.0040: 2020-09-10

- Preload initial filters in the global store
- Atomically and accurately update a filter to reduce possible collisions
- Enable single-select/multi-select convenience on filter chips
- Finalize new filtering methods for classes, interests, and genders for carousel
- Configure carousel slide width to spec by removing old gesture handle styling
- Add interest widget display on user cards carousel
- Conditionally render hit areas based on 0-sequence widget type

Build 1.68.0045: 2020-09-11

- Create generic typed service hook for any network call
- API call and component mapping for question widget creator
- Configure carousel index refreshing to continuously load cards
- Create middle carousel icon SVGRs

Build 1.68.0050: 2020-09-12

- Remove workspace configuration from git
- Configure grad year selection for intercom
- Add prompts, questions, location to intercom
- Add geolocation API to locate major cities around the user

Build 1.68.0055: 2020-09-13

- Fix broken custom carousel icon not properly rendering as SVGR
- Add background image on main carousel support
- Add expanded carousel modal screen into global modals
- Hack pageSheet modal to fix swiping down not working on current React Native issues
- Merge intercom integration
- Add question widget
- Add infinite carousel page incrementing
- Fix profile editing default background selection
- Add background image updating during image background creation/picking
- Add carousel model expanded card as replacement instead of gesture enabled views
- Add bottom sheet reanimated library as carousel model pageSheet replacement

Build 1.68.0060: 2020-09-15

- Fix Google services config not being read on Android
- Fix vector icons not being rendered on Android
- Fix problem where Android main activity not being exported to start the app
- Fix android keyboard
- Fix keyboard accessories not resizing properly on Android on screens that use forms
- Game widget formatting
- Game widget styling
- Fix get widget dispatch
- Add widget saga

Build 1.68.0065: 2020-09-16

- Port over requests screen
- Install modalize to nest scroll views inside modals
- Portal the modal to front app wrapper
- Build conversation request input
- Add validators to request conversation starter
- Remove notification/messaging socket wrapper
- Create game widget demo component
- Fix request reducer success updating wrong data
- Configure pochi face and hiding in tutorial staging
- Add widget adding callback to drag sorting data
- Add demo configurations, widget gifs, games

Build 1.68.0070: 2020-09-21

- Fix adding more than one widget API call
- Added error and success callback on adding widget by popping the screen only on success
- Prevent shuffling game data on rerenders
- Implement welcome page style update
- Add Pop white title logo SVG
- Fix widget reducer bugs
- Add widget displaying game for cards
- Add requesting functionality and chats
- Add chat searching
- Add tutorial staging
- Add request fetching

Build 2.0.0: 2020-09-30

- Implement questions creator page
- Implement interests creator page
- Update widget displays to fixed height
- Migrate OAuth2 to old token method
- Remove public GIPHY API key
- Fix potential GIPHY API invalid pagination iteration
- Add Profile edit drag sort padding
- Optimize image caching/loading in background image creator
- Fix android widget display
- Populate interests creator with current interests
- Add handle deleting widgets logic
- Send version to do version checking in cases where the app may not be updated
- Draw and add landing page
- Fix location API key security
- Update versioning to denote breaking changes
- Disable unworked settings for later revision
- Optimize requesting message
- Handle deletion of multiple instances of a type of widget
- Add widget deleting API formatting logic
- Fix deleting interest widget to reflect changes on profile screen on back
- Map current global interests to localized interest state to replace existing interest widget instead of making anew
- Fix widget display on Android
- Add react-native-debugger support, as well as changing redux compose to instantly look at state tree
- Fix refreshing carousel after tutorial completion
- Fix background image parsing
- Force widget sequence update by replacement
- Disable unused iOS sensitive permissions
- Optimize GIPHY image loading, fast-image caching
- Optimize background image loading, fast-image caching
- Fix token not saved to store on registration success
- Add fake data to tutorial staging
- Fix terms of service and privacy links at registration screen
- Add chat report modal, version checking, and unmatching
- Fix stuck failed login bug
- Improve UX request list and conversation list
- Fix adding GIPHY widget getting GIF from link
- Fix chat/messaging success logic
- Fix logging out and removing requested card from browse screen
- Disable filter during tutorial staging
- Add tutorial staging notifiers logic
- Conditionally render fake data on starting intercom
- Rebuild registration to specification on styling and logic
- Add redux based login
- Map interest categories into buckets in interest creator screen
- Map questions into buckets in question creator screen
- Finalize scalable filters, add filter resetting, filter on write logic
- Add swiper screens when beginning account creation
- Add mango, success, pink colors
- Add progress bars in messaging
- Add geolocation analytics logging on every screen
- Add drag markers on profile edit screen widgets
- Add university class utility helper finding graduating class
- Realign global header styling to fit UX header specifications
- Fix Android keyboard avoiding view not working
- Fix Android shadow/elevation styling problems
- Map custom background images to background creator buckets
- Add FCM logic and image domains
- Add intercom post-completion success and group chat filtering
- Add drag sorting on drag end to API call
- Add phone device info and latitude longitude coordinate model
- Fix intercom styling to UX specification

Build 2.0.0005: 2020-10-01

- Increase game widget character count
- Finalize waitlist page styling
- Add throttle/debounce/loading state to email validator input
- Fix AsyncStorage import on chat
- Add loading states to forgot password and login
- Port 1.67 old progress bar to chat screen
- Fix Giphy creator styling
- Remove keyboard avoiding view for certain screens to too long forms
- Restyle game widget screen
- Add browse screen setup handling
- Add game widget icon SVGR
- Fix widget payload sequencing in redux
- Adjust tutorial delay timers
- Adjust intercom notifier duration
- Fix GPS not parsing
- Add android signing release configuration
- Remove reactotron logs
- Remove Google API key
- Condition geolocation logic on authentication
- Handle background image linking cases
- Enable directional scroll lock in Giphy creator FlatList
- Add add widget redux logic
- Handle game, interest, and giphy widget deleting
- Disabled unused iOS sensitive user permissions
- Optimize request messaging

Build 2.0.0010: 2020-10-06

- Reflect profile changes when drag sorting cards and going back and previewing
- Fix carousel using filters for regular cards fetching, preventing looping carousel bug
- Test forgot password flow to ensure it works
- Add rudimentary common interest logic on the browse screen
- Fix android icon by adding rounded and square versions of the logo to mipmap
- Add waitlisting service, screen, logic
- Create general parallel service loader
- Add theming prereqs in redux/saga logic
- Clean up sentry logs
- Add sentry breadcrumbs and auto session tracking

Build 2.0.20: 2020-10-11

- Move waitlist screen to replace browse screen
- Adjust waitlisting service to use user data from store by removing double verify going 502
- Fix chat searching and bugs
- Update iOS store screenshot images for 6.5" and 5.5" crops
- Handle geolocation error case

Build 2.0.21: 2020-10-12

- Refactor and restyle expanded card input box
- Adjust expanded card input box error handling on keyboard visibility

Build 2.0.22: 2020-10-18

- Add widget modifier menu
- Move interest, question, game, and gif editing capabilities to profile edit screen
- Add refresh button to empty browse card screen when cards can't load
- Add Android icon files
- Add background optimization thumbnails
- Modify registrations/login input to accept international universities
- Remove and refactor "Delete widget" option from interest, question, game, and gif widget creator screens

Build 2.0.23: 2020-10-23

- Implement national filter
- Add university display name
- Fix getting browse screen cards
- Fix empty browse screen
- Add feature indicator
- Fix browse key extractor causing unfocused carousel elements
- Fix scaling issues, add media queries for rem units supporting small devices
- Add scroll container to requests view fixing profiles with many widgets
- Fix requests by removing redux-hook-form handlers when submitting a request

Build 2.0.27: 2020-11-10

- Add activity indicator when sending a request
- Fix Carousel card empty container not centering, issue #72
- Add custom font assets, issue #72. Lato and Inter font added to Android & iOS
- Expand rendering conditionals on existing Likes/DM feature, roll back for 2.0.27 patch release
- Fix clearing carousel deck when switching >1 index causing synchronization issues on national and homebase carousels
- Fix un-keyed cards being unfocused on homebase and national carousels
- Add deck clearing to requests reducer
- Fix demo'd incorrect hometown string issue #100
- Merge Likes/DM feature proposal work
- Fix loading card state animation
- Add prototype chat preview screen
- Fix calculating keyboard scroll correctly
- Fix styling issue and remove double tap from game widget
- Add new request screen styling
- Add like functionality with expand text input box
- Merge DM dynamic chat content
- Delete intercom support message
- Add liked widgets in chat
- Test widgets in chat
- Add responsive small national screen
- Aid national screen styles
- Unblock login through invalid email validation (Apple case)

Build 2.0.28: 2020-11-12

- Set null current card state when closing modal
- Fix card width not showing near cards
- Disable chat preview screen preventing messages crash

Build 2.0.29: 2020-11-13

- Supplant homebase with waitlist when the user is waitlisted
- Center empty browse carousel reload screen
- Center empty browse carousel activity screen

Build 2.0.30: 2020-11-16

- Implement chat bubbles, input boxes to request
- Add trash can menu case for requests
- Move requesting logic to new request carousel
- Add expanded card clone for request carousel
- Implement blur modal
- Move send request box to bottom of expanded card
- Add liking functionality
- Double tap to expanded blur modal
- Add individual tab counters to reception stack
- Add one in-app review dialog when opening a chat when at or more than at name unlock

Build 2.0.31: 2020-11-22

- Fix scrolling to older chatrooms #58
- Fix sizing and functionality issues on send widget invite
- Add request sending success
- Replace to close icon on send request modal
- Fix keyboard blocking actions
- Add corrective flexing on send request modal
- Add content aware keyboard scrollview to send request modal
- Add close modal button for send request modal
- Fix android widget liking color
- Add error and loading states for chat
- Relabel requests to invites
- Add edit profile tip
- Add GIPHY styling search inputs
- Style send request modal
- Fix intercom response panel
- Add keyboard handling to modals and regular requests
- Add Carousel timing analytics

Build 2.0.32: 2020-11-25

- Update app store description
- Add visible widget request carousel
- Add requests reset after sending request
- Add get request queue V2 API handler
- Update send request API to v2

Build 2.0.33: 2020-11-28

- Fix parsing request carousel widget

Build 2.0.34: 2020-12-08

- Fix chat cache duplication bug

Build 2.0.35: 2020-12-09

- Add "testig" dynamic link
- Fix request screen widget styling on small devices not resizing properly
- Fix request screen widget message bubble overflowing the parent widget
- Add pressable hit area on request widgets
- Add Facebook SDK Android, iOS
- Change back button to position absolutely on viewing request cards

Build 2.0.36: 2020-12-20 (R-2.0.36)

- Add development flags when testing
- Update invite redux removal
- Update invite deletion API

Build 2.0.40: 2021-10-01 (dev)

- Fix request modal styling
- Fix editing flow for questions
- Fix GIF editing flow
- Preserve truth on editing game widget
- Fix flow for all widgets
- Fix and store editing questions
- Fix storing data on GIF edit screen
- Fix storing data on game edit
- Merge branches 2.0.x, 2.0.x-likesfixes, update/filters
- Add editing filter selections
- Replace class filter with slider
- Add labels above slider
- Change filters to fullscreen modal
- Add animation tweak
- Refactor slider
- Reset filter (from globals) styling
- Bump axios from 0.19.2 to 0.21.1

  2.2.0 Build 6: 2021-06-05

- Added CI/CD
