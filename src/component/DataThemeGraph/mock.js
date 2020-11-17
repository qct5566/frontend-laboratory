export const relationship = {
  tables: [
    {
      id: '1',
      name: 'tbl_user',
      columns: [
        { name: 'id', priKey: '1', type: 'int' },
        { name: 'username', type: 'string' },
        { name: 'age', type: 'string' }
      ]
    },
    {
      id: '2',
      name: 'tbl_user_group',
      columns: [
        { name: 'id', pKey: '1', type: 'int' },
        {
          name: 'userId',
          type: 'int',
          fKey: {
            name: 'pk_user_id',
            refTable: 'tbl_user',
            refColumnName: 'id'
          }
        },
        { name: 'groupName', type: 'string' }
      ]
    }
  ],
  edges: [
    {
      from: 'tbl_user',
      to: 'tbl_user_group',
      op: 'Left join',
      condition: [
        { fromField: 'id', compareOp: '=', toField: 'userId' },
        { fromField: 'id', compareOp: '=', toField: 'groupName' }
      ],
      fromAxis: { x: 100, y: 100 },
      toAxis: { x: 400, y: 100 }
    }
  ]
}
