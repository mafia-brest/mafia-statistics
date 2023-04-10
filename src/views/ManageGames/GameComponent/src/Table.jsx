import clsx from 'clsx'
import React, {useMemo} from 'react'
import {
    useBlockLayout,
    useResizeColumns,
    useSortBy,
    useTable
} from 'react-table'
import {FixedSizeList} from 'react-window'
import Cell from './cells/Cell'
import Header from './header/Header'
import PlusIcon from './img/Plus'
import scrollbarWidth from './scrollbarWidth'
import {ActionTypes} from './utils'

const defaultColumn = {
    minWidth: 50,
    width: 150,
    maxWidth: 400,
    Cell: Cell,
    Header: Header,
    sortType: 'alphanumericFalsyLast'
}

export default function Table({
                                  game,
                                  columns,
                                  data,
                                  dispatch: dataDispatch,
                                  skipReset
                              }) {
    const sortTypes = useMemo(
        () => ({
            alphanumericFalsyLast(rowA, rowB, columnId, desc) {
                if (!rowA.values[columnId] && !rowB.values[columnId]) {
                    return 0
                }

                if (!rowA.values[columnId]) {
                    return desc ? -1 : 1
                }

                if (!rowB.values[columnId]) {
                    return desc ? 1 : -1
                }

                return isNaN(rowA.values[columnId])
                    ? rowA.values[columnId].localeCompare(rowB.values[columnId])
                    : rowA.values[columnId] - rowB.values[columnId]
            }
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        totalColumnsWidth
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            dataDispatch,
            autoResetSortBy: !skipReset,
            autoResetFilters: !skipReset,
            autoResetRowState: !skipReset,
            sortTypes
        },
        useBlockLayout,
        useResizeColumns,
        useSortBy
    )

    const RenderRow = React.useCallback(
        ({index, style}) => {
            const row = rows[index]
            prepareRow(row)
            return (
                <div {...row.getRowProps({style})} className="tr">
                    {row.cells.map(cell => (
                        <div {...cell.getCellProps()} className="td">
                            {cell.render('Cell')}
                        </div>
                    ))}
                </div>
            )
        },
        [prepareRow, rows]
    )

    function isTableResizing() {
        for (let headerGroup of headerGroups) {
            for (let column of headerGroup.headers) {
                if (column.isResizing) {
                    return true
                }
            }
        }

        return false
    }

    return (
        <div style={{maxWidth: '100vw', overflow: 'auto'}}>
            <div
                {...getTableProps()}
                className={clsx('table', isTableResizing() && 'noselect')}
            >
                <div>
                    {headerGroups.map(headerGroup => (
                        <div {...headerGroup.getHeaderGroupProps()}
                             className="tr">
                            {headerGroup.headers.map(column => column.render('Header'))}
                        </div>
                    ))}
                </div>
                <div {...getTableBodyProps()}>
                    <FixedSizeList
                        height={game.players.length * 40}
                        itemCount={rows.length}
                        itemSize={40}
                        width={totalColumnsWidth + scrollbarWidth}
                    >
                        {RenderRow}
                    </FixedSizeList>
                    <div
                        className="tr add-row"
                        onClick={() => dataDispatch({type: ActionTypes.ADD_ROW})}
                    >
            <span className="svg-icon svg-gray icon-margin">
              <PlusIcon />
            </span>
                        New
                    </div>
                </div>
            </div>
        </div>
    )
}