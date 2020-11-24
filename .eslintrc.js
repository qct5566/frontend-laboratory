module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/eslint-config-standard'
  ],
  rules: {
    'no-console': 'off',
    'generator-star-spacing': 'off',
    'no-mixed-operators': 0,
    'eol-last': 2, // 要求或禁止文件末尾存在空行
    'dot-location': [2, 'property'], // 强制在点号之前和之后一致的换行
    curly: [2, 'multi-line'], // 强制所有控制语句使用一致的括号风格
    'comma-dangle': [2, 'never'], // 要求或禁止末尾逗号
    'no-case-declarations': 0,
    'brace-style': [
      // 强制在代码块中使用一致的大括号风格
      2,
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    'arrow-spacing': [
      // 强制箭头函数的箭头前后使用一致的空格
      2,
      {
        before: true,
        after: true
      }
    ],
    'key-spacing': [
      // 强制在对象字面量的属性中键和值之间使用一致的间距
      2,
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    'no-dupe-args': 2, // 禁止 function 定义中出现重名参数
    'no-dupe-keys': 2, // 禁止对象字面量中出现重复的 key
    'no-empty-pattern': 2, // 禁止使用空解构模式
    'no-multi-spaces': 2, // 禁止出现连续的多个空格，除非是注释前，或对齐对象的属性、变量定义、import 等
    'no-multiple-empty-lines': [ // 禁止出现多行空行
      'error',
      {
        max: 1 // 最多1行
      }
    ],
    'no-shadow-restricted-names': 2, // 禁止使用保留字作为变量名
    'no-unneeded-ternary': [
      2, // 禁止可以在有更简单的可替代的表达式时使用三元操作符，应该使用!a 替代 a ? false : true
      {
        defaultAssignment: false // true-允许条件表达式作为默认的赋值模式 false-禁止
      }
    ],
    'no-unreachable': 2, // 禁止在 return、throw、continue 和 break 语句之后还有代码
    quotes: [ // 强制使用一致的反勾号、双引号或单引号
      2,
      'single', // 要求尽可能地使用单引号
      {
        avoidEscape: true, // true 允许字符串使用单引号或双引号，只要字符串中包含了一个其它引号，否则需要转义
        allowTemplateLiterals: true // true 允许字符串使用反勾号
      }
    ],
    // semi: 0, // 结尾不强制有分号
    'space-before-blocks': [2, 'always'], // if, function 等的大括号之前必须要有空格，比如 if (a) {}
    'space-in-parens': [2, 'never'], // 小括号内的首尾禁止有空格
    'space-infix-ops': 2, // 操作符左右必须有空格，比如 let sum = 1 + 2;
    'space-unary-ops': [ // new, typeof 等后面必须有空格，++, -- 等禁止有空格，
      2,
      {
        words: true,
        nonwords: false
      }
    ],
    'spaced-comment': [ // 注释的斜线或 * 后必须有空格
      2,
      'always', //  always-// 或 /* 必须跟随至少一个空格。 never-其后不允许有空格
      {
        markers: [ // 额外的块级注释字符
          'global',
          'globals',
          'eslint',
          'eslint-disable',
          '*package',
          '!',
          ','
        ]
      }
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // 生产环境禁止使用 debugger
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 5,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/attribute-hyphenation': 0,
    'vue/html-self-closing': 0,
    'vue/html-indent': ['error', 2, { // 强制缩进html模板，默认2格
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: []
    }],
    'vue/component-name-in-template-casing': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/no-unused-components': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/no-parsing-error': 0,
    'no-tabs': 0,
    semi: [
      2,
      'never',
      {
        beforeStatementContinuationChars: 'never'
      }
    ],
    'no-delete-var': 2,
    'prefer-const': [
      2,
      {
        ignoreReadBeforeAssign: false
      }
    ],
    'template-curly-spacing': 'off',
    indent: [2, 2, { SwitchCase: 1 }], // 强制使用一致的缩进
    'vue/order-in-components': [ // 强制使用此规则排序vue组件中的api，依照vue风格指南
      'error',
      {
        order: [
          'el',
          'name',
          'parent',
          'functional',
          ['delimiters', 'comments'],
          ['components', 'directives', 'filters'],
          'extends',
          'mixins',
          'inheritAttrs',
          'model',
          ['props', 'propsData'],
          'fetch',
          'asyncData',
          'data',
          'computed',
          'watch',
          'LIFECYCLE_HOOKS',
          'methods',
          'head',
          ['template', 'render'],
          'renderError'
        ]
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
