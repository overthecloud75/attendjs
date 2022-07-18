import React from 'react';
import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';
import { v } from '../variable';

// https://github.com/CodeFocusChannel/Table-Styling-React/blob/master/src/components/styled-components-table/styles.js

const TableSheet = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    border-radius: ${v.borderRadius};
    overflow: hidden;
`;

const THead = styled.thead`
    position: sticky;
    z-index: 100;
`;

const HeadTr = styled.tr`
    background: ${({ theme }) => theme.bg};
`;

const Th = styled.th`
    font-weight: normal;
    padding: ${v.smSpacing};
    color: ${({ theme }) => theme.text};
    text-transform: capitalize;
    font-weight: 600;
    font-size: 14px;
`;

const Td = styled.td`
    padding: ${v.smSpacing};
    border: 1px solid ${({ theme }) => theme.bg2};
    font-size: 14px;
`;

const TBody = styled.tbody`
`;

const BodyTr = styled.tr`
    background: ${({ theme }) => theme.white};
`;

// useTable에다가 작성한 columns와 data를 전달한 후 아래 4개의 props를 받아온다
const Table = ({ columns, data }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data }, useSortBy);

    return (
        <TableSheet {...getTableProps()}>
            <THead>
                {headerGroups.map(header => (
                // getHeaderGroupProps를 통해 header 배열을 호출한다
                    <HeadTr {...header.getHeaderGroupProps()}>
                        {header.headers.map(col => (
                        // getHeaderProps는 각 셀 순서에 맞게 header를 호출한다
                        <Th {...col.getHeaderProps(col.getSortByToggleProps())}>{col.render('Header')}</Th>
                        ))}
                    </HeadTr>
                ))}
            </THead>
            <TBody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                        return (
                            // getRowProps는 각 row data를 호출해낸다
                            <BodyTr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                // getCellProps는 각 cell data를 호출해낸다
                                <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                            ))}
                            </BodyTr>
                    );
                })}
            </TBody>
        </TableSheet>
    );
};

export default Table