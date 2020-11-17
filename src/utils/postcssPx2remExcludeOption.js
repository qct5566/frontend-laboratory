// 一般的 PC 端的设计稿为 1920 px,移动端的设计稿为 750 px
// 基数设置为设计稿的 1/10
// const fs = require('fs')
// const path = require('path')
// const pnpm_node_modules_path = 'E:\\work\\common-node_modules-store\\node_modules'
// const node_modules_path = 'node_modules'
// const hasPnpmNodeModules = fs.existsSync(path.join(pnpm_node_modules_path))
// const exclude = hasPnpmNodeModules ? new RegExp(`${pnpm_node_modules_path}\\.pnpm|${node_modules_path}`, 'i') : new RegExp(node_modules_path, 'i')

// 使用时在对应工程为html添加font-size与remUnit相同即可
module.exports = {
  plugins: {
    'postcss-px2rem-exclude': {
      remUnit: 37.5, // number, rem 转换单位，为设计稿的 1/10 (default: 75)
      threeVersion: false, // 是否生成 @1x, @2x and @3x 版本的样式 (default: false)
      remVersion: true, // 是否开启自动转化 (default: true)
      baseDpr: 2, // 转换成 px 的基数 (default: 2)
      remPrecision: 6 // rem 转换成 px 的小数位保留 (default: 6)
    //   exclude: /node_modules/i // 忽略node_modules目录下的文件
    }
  }
}
