export const getDroppedText = item => {
  return new Promise(resolve => {
    item.getAsString(resolve)
  })
}

export const handleFiles = (files, validateFileType) => {
  if (!files || files.length === 0) return
  let res = null
  Array.from(files).forEach(file => {
    if (typeof validateFileType === 'function') {
      if (validateFileType(file)) {
        res = file
      }
    } else {
      res = file
    }
  })
  return res
}

export const getDataFromDt = async (dt, validateFileType) => {
  let text = null
  let file = null
  if (dt.files && dt.files.length > 0) {
    file = handleFiles(dt.files, validateFileType)
  }
  else if (dt.items && dt.items.length > 0) {
    for (let i = 0; i < dt.items.length; i++) {
      const item = dt.items[i]
      if (item.kind === 'string' && item.type === 'text/plain') {
        text = await getDroppedText(item)
      }
    }
  }
  return {
    text,
    file
  }
}
