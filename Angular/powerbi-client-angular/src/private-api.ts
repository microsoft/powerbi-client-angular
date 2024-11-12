// Re-export privately, as this needs to be accessible as a compile symbol.
// Otherwise, the compiler would throw an error:
// Unsupported private class PowerBIEmbedComponent. This class is visible to
// consumers via PowerBIEmbedModule -> PowerBIEmbedComponent, but is not exported
// from the top-level library entrypoint.
export { PowerBIEmbedComponent as ɵPowerBIEmbedComponent } from './components/powerbi-embed/powerbi-embed.component';
