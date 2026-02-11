import { nodeRichTextToTextWithWrap } from 'simple-mind-map/src/utils/index.js'
import { Platform } from 'obsidian'

const getOnfullscreEnevt = () => {
  if (document.documentElement.requestFullScreen) {
    return 'onfullscreenchange'
  } else if (document.documentElement.webkitRequestFullScreen) {
    return 'onwebkitfullscreenchange'
  } else if (document.documentElement.mozRequestFullScreen) {
    return 'onmozfullscreenchange'
  } else if (document.documentElement.msRequestFullscreen) {
    return 'onmsfullscreenchange'
  }
}

export const fullscrrenEvent = getOnfullscreEnevt()

export const fullScreen = element => {
  if (element.requestFullScreen) {
    element.requestFullScreen()
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  }
}

export const fileToBuffer = file => {
  return new Promise(r => {
    const reader = new FileReader()
    reader.onload = () => {
      r(reader.result)
    }
    reader.readAsArrayBuffer(file)
  })
}

export const copy = text => {
  const input = document.createElement('textarea')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}

export const setDataToClipboard = data => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(data)
  }
}

export const setImgToClipboard = img => {
  if (navigator.clipboard && navigator.clipboard.write) {
    const data = [new ClipboardItem({ ['image/png']: img })]
    navigator.clipboard.write(data)
  }
}

export const printOutline = el => {
  const printContent = el.outerHTML
  const iframe = document.createElement('iframe')
  iframe.setAttribute('style', 'position: absolute; width: 0; height: 0;')
  document.body.appendChild(iframe)
  const iframeDoc = iframe.contentWindow.document
  const styleList = document.querySelectorAll('style')
  Array.from(styleList).forEach(el => {
    iframeDoc.write(el.outerHTML)
  })
  iframeDoc.write('<style media="print">@page {size: portrait;}</style>')
  iframeDoc.write('<div>' + printContent + '</div>')
  setTimeout(function() {
    iframe.contentWindow?.print()
    document.body.removeChild(iframe)
  }, 500)
}

export const getParentWithClass = (el, className) => {
  if (el.classList && el.classList.contains(className)) {
    return el
  }
  if (el.parentNode && el.parentNode !== document.body) {
    return getParentWithClass(el.parentNode, className)
  }
  return null
}

export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const fileType = file.type
    let {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.8,
      mimeType = '',
      exportType = 'dataURL'
    } = options
    const reader = new FileReader()
    reader.onload = event => {
      if (/\/gif$/.test(fileType)) {
        return resolve(event.target.result)
      }
      mimeType = mimeType || fileType
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.floor(width * ratio)
          height = Math.floor(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        if (exportType === 'blob') {
          canvas.toBlob(
            blob => {
              resolve(blob)
            },
            mimeType,
            quality
          )
        } else if (exportType === 'file') {
          canvas.toBlob(
            blob => {
              const newFile = new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now()
              })
              resolve(newFile)
            },
            mimeType,
            quality
          )
        } else {
          resolve(canvas.toDataURL(mimeType, quality))
        }
      }
      img.onerror = function() {
        reject(new Error('图片加载失败'))
      }
      img.src = event.target.result
    }
    reader.onerror = function() {
      reject(new Error('文件读取失败'))
    }
    reader.readAsDataURL(file)
  })
}

export const isHyperlink = text => {
  return /^https?:\/\//.test(text)
}

export const isNormalUrl = url => {
  return isHyperlink(url) || /^data:/.test(url)
}

export const isObLinkText = lt => {
  return /(!?)\[\[([^\]\|\#]*?)(?:(#|\^)([^\]\|]*))?(?:\|([^\]]*))?\]\]/g.test(
    lt
  )
}

export const dfsTraverse = (root, callback = () => {}) => {
  if (!root) return
  const stack = [root]
  while (stack.length > 0) {
    const currentNode = stack.pop()
    callback(currentNode)
    if (currentNode.children) {
      for (let i = currentNode.children.length - 1; i >= 0; i--) {
        stack.push(currentNode.children[i])
      }
    }
  }
}

export const matchAll = (str, regex) => {
  const flags = regex.flags + (regex.global ? '' : 'g')
  const globalRegex = new RegExp(regex, flags)
  const matches = []
  let match
  while ((match = globalRegex.exec(str)) !== null) {
    matches.push({
      fullMatch: match[0],
      groups: match.groups,
      index: match.index,
      captured: match.slice(1)
    })
  }
  return matches
}

export const getObLinkShowName = exp => {
  const linkInfo = parseObsidianLink(`[[${exp}]]`)
  if (!linkInfo) return exp
  if (linkInfo.alias) return linkInfo.alias
  if (linkInfo.heading) return `${linkInfo.target}#${linkInfo.heading}`
  if (linkInfo.block) return `${linkInfo.target}#^${linkInfo.block}`
  return linkInfo.target
}

export const linkRichToObUrlText = (nodeText, done = () => {}) => {
  if (/<a\s+href=/.test(nodeText)) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(nodeText, 'text/html')
    const els = doc.getElementsByTagName('a')
    for (const el of els) {
      const linkUrl = el.getAttribute('href')
      nodeText = nodeText.replace(el.outerHTML, `[[${linkUrl}]]`)
    }
    done()
  }
  return nodeText
}

export const obUrlToLinkRich = str => {
  if (/\[\[[^\[\]]+\]\]/g.test(str)) {
    const m = [...str.matchAll(/\[\[[^\[\]]+\]\]/g)]
    const arr = str.split(/\[\[[^\[\]]+\]\]/g)
    for (let j = m.length - 1; j >= 0; j--) {
      const exp = m[j] && m[j][0] ? m[j][0].slice(2, -2) || null : null
      if (exp !== null && exp.trim().length > 0) {
        arr.splice(
          j + 1,
          0,
          `<a href="${exp}" data-href="${exp}">${getObLinkShowName(exp)}</a>`
        )
      } else {
        arr.splice(j + 1, 0, '')
      }
    }
    return arr.join('')
  }
  return str
}

export const parseObsidianLink = (text, ignoreMdExt = true) => {
  const basicMatch = text.match(/^(!?)\[\[([^\[\]\|]+?)(?:\|([^\[\]]+))?\]\]$/)
  if (!basicMatch) return null

  const [raw, embedMarker, fullTarget, alias] = basicMatch

  let target = fullTarget
  let heading = null
  let block = null

  if (fullTarget.includes('#')) {
    const parts = fullTarget.split('#')
    target = parts[0]

    const remaining = parts.slice(1).join('#')
    if (remaining.includes('^')) {
      const remainingParts = remaining.split('^')
      heading = remainingParts[0] || null
      block = remainingParts[1] || null
    } else {
      heading = remaining || null
    }
  } else if (fullTarget.includes('^')) {
    const parts = fullTarget.split('^')
    target = parts[0]
    block = parts[1] || null
  }

  target = target.trim()
  heading = heading ? heading.trim() : null
  block = block ? block.trim() : null

  return {
    type: embedMarker === '!' ? 'embed' : 'link',
    raw: raw,
    target: target
      ? ignoreMdExt
        ? target.replace(/\.md$/, '')
        : target
      : null,
    alias: alias ? alias.trim() : null,
    heading: heading,
    block: block
  }
}

const mimeToExtension = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
  'image/tiff': '.tiff'
}
export const getFilenameWithExtension = (filename, type) => {
  const dotIndex = filename.lastIndexOf('.')
  const baseName = dotIndex > 0 ? filename.substring(0, dotIndex) : filename
  const extension = mimeToExtension[type]
  return extension ? `${baseName}${extension}` : filename
}

export const base64ToFile = (base64Data, filename, mimeType) => {
  if (!mimeType) {
    const matchRes = base64Data.match(/^data:([^;]+);/)
    mimeType = matchRes && matchRes[1] ? matchRes[1] : 'image/png'
  }
  filename = getFilenameWithExtension(filename || 'file' + Date.now(), mimeType)
  const base64WithoutHeader = base64Data.includes(',')
    ? base64Data.split(',')[1]
    : base64Data
  const byteCharacters = atob(base64WithoutHeader)
  const byteArrays = new Uint8Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays[i] = byteCharacters.charCodeAt(i)
  }
  const blob = new Blob([byteArrays], { type: mimeType })
  return new File([blob], filename, {
    type: mimeType,
    lastModified: Date.now()
  })
}

export const imageUrlToBase64 = async url => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('请求失败')
    }
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    throw error
  }
}

export const checkMindTreeHasImg = tree => {
  let hasImg = false
  const walk = root => {
    if (root.data.image) {
      hasImg = true
      return
    }
    if (root.children) {
      for (let i = 0; i < root.children.length; i++) {
        walk(root.children[i])
      }
    }
  }
  walk(tree)
  return hasImg
}

export const parseInnerLinkAndText = (data, $obsidianAPI) => {
  const obLinkMap = {}
  const textData = []
  const { supportObSearch } = $obsidianAPI.getSettings()
  dfsTraverse(data.root, node => {
    if (supportObSearch) {
      textData.push(
        nodeRichTextToTextWithWrap(node.data.text) + ' ^' + node.data.uid
      )
    }
    const { hyperlink, hyperlinkTitle } = node.data
    if (
      hyperlink &&
      hyperlinkTitle &&
      !isHyperlink(hyperlink) &&
      isObLinkText(hyperlinkTitle)
    ) {
      obLinkMap[hyperlinkTitle] = true
    }
    const matches = matchAll(node.data.text, /<a\s+href="([^"]+)"/g) || []
    matches.forEach(match => {
      if (match && match.captured && match.captured[0]) {
        const res = $obsidianAPI.createLinkInfoFromFilePath(match.captured[0])
        const linkStr = res ? res.linkText : `[[${match.captured[0]}]]`
        obLinkMap[linkStr] = true
      }
    })
  })
  return {
    linkData: Object.keys(obLinkMap).map(key => {
      return key
    }),
    textData
  }
}

export const tFileToFile = async function(tfile, app, mimeTypes = {}) {
  const arrayBuffer = await app.vault.readBinary(tfile)
  const ext = tfile.name
    .split('.')
    .pop()
    .toLowerCase()
  const mimeType = mimeTypes[ext] || ''
  return new File([arrayBuffer], tfile.name, {
    lastModified: tfile.stat.mtime,
    type: mimeType
  })
}

export const checkIsMac = () => {
  return Platform.isMacOS
}

export const isImgFile = filename => {
  return /\.(png|jpe?g|gif|bmp|webp|svg|tiff?)$/i.test(filename)
}