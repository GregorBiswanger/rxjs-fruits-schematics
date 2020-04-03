RxJS-fruits Schematics
=======
[![CircleCI](https://circleci.com/gh/GregorBiswanger/rxjs-fruits-schematics.svg?style=svg)](https://circleci.com/gh/GregorBiswanger/rxjs-fruits-schematics)

This Angular Schematics is for the educational game RxJS-Fruits to add new exercises.

### How can I create my own exercise?

Create a new pull request from the [RxJS-fruits project](https://github.com/GregorBiswanger/rxjs-fruits). Drag the project with Git Clone and install all necessary packages with `npm install`.  
  Then you can add a new exercise with the following command:

```bash
ng generate rxjs-fruits-schematics:exercise --name=FanzyRxJSOperator
```

### Unit Testing with Cypress

A spec file was created for your new exercise in the cypress/integration folder. Write a test to match your exercise. Important! New exercises will only be added if there is a test and they pass everything.

`ng e2e` will run the unit tests.

### Publishing

Submit your pull request with a description to us. Important! There is no guarantee that we will use it.

That's it!
 