# powerbi-client-angular
Power BI Angular component. This library lets you embed Power BI reports, dashboards, tiles, report visuals, Q&As and paginated reports in your Angular application.

## Quick Start

### Import
*Import the 'PowerBIEmbedModule' inside your target module:*
```ts
import { PowerBIEmbedModule } from 'powerbi-client-angular';

@NgModule({
  imports: [
    ...
    ...
    PowerBIEmbedModule
  ],
  exports: ...,
  declarations: ...
})
```

### Embed a Power BI report
```ts
<powerbi-report
    [embedConfig] = {{
        type: "report",
        id: "<Report Id>",
        embedUrl: "<Embed Url>",
        accessToken: "<Access Token>",
        tokenType: models.TokenType.Embed,
        settings: {
            panes: {
                filters: {
                    expanded: false,
                    visible: false
                }
            },
            background: models.BackgroundType.Transparent,
        }
    }}

    [cssClassName] = { "reportClass" }

    [phasedEmbedding] = { false }

    [eventHandlers] = {
        new Map([
            ['loaded', () => console.log('Report loaded');],
            ['rendered', () => console.log('Report rendered');],
            ['error', (event) => console.log(event.detail);]
        ])
    }
>
</powerbi-report>
```

### How to [bootstrap a PowerBI report](https://docs.microsoft.com/javascript/api/overview/powerbi/bootstrap-better-performance):
```ts
<powerbi-report
    [embedConfig] = {{
        type: "report",
        id: undefined,
        embedUrl: undefined,
        accessToken: undefined, // Keep as empty string, null or undefined
        tokenType: models.TokenType.Embed,
        hostname: "https://app.powerbi.com"
    }}
>
</powerbi-report>
```

__Note__: To embed the report after [bootstrapping](https://docs.microsoft.com/javascript/api/overview/powerbi/bootstrap-better-performance), update the embedConfig (with at least accessToken and embedUrl).

## Embedding other Power BI artifacts
The library is offering the following components that can be used to embed various Power BI artifacts.

|Component|Selector to use for embedding|
|:------|:------|
|PowerBIReportEmbedComponent|```<powerbi-report>```|
|PowerBIDashboardEmbedComponent|```<powerbi-dashboard>```|
|PowerBITileEmbedComponent|```<powerbi-tile>```|
|PowerBIVisualEmbedComponent|```<powerbi-visual>```|
|PowerBIQnaEmbedComponent|```<powerbi-qna>```|
|PowerBIPaginatedReportEmbedComponent|```<powerbi-paginated-report>```|
<br> 

You can embed other artifacts such as:
```ts
<powerbi-dashboard 
    [embedConfig] = "<IDashboardEmbedConfiguration>"
    [cssClassName] = "<className>"
    [eventHandlers] = "<Map of String and eventHandler>"
>
</powerbi-dashboard>

```
### Demo

This demo includes an Angular application that embeds a sample report using the _PowerBIReportEmbed_ component.<br/>
It demonstrates the complete flow from bootstrapping the report, to embedding and updating the embedded report.<br/>
It also demonstrates using the *powerbi report authoring* library, by enabling the user to delete a visual from a report using the "Delete Visual" button.<br />
It also sets a 'DataSelected' event.

<br />
To run the demo on localhost, run the following command:

```
npm run demo
```
__Note__: Please run command ```npm run build``` at the first time to build the library before run the demo
Redirect to http://localhost:4200/ to view in the browser.

### Usage
|Use case|Details|
|:------|:------|
|Embed Power BI|To embed your powerbi artifact, pass the component with at least type, embedUrl and accessToken in embedConfig property.|
|Apply style class|Pass the name(s) of style classes to be applied to the embed container div to the cssClassName property.|
|Set event handlers|Pass a map object of event name (string) and event handler (function) to the _eventHandlers_ prop. <br/>__Key__: Event name <br/>__Value__: Event handler method to be triggered<br/>Event handler method takes two optional paramaters:<br/>*First parameter*: Event<br/>*Second parameter*: Reference to the embedded entity|
|Reset event handlers|To reset event handler for an event, set the event handler's value as null in the eventHandlers map of properties.|
|Bootstrap Power BI|To [bootstrap your powerbi entity](https://docs.microsoft.com/javascript/api/overview/powerbi/bootstrap-better-performance), pass the property *embedConfig* to the component without _accessToken_<br/>__Note__: _embedConfig_ should at least contain __type__ of the powerbi entity being embedded. <br/>Available types: "report", "dashboard", "tile", "visual" and "qna".<br/>Refer to _How to bootstrap a report_ section in [Quick Start](#quick-start). <br /><br />__Note__:  A paginated report cannot be bootstrapped.|
|Using with PowerBI Report Authoring|1. Install [powerbi-report-authoring](https://www.npmjs.com/package/powerbi-report-authoring) as an npm dependency.<br>2. Use the report authoring APIs using the embedded report's instance.|
|Phased embedding (Report type only)|Set the phasedEmbedding property value to `true` <br/> Refer to the [Phased embedding article](https://docs.microsoft.com/javascript/api/overview/powerbi/phased-embedding).|

<br />

__Note__: Supported browsers are _Edge_, _Chrome_,  and _Firefox_.

<br />

### Properties accepted by Components

|Property|Description|Supported by|
|:-------|:----------|:----------|
|embedConfig|Configuration for embedding the PowerBI entity (required)|All|
|phasedEmbedding|Phased embedding flag (optional)|report|
|eventHandlers|Map of pair of event name and its handler method to be triggered on the event (optional)|report, dashboard, tile, visual, qna|
|cssClassName|CSS class to be set on the embedding container (optional)|All|
|service|Provide the instance of PowerBI service (optional)|All|

<br />

### Event Handler to be used with Map
```ts
type EventHandler = (event?: service.ICustomEvent<any>, embeddedEntity?: Embed) => void | null;
```

## Using supported SDK methods for Power BI artifacts

### Import
*Import the 'PowerBIReportEmbedComponent' inside your targeted component file:*
```ts
import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
```

### Initialize inside the Component
```ts
@ViewChild(PowerBIReportEmbedComponent) reportObj!: PowerBIReportEmbedComponent;
```

### Use
You can use ```reportObj``` to call supported SDK APIs.

There are two ways in which ```reportObj``` can be used:
* Expose the ```Report``` object globally.

    Steps:
   1. Create one class variable, for example, ```report```.
   2. Implement the ``` AfterViewInit ``` hook for the component class.
   <br /><br />
   
   ```ts
    class AppComponent implements AfterViewInit { ... }
   ```
   3. Define the ```ngAfterViewInit``` method as follows:
   <br /><br />

   ```ts
    ngAfterViewInit(): void {
        this.report = this.reportObj.getReport();
    }
   ```

   4. this.report points to the Report object from the library and can be used to call SDK methods such as, ```getVisuals```, ```getBookmarks``` etc.
   <br /><br />

    ```ts
    async getReportPages(): Page[] {
        // this.report is a class variable, initialized in step 3
        const pages = await this.report.getPages();
        console.log(pages);
    }
    ```

* Use ```reportObj``` inside a class method.
    
    This approach will not expose the Report object globally, instead ```reportObj``` would be available locally in the function.

    Example:
    ```ts
    async getReportPages(): Page[] {
        const report = this.reportObj.getReport();
        const visuals = await report.getPages();
        console.log(visuals);
    }
    ```

### Dependencies

powerbi-client (https://www.npmjs.com/package/powerbi-client)

### Peer Dependencies

@angular/common (https://www.npmjs.com/package/@angular/common)

@angular/core (https://www.npmjs.com/package/@angular/core)

### Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit <https://cla.opensource.microsoft.com>.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions provided by the bot. You will only need to do this once across all repositories using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments
