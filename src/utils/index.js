// 动态加载js
export function loadJs(src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    document.body.appendChild(script)

    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      reject()
    }
  })
}

/**
 * 获取特定位数的随机数
 * @param {number} fC - 位数
 * @returns {string}
 */
export function randomWord(fC) {
  let fu = ''
  let gI = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B',
    'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
    'V', 'W', 'X', 'Y', 'Z', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_']

  for (let i = 0; i < fC; i++) {
    let index = Math.floor(Math.random() * gI.length)
    fu += gI[index]
  }
  return fu
}

// 大写转换
export function strToLowerCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())
}


/**
 *
 * @param {Object} data 重置对象
 */
export function resetData(data) {
  const entries = Object.entries(data)
  const obj = {}
  entries.forEach((item) => {
    obj[item[0]] = Array.isArray(item[1]) ? [] : item[1] === null ? '' : typeof item[1] === 'object' ? {} : ''
  })
  Object.assign(data, obj)
}

/**
 *
 * @param {} obj clone对象
 * @returns
 */
export function deepClone(obj = {}) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  let clone = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj && obj.hasOwnProperty) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        clone[key] = deepClone(obj[key])
      } else {
        clone[key] = obj[key]
      }
    }
  }
  return clone
}
