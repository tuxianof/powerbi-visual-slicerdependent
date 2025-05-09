"use strict";

import powerbi from "powerbi-visuals-api";
import powerbiVisualsApi from 'powerbi-visuals-api'
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";

import DataView = powerbi.DataView
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import IVisual = powerbi.extensibility.visual.IVisual
import IVisualHost = powerbi.extensibility.visual.IVisualHost
import IVisualEventService = powerbi.extensibility.IVisualEventService;

import "./../assets/visual.css";

// Uso de ReactJS
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import Main from "./main";

export class Visual implements IVisual {
    private target: HTMLElement
    private host: IVisualHost
    private formattingSettings: VisualFormattingSettingsModel
    private formattingSettingsService: FormattingSettingsService
    private reactRoot: ReactDOM.Root
    private events: IVisualEventService;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element
        this.host = options.host
        this.events = options.host.eventService
        this.reactRoot = ReactDOM.createRoot(this.target);
        this.reactRoot.render(
            React.createElement(Main, { host: this.host, matrix: null })
        )
    }

    public update(options: VisualUpdateOptions) {
        const dataView: DataView = options.dataViews[0]
        if (dataView.matrix) {
            Main.update(dataView)
        }
        this.events.renderingFinished(options);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings)
    }
}