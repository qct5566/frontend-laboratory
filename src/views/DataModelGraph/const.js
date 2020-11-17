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
      columns: [
        {
          id: '1',
          modelTableId: '1aa',
          columnName: 'tb1col1',
          columnDesc: 'd3',
          columnType: '0',
          comment: 'd',
          isPk: 1,
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
          isNull: 0,
          isAutoIncre: 0,
          defaultValue: '0',
          order: 1,
          isView: null
        }
      ],
      x: 300,
      y: 100
    }
  ],
  relations: [
    {
      id: 1,
      fromTableId: '1aa',
      fromTableColumnId: 'tb1col1',
      toTableId: '2bb',
      toTableColumnId: 'tb2col1',
      dbInstanceId: 1
    }
  ]
}
