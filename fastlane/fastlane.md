# Fastlane Steps

If you want to run fastlane from your local machine, please follow below commands in order.

### `source .ci-env`

`.ci-env` file includes all the security sensitive data that shouldn't exist in repo. This file can be created by gathering all the environmenet variable values into one file. Ask to one of release engineer who may have this file.
Refer to `continuous-delivery.md` for details.

### `fastlane ios setup`

Runs `match` to setup credential/provision files for AppleStore.
This step is included in both fastlane's `dev` and `prod`, so you don't need to run this if you have run match before.

### `fastlane ios dev`

### `fastlane android dev`

Fetches version and build number, then builds an app.

You don't need this step to run `fastlane <platform> prod`. This is just a sanity check.

### `fastlane ios prod`

### `fastlane android prod`

> **Check your local branch**
> This command will release several tags including local branch's name. Please refer to "Fastlane Workflows" in `continous-delivery.md` to understand what this mean.

Fetches version and build number, then builds ios app. If successful, deploys a testflight. Creates and updates several git tags.

# Examples

```
source .ci-env
fastlane ios setup
fastlane ios dev
fastlane android dev

# If you are merging/committing to `staging` or `master`,
# Github Action will start, so either cancel the workflow right after a commit
# or deploy from different branch, probably from `dev`
fastlane ios prod
fastlane android prod
```
