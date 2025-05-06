import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
import DialogConstructorOptions = powerbiVisualsApi.extensibility.visual.DialogConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];
var slicerdependent43D0BDDB1F1C41158F68DD73E8C65330_DEBUG: IVisualPlugin = {
    name: 'slicerdependent43D0BDDB1F1C41158F68DD73E8C65330_DEBUG',
    displayName: 'slicer_dependent',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options?: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId: string, options: DialogConstructorOptions, initialState: object) => {
        const dialogRegistry = (<any>globalThis).dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["slicerdependent43D0BDDB1F1C41158F68DD73E8C65330_DEBUG"] = slicerdependent43D0BDDB1F1C41158F68DD73E8C65330_DEBUG;
}
export default slicerdependent43D0BDDB1F1C41158F68DD73E8C65330_DEBUG;