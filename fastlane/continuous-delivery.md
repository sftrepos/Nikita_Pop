# Continuous Delivery

## Versioning ## Environment Variables

Sensitive data or temporary API key values are stored in [Github Secrets](https://github.com/pop-your-bubble/Pop/settings/secrets/actions). If any API keys get expired, those secrets need to get updated.

### Git

- `GIT_API_KEY`
  : Personal access token of an automation account (yourbubblepop) used to clone a match repo
- `GIT_API_USERNAME`
  : Git username (yourbubblepop)

### Android

- `ANDROID_KEYSTORE`
  : Android keystore file **contents** encoded with base64
- `ANDROID_KEYSTORE_PASSWORD`
  : Android keystore password
- `ANDROID_KEY_ALIAS`
  : Android key alias
- `ANDROID_KEY_PASSWORD`
  : Android key alias password

### iOS

- `IOS_APPLESTORE_API_KEY`
  : API key **contents** from [Apple Connect Store](https://appstoreconnect.apple.com/access/api)
- `IOS_APPLESTORE_API_KEY_ID`
  : API key from [Apple Connect Store](https://appstoreconnect.apple.com/access/api)
- `IOS_APPLESTORE_ISSUER_ID`
  : Issuers ID displayed at [Apple Connect Store](https://appstoreconnect.apple.com/access/api). Sometime this gets updated automatically/randomly.
- `IOS_MATCH_PASSWORD`
  : Password for accessing certificates/profiles in [match git repo](https://github.com/pop-your-bubble/mobile-dist-keys). Can be replaced with `MATCH_PASSWORD`, but used prefix 'ios' to indicate that it's only used in IOS process

`play-store-service-account.json` file is used to connect with Google Play Store. Check `Appfile`. Used in to fetch max/latest version code from play store. Currenlty, iOS api key `IOS_APPLESTORE_API_KEY` is being fetched from Github Secrets unlike this. We can either include both API keys in the repo, or upload them in Github Secrets.

## Branch Workflow

Our current branch workflow is:
`(feature branches)` -> `dev` -> `staging` -> `master`

## Github Action

There are 2 CD types: production and staging/qa. CI definition will check branch and update `.env` only if it's running on `master`. Any commit/branch merging into `master` should be coordinated with Product team since actual deployment is being done manully.

`master` uses `.env` and `.env.production`.
`staging` uses `.env`.

## Fastlane Workflows

Before building an app, version name, version code, and build number are fetched from each platform. Then, updated configs files are committed.

After releasing an app, fastlane lanes will release 5 tags: 3 moving tags and 2 permanent tags.

Format: `<version>-<build_number/version_code>-<branch>`

`1.0.0-prod`, `ios-1.0.0-prod`, and `android-1.0.0-prod` are moving tags until version gets bumped manually.
`ios-1.0.0-1-prod` and `android-1.0.0-1-prod` are permanent tags (include build number or version code)

`1.0.0-prod` represents a latest **Production** build.
`1.0.0-dev` represents a latest **Development** build.

## ENV files

CI YAML definition handles the logic of updating .env files

`master` branch will use production (.env + .env.production).
`dev` branch will use development (.env).
