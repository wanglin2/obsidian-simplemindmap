import { createUid } from 'simple-mind-map/src/utils/index.js'

export const simpleDeepClone = data => {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return null
  }
}

export const generateRandomString = (
  length = 12,
  charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
) => {
  if (typeof length !== 'number' || length <= 0) {
    throw new Error('长度必须是正整数')
  }
  if (typeof charSet !== 'string' || charSet.length === 0) {
    throw new Error('字符集不能为空')
  }

  let randomValues
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    randomValues = new Uint32Array(length)
    crypto.getRandomValues(randomValues)
  } else {
    randomValues = new Array(length)
      .fill(0)
      .map(() => Math.random() * 0x100000000)
  }

  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i] % charSet.length
    result += charSet.charAt(randomIndex)
  }

  return result
}

export const hideTargetMenu = (menu, text = '在新窗口中打开') => {
  menu.items.forEach(item => {
    if (item.title === text || item.dom?.innerText?.includes(text)) {
      item.dom.hide()
    }
  })
}

export const dataURItoBlob = dataURI => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

export const getUidFromSource = data => {
  const { matches, content } = data.match
  const total = content.length
  const last = matches[matches.length - 1]
  let index = last[1]
  let str = content[index]
  let uid = ''
  let isJoin = false
  while (true || index >= total) {
    if (isJoin && (str === '\n' || str === undefined)) {
      break
    }
    if (isJoin) {
      uid += str
    }
    if (str === '^') {
      isJoin = true
    }
    index++
    str = content[index]
  }
  return uid
}

export const smmFilePathToFileName = (filePath, ext) => {
  if (!filePath) return createUid() + ext
  filePath =
    filePath
      .replace(/\//g, '_')
      .replace(/.smm.md$/, '')
      .replace(/.md$/, '') + ext
  return filePath
}

export const formatFileName = (str, { notename, ignores } = {}) => {
  str = str.trim()
  if (!str) return ''
  str = str.replace(/{([^{}]+)}/g, (...args) => {
    const match = args[1].trim()
    if (ignores && ignores.includes(match)) {
      return args[0]
    }
    if (match === 'notename' && notename) {
      return notename
    } else if (match === 'date') {
      return moment().format('YYYY-MM-DD')
    } else if (match === 'time') {
      return moment().format('HH:mm:ss')
    } else if (match === 'datetime') {
      return moment().format('YYYY-MM-DD HH:mm:ss')
    } else if (match === 'random') {
      return Math.random()
        .toString(36)
        .substring(2, 8)
    } else if (match.startsWith('date:') && match.slice(5).trim()) {
      return moment().format(match.slice(5).trim())
    }
    return args[0]
  })
  return str
}

export const fragWithHTML = html => {
  return createFragment(frag => (frag.createDiv().innerHTML = html))
}