/**
 * @description HEX格式转RGB格式
 * @param {String} color HEX格式颜色
 * @returns
 */
export const hex2Rgb = color => {
  color = color.replace('#', '')
  const result = color.match(/../g)
  for (let i = 0; i < 3; i++) {
    result[i] = parseInt(result[i], 16)
  }
  return result
}

/**
 * @description RGB格式转HEX格式
 * @returns
 */
export const rgb2Hex = (r, g, b) => {
  const hexs = [r.toString(16), g.toString(16), b.toString(16)]
  for (let i = 0; i < 3; i++) {
    if (hexs[i].length === 1) {
      hexs[i] = '0' + hexs[i]
    }
  }
  const result = '#' + hexs.join('')
  return result
}

/**
 * @description 颜色变亮
 * @param {*} color HEX格式颜色
 * @param {*} level 等级
 * @returns
 */
export const lighten = (color, level) => {
  const rgb = hex2Rgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i])
  }
  const result = rgb2Hex(rgb[0], rgb[1], rgb[2])
  return result
}

/**
 * @description 颜色变暗
 * @param {*} color HEX格式颜色
 * @param {*} level 等级
 * @returns
 */
export const darken = (color, level) => {
  const rgb = hex2Rgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor(rgb[i] * (1 - level))
  }
  const result = rgb2Hex(rgb[0], rgb[1], rgb[2])
  return result
}
