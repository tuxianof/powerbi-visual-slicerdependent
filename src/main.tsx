
import * as models from 'powerbi-models'
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView
import IVisualHost = powerbi.extensibility.visual.IVisualHost
import powerbiVisualsApi from 'powerbi-visuals-api'
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn
import FilterAction = powerbiVisualsApi.FilterAction
import SlicerInput from './components/slicerInput/SlicerInput'
import { AdvancedFilter, IAdvancedFilter, IAdvancedFilterCondition, IFilterColumnTarget } from 'powerbi-models'


import * as React from 'react'

export interface State {
    table: string,
    column: string,
    values: DataViewCategoryColumn[],
}

export const initialState: State = {
    table: null,
    column: null,
    values: null
}


interface MainProps {
    host: IVisualHost;
}

export default class Main extends React.Component<MainProps, State> {

    constructor(props: any) {
        super(props)
        this.state = initialState
        Main.updateCallback = (newState: State) => this.setState(newState)
    }

    private static updateCallback: (data: object) => void = null

    public static update(dataView: DataView) {
        console.info("Datos actualizados", dataView)
        let values = dataView.categorical?.categories
        Main.updateCallback({
            table: null,
            column: null,
            values: values
        })
    }

    taco() {
        let list = this.state.values?.map(column => {

            let listOptions = column.values?.map(item => {
                return (
                    <option>{item.toString()}</option>
                )
            })

            return (
                <select>
                    {listOptions}
                </select>
            )
        })
        return list
    }

    render() {
        return (
            <div className="flex flex-col items-center w-screen">
                <section className="flex flex-col m-2 ml-4 w-auto">
                    <article className="flex">
                        {this.taco()}
                    </article>
                </section>
            </div>
        )
    }
}
