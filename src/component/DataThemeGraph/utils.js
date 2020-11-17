// 判断字符串是否是中文
export const isChinese = (str) => escape(str).indexOf('%u') !== -1

// json方式深拷贝，注意不能拷贝复杂对象
export const jsonDeepClone = (json) => {
  return json !== undefined ? JSON.parse(JSON.stringify(json)) : undefined
}
