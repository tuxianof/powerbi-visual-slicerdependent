
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView
import IVisualHost = powerbi.extensibility.visual.IVisualHost
import powerbiVisualsApi from 'powerbi-visuals-api'
import DataViewMatrix = powerbi.DataViewMatrix
import DataViewMatrixNode = powerbi.DataViewMatrixNode
import FilterAction = powerbiVisualsApi.FilterAction
import DataViewHierarchyLevel = powerbiVisualsApi.DataViewHierarchyLevel
import IFilter = powerbiVisualsApi.IFilter
import SlicerInput from './components/slicerInput/SlicerInput'
import { IFilterColumnTarget, BasicFilter } from 'powerbi-models'


import * as React from 'react'


export interface IBasicFilter extends IFilter {
    operator: "In";
    values: (string | number | boolean)[];
}

export interface State {
    matrix: DataViewMatrix,
    options: any
}

export const initialState = {
    matrix: null,
    options: {}
}

export interface TreeNode {
    table: string,
    column: string,
    value: string,
    children: TreeNode[],
}

interface MainProps {
    host: IVisualHost;
}

export default class Main extends React.Component<MainProps, State> {

    private select: TreeNode[]

    constructor(props: any) {
        super(props)
        this.state = initialState
        Main.updateCallback = (newState: State) => this.setState({ ...this.state, ...newState })
    }

    private static updateCallback: (data: object) => void = null

    public static update(dataView: DataView) {
        let matrix = dataView.matrix
        Main.updateCallback({
            matrix: matrix
        })
    }

    cambio(event) {
        let dataset = event.target.dataset
        let node: TreeNode = null
        let nodeValue = null
        if (dataset.level == 0) {
            node = this.select[event.target.value]
            nodeValue = node.value
        } else {
            nodeValue = event.target.value
        }
        let target: IFilterColumnTarget = {
            table: dataset.table,
            column: dataset.column
        };
        let filter = new BasicFilter(target, "In", [nodeValue]);
        this.props.host.applyJsonFilter(filter, "general", "filter", FilterAction.merge);

        if (node) {
            const nextNodeChildren = node.children[0]
            const idSelect = `${nextNodeChildren.table}-${nextNodeChildren.column}`;
            this.setState(prevState => ({
                options: {
                    ...prevState.options,
                    [idSelect]: node.children
                }
            }))
        }
    }

    private list_selects() {
        let levels = this.state.matrix?.rows.levels
        let nodes = this.state.matrix?.rows.root.children
        this.select = this.nodeChildren(nodes, levels)
        return (
            levels?.map((level, indexLevel) => {
                let nodeOptionsLevel1 = null;
                if (indexLevel === 0) {
                    nodeOptionsLevel1 = this.select?.map((tree, index) => (
                        <option value={index}>{tree.value}</option>
                    ));
                }
                const [table, column] = level.sources[0].queryName.split('.')
                const idSelect = `${table}-${column}`
                const nodeOptions = this.state.options[idSelect] || []
                return (
                    <div className="flex flex-col flex-1 px-2">
                        <label htmlFor={idSelect} className="mb-1 text-sm font-medium text-gray-700">
                            {level.sources[0].displayName}
                        </label>
                        <select
                            data-table={table}
                            data-column={column}
                            data-level={indexLevel}
                            onChange={this.cambio.bind(this)}
                            className="block w-full border border-gray-300 focus:outline-none focus:ring-gray-300 focus:border-gray-300 sm:text-sm"
                        >
                            <option value="" defaultChecked>{level.sources[0].displayName}</option>
                            {nodeOptionsLevel1}
                            {nodeOptions.map((tree, index) => (
                                <option value={tree.value}>{tree.value}</option>
                            ))}
                        </select>
                    </div>
                )
            })
        )
    }

    private nodeChildren(nodes: DataViewMatrixNode[], levels: DataViewHierarchyLevel[]): TreeNode[] {
        return nodes?.map(node => {
            let tree: TreeNode = { table: null, column: null, value: null, children: null }
            let valueNode = node.value.toString()
            let childrenNode = []
            if (node.children) {
                childrenNode = this.nodeChildren(node.children, levels)
            }
            // El query se compone de "nombre_tabla.columna"
            [tree.table, tree.column] = levels[node.level].sources[0].queryName.split('.')
            tree.value = valueNode
            tree.children = childrenNode
            return tree
        })
    }

    render() {
        return (
            <section className="flex flex-col">
                <article className="flex justify-around w-full">
                    {this.list_selects()}
                </article>
            </section>
        )
    }
}
