import { getDefaultSmmData, SMM_TAG } from './constant'
import LZString from 'lz-string'
import i18n from 'i18next'

export const parseMarkdownText = text => {
  const result = {
    metadata: { path: '', tags: [], yaml: '', content: '' },
    svgdata: '',
    svgdataUpdateAt: '',
    linkdata: [],
    textdata: []
  }

  const lines = text.split('\n')
  let currentSection = ''
  let inCodeBlock = false
  let inYamlHeader = false
  let inTags = false
  let codeBlockContent = []

  for (const line of lines) {
    if (line.trim() === '---') {
      inYamlHeader = !inYamlHeader
      continue
    }

    if (line.startsWith('# metadata')) {
      currentSection = 'metadata'
      continue
    } else if (line.startsWith('# svgdata')) {
      currentSection = 'svgdata'
      continue
    } else if (line.startsWith('# linkdata')) {
      currentSection = 'linkdata'
      continue
    } else if (line.startsWith('# textdata')) {
      break
    }

    if (line.trim() === '```metadata' || line.trim() === '```svgData') {
      inCodeBlock = true
      continue
    } else if (line.trim() === '```' && inCodeBlock) {
      inCodeBlock = false
      if (currentSection === 'metadata') {
        result.metadata.content = codeBlockContent.join('\n')
        codeBlockContent = []
      } else if (currentSection === 'svgdata') {
        result.svgdata = codeBlockContent.join('\n')
        if (result.svgdata == undefined) {
          result.svgdata = ''
        }
        codeBlockContent = []
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockContent.push(line)
    } else if (currentSection === 'linkdata' && line.startsWith('- ')) {
      result.linkdata.push(line.replace('- ', '').trim())
    } else if (currentSection === 'svgdata') {
      if (line.startsWith('![[')) {
        result.svgdata = line.trim()
      } else if (line.startsWith('> updateAt:')) {
        result.svgdataUpdateAt = line.match(/> updateAt:\s*(.*)/)[1]
      }
    } else if (inYamlHeader) {
      if (line.startsWith('tags:')) {
        inTags = true
      } else if (inTags && line.startsWith('  -')) {
        result.metadata.tags.push(line.replace('  -', '').trim())
      } else {
        inTags = false
        if (line.startsWith('path:')) {
          result.metadata.path = line.split(':')[1].trim()
        } else if (line) {
          result.metadata.yaml += line + '\n'
        }
      }
    }
  }

  return result
}

export const assembleMarkdownText = obj => {
  let result = '---\n'

  result += `path: ${obj.metadata.path}\n`
  result += 'tags:\n'
  for (const tag of obj.metadata.tags) {
    result += `  - ${tag}\n`
  }
  if (obj.metadata.yaml) {
    result += obj.metadata.yaml
  }
  result += '---\n'

  result += '> ' + i18n.t('tip.mdModifyTip') + '\n'

  result += '# metadata\n'
  result += '```metadata\n'
  result += obj.metadata.content
  result += '\n```\n'

  result += '# svgdata\n'
  if (obj.svgdata && /^!\[\[/.test(obj.svgdata)) {
    result += obj.svgdata + '\n'
    result += '> updateAt: ' + (obj.svgdataUpdateAt || '') + '\n'
  } else {
    result += '```svgData\n'
    result += obj.svgdata
    result += '\n```\n'
  }

  result += '# linkdata\n'
  for (const item of obj.linkdata) {
    result += `- ${item}\n`
  }

  result += '# textdata\n'
  if (obj.textdata && Array.isArray(obj.textdata)) {
    result += obj.textdata.join('\n\n')
  }
  return result
}

export const createDefaultMindMapData = (options, isCompress = true) => {
  const content = JSON.stringify(getDefaultSmmData(options))
  return isCompress ? LZString.compressToBase64(content) : content
}

export const createDefaultText = (filePath, options) => {
  return assembleMarkdownText({
    metadata: {
      path: `${filePath || ''}`,
      tags: [SMM_TAG],
      yaml: '',
      content: createDefaultMindMapData(options)
    },
    svgdata: '',
    svgdataUpdateAt: '',
    linkdata: [],
    textdata: []
  })
}
