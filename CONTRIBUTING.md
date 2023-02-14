# Contributing

## Setup

Clone the repository:
```
git clone <url>
```

Navigate to the cloned directory

Navigate to the *Angular\powerbi-client-angular* workspace folder:
```
cd Angular\powerbi-client-angular
```

Install local dependencies:
```
npm install
```

## Build:
```
ng build
```
Or if using VScode: `Ctrl + Shift + B`

## Test
```
ng test
```
By default the tests run using ChromeHeadless browser

The build and tests use webpack to compile all the source modules into bundled module that can be executed in the browser.

## Running the demo

```
npm run demo
```

Open the address to view in the browser:

http://localhost:4200/

## Flow Diagram for the PowerBI Report Component:
![Flow Diagram](/resources/angular_wrapper_flow_diagram.png)
