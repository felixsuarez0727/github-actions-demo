# Github Actions Demo


## 🛠️ Initial Setup
### Create and clone the repository

Create a new repository on Github.

Clone the repository on your local machine.

### Configuring Git Identity

Make sure your commits are attributed correctly.

``` bash
git config user.name "Félix Suarez Bonilla"
git config user.email "felixdavidsuarezbonilla@gmail.com"
```

### Create branches

Main branch will be used as production branch.

Create the develop branch

```bash
git checkout -b develop
git push origin develop
```

Create the deploy branch

``` bash
git checkout -b gh-pages
git push origin gh-pages
```

## ⚙️ First Workflow: Run Tests on PR to Main

Change to the `develop` branch

``` bash
git checkout develop
```

### Create the workflow
Create the first workflow `.github\workflows\test-on-pr-to-prod.yml`.

```yml
name: Test on PR to Prod

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci  
      - run: npm test
```

### Push the workflow

``` bash
git add .
git commit -m "Add GitHub Actions workflow to run tests on PR to prod"
git push --set-upstream origin develop
```

## 🧪 Add Demo Project and Run Tests

Ensure you're on develop.

``` bash
git checkout develop
```

### Copy demo project

Copy Frontend demo project from into the root folder

https://github.com/felixsuarez0727/github-actions-demo-frontend 

Test that the demo project is working

``` bash
npm i         # Install dependencies
npm run dev   # Run the frontend, it should show version on http://localhost:5173/
npm run test  # Run the tests, it should run successfully
```

### Push the changes

``` bash
git add .
git commit -m "Add project files"
git push
```


## 🛡️ Configure Branch Protection Rules
### On Github

- Go to settings and Rules
- Add a new branch ruleset
- Set the name `test-on-pr-to-prod`
- Set enforcement to `Active`
- Add a target branch by pattern `main`
- Add `Require Pull Request before merging` with 1 required approval


## ✅ Testing first rule and workflow

### Create the pull request

Go to Github and create the PR
  - With name `First Merge to Main`
  - Click on `create`

You should see:
  - ✅ All checks have passed → Workflow is working
  - ⛔ Review required → Rule is enforced

To proceed:
  - Go to settings and Rules and disable the rule `test-on-pr-to-prod` to continue.
  - Then go back to the Pull Request and you will be able to merge.
  - Merge this pull request

### Sync
Then synchonize develop.

  ```bash
  git pull origin main
  git push
  ```

## ❌ Add files with intentional error

Modify src/components/Version.test.jsx to introduce an error:

Change:

``` js
const linkElement = screen.getByText(`Current version: ${packageJson.version}`)
```

To: 

``` js
const linkElement = screen.getByText(`Current version: 9.9.9`)
```

Now we run `npm run test` and a test should fail.

### Commit and push.

``` bash
git add .
git commit -m "Add files with error"
git push
```

### Create the pull request with error

Go to Dev and create the PR

- Name `Add files with error`
- Click on `create`

You should see:
⛔ Some checks were not successfull - Workflow working correctly


## 🚀 Second Workflow: Auto Deploy to GitHub Pages

### On Github

- Close the failing Pull request

- Then go to settings > pages 
- Confirm that `Deploy from a branch` is selected as source and the branch `gh-pages` is selected.


### On code.

Revert the change in src/components `Version.test.jsx` file.

``` js
const linkElement = screen.getByText(`Current version: ${packageJson.version}`)
```

Then create the following file `.github\workflows\deploy-on-merge.yml`.

```yml
name: Deploy to GitHub Pages if commit includes deploy

on:
  push:
    branches: [main]

permissions:
  contents: write 

jobs:
  deploy:
    if: contains(github.event.head_commit.message, '#deploy')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - run: npm ci
      - run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Push changes

``` bash
git add .
git commit -m "Add GitHub Actions workflow to deploy on merge"
git push
```

### Create a new pull request

- Name `Add GitHub Actions workflow to deploy on merge`
- Click on `create`

You should see:
✅ All checks have passed - Workflow working correctly

### Merge the pull request

This commit should not deploy changes to the github pages.

https://felixsuarez0727.github.io/github-actions-demo/

The page should look like a blank page with the name of our repository

### Deploy with #deploy Tag

### ⚠️ Important Note

It is important to check the `vite.config.js` file, the `base` line has to match the name of our repository for the correct deployment on Github Pages.

```json
base: '/github-actions-demo/',
```

### Changes

Now we will add a commit that does allow deployment.

In the `package.json` file

We will change the version to

``` json
"version": "0.1.0",
```

## Push Changes

``` bash
git add .
git commit -m "Upgrade version #deploy"
git push
```

- It is important to note that the workflow will deploy only versions containing the `#deploy` tag.

## Prepare a new Pull Request and merge

- Name `Upgrade version #deploy`
- Click on `create`

Then merge.

Now in the actions section of Github we will see the `pages build and deployment` workflow in progress.

After a few minutes this commit should deploy changes to the github pages.
https://felixsuarez0727.github.io/github-actions-demo/


# Summary

In this demo, we achieved the following:

- Set up a rule to require reviews on pull requests.
- Set up a workflow to ensure unit tests pass successfully before merging into the main branch.
- Set up a workflow to deploy changes to a GitHub Pages branch.

Four pull requests were expected to be created:

1. The initial PR to test the first testing workflow and the review rule.
2. A PR to verify that the testing rule prevents merging changes when unit tests fail.
3. A PR to add the deployment workflow (this PR does not trigger deployment since it lacks the #deploy tag).
4. A PR to push changes and trigger the deployment process.

