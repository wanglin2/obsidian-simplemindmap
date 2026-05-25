import { imgToDataUrl } from 'simple-mind-map/src/utils/index'

const handleZHIXI = async data => {
  try {
    try {
      if (!Array.isArray(data)) {
        data = String(data).replace('￿﻿', '')
        data = JSON.parse(data)
      }
    } catch (error) {}
    if (!Array.isArray(data)) {
      data = []
    }
    const newNodeList = []
    const waitLoadImageList = []
    const walk = (list, newList) => {
      list.forEach(async item => {
        let newRoot = {}
        newList.push(newRoot)
        newRoot.data = {
          text: item.data.text,
          hyperlink: item.data.hyperlink,
          hyperlinkTitle: item.data.hyperlinkTitle,
          note: item.data.note
        }
        if (item.data.image) {
          let resolve = null
          let promise = new Promise(_resolve => {
            resolve = _resolve
          })
          waitLoadImageList.push(promise)
          try {
            newRoot.data.image = await imgToDataUrl(item.data.image)
            newRoot.data.imageSize = item.data.imageSize
            resolve()
          } catch (error) {
            resolve()
          }
        }
        newRoot.children = []
        if (item.children && item.children.length > 0) {
          const children = []
          item.children.forEach(item2 => {
            if (item2.data.type === 'generalize') {
              newRoot.data.generalization = [
                {
                  text: item2.data.text
                }
              ]
            } else {
              children.push(item2)
            }
          })
          walk(children, newRoot.children)
        }
      })
    }
    walk(data, newNodeList)
    await Promise.all(waitLoadImageList)
    return {
      simpleMindMap: true,
      data: newNodeList
    }
  } catch (error) {
    return ''
  }
}

const handleClipboardText = async text => {
  try {
    let parsedData = JSON.parse(text)
    if (parsedData.__c_zx_v !== undefined) {
      const res = await handleZHIXI(parsedData.children)
      return res
    }
  } catch (error) {}
  if (text.includes('￿﻿')) {
    const res = await handleZHIXI(text)
    return res
  }
  return ''
}

export default handleClipboardText
