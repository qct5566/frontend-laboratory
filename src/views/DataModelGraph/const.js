export const modelData = {
  tables: [
    {
      modelTableId: '1aa',
      dbInstanceId: 1,
      typeName: 'mysql',
      modelName: 'tablemodel1',
      modelNo: '1',
      physicalTableName: 'table1',
      desc: 'desc!!',
      order: 1,
      anchorPoints: [
        [0, 0.76],
        [1, 0.76]
      ],
      columns: [
        {
          id: '1',
          modelTableId: '1aa',
          columnName: 'tb1col1',
          columnDesc: 'd3',
          columnType: '0',
          comment: 'd',
          isPk: 1,
          isFk: 1,
          isNull: 1,
          isAutoIncre: 1,
          defaultValue: '777',
          order: 1,
          isView: null
        },
        {
          id: '2',
          modelTableId: '1aa',
          columnName: 'tb1col2',
          columnDesc: 'd2',
          columnType: '0',
          comment: 'd2',
          isPk: 0,
          isFk: 1,
          isNull: 0,
          isAutoIncre: 0,
          defaultValue: '0',
          order: 1,
          isView: null
        }
      ],
      x: 100,
      y: 100
    },
    {
      modelTableId: '2bb',
      dbInstanceId: 1,
      typeName: 'mysql',
      modelName: 'tablemodel2',
      modelNo: '1',
      physicalTableName: 'table2',
      desc: 'desc!!',
      order: 1,
      columns: [
        {
          id: '3',
          modelTableId: '2bb',
          columnName: 'tb2col1',
          columnDesc: 'd2',
          columnType: '0',
          comment: 'd2',
          isPk: 0,
          isFk: 0,
          isNull: 0,
          isAutoIncre: 0,
          defaultValue: '0',
          order: 1,
          isView: null
        }
      ],
      x: 300,
      y: 100
    },
    {
      modelTableId: '3cc',
      dbInstanceId: 1,
      typeName: 'mysql',
      modelName: 'tablemodel3',
      modelNo: '1',
      physicalTableName: 'table2',
      desc: 'desc!!',
      order: 1,
      columns: [
        {
          id: '3',
          modelTableId: '2bb',
          columnName: 'tb2col1',
          columnDesc: 'd2',
          columnType: '0',
          comment: 'd2',
          isPk: 0,
          isFk: 0,
          isNull: 0,
          isAutoIncre: 0,
          defaultValue: '0',
          order: 1,
          isView: null
        }
      ],
      x: 100,
      y: 200
    }
  ],
  relations: [
    {
      id: 1,
      fromTableId: '1aa',
      fromTableColumnId: 'tb1col1',
      toTableId: '2bb',
      toTableColumnId: 'tb2col1',
      dbInstanceId: 1,
      fromAnchor: 1,
      toAnchor: 0,
      fromArrow: '0,n',
      toArrow: '1'
      // controlPoints: [{
      //   x: 150, y: 100
      // }]
    },
    {
      id: 2,
      fromTableId: '1aa',
      fromTableColumnId: 'tb1col2',
      toTableId: '2bb',
      toTableColumnId: 'tb2col1',
      dbInstanceId: 1,
      fromAnchor: 3,
      toAnchor: 0,
      fromArrow: '0,n',
      toArrow: '1'
      // controlPoints: [{
      //   x: 150, y: 100
      // }]
    }
  ]
}
