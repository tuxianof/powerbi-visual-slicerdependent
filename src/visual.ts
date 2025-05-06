"use strict";

import powerbi from "powerbi-visuals-api";
import powerbiVisualsApi from 'powerbi-visuals-api'
import FilterAction = powerbiVisualsApi.FilterAction
import { IAdvancedFilter, IAdvancedFilterCondition, IFilterColumnTarget, AdvancedFilter } from "powerbi-models";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";

import DataView = powerbi.DataView
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import IVisual = powerbi.extensibility.visual.IVisual
import IVisualHost = powerbi.extensibility.visual.IVisualHost

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
    private reactRoot: React.ReactElement<any, any>

    constructor(options: VisualConstructorOptions) {
        this.target = options.element
        this.host = options.host
        this.reactRoot = React.createElement(Main, { host: this.host })
        const root = ReactDOM.createRoot(this.target);
        root.render(this.reactRoot);
    }

    public update(options: VisualUpdateOptions) {
        const dataView: DataView = options.dataViews[0]
        Main.update(dataView)
    }


    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings)
    }
}