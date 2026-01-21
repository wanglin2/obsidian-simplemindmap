import { checkIsMac } from '@/utils/index.js'

export const fontFamilyList = [
  {
    name: '宋体',
    value: '宋体, SimSun, Songti SC'
  },
  {
    name: '微软雅黑',
    value: '微软雅黑, Microsoft YaHei'
  },
  {
    name: '楷体',
    value: '楷体, 楷体_GB2312, SimKai, STKaiti'
  },
  {
    name: '黑体',
    value: '黑体, SimHei, Heiti SC'
  },
  {
    name: '隶书',
    value: '隶书, SimLi'
  },
  {
    name: 'Andale Mono',
    value: 'andale mono'
  },
  {
    name: 'Arial',
    value: 'arial, helvetica, sans-serif'
  },
  {
    name: 'arialBlack',
    value: 'arial black, avant garde'
  },
  {
    name: 'Comic Sans Ms',
    value: 'comic sans ms'
  },
  {
    name: 'Impact',
    value: 'impact, chicago'
  },
  {
    name: 'Times New Roman',
    value: 'times new roman'
  },
  {
    name: 'Sans-Serif',
    value: 'sans-serif'
  },
  {
    name: 'serif',
    value: 'serif'
  }
]

export const fontSizeList = [10, 12, 14, 16, 18, 24, 32, 48]

export const colorList = [
  '#4D4D4D',
  '#999999',
  '#FFFFFF',
  '#F44E3B',
  '#FE9200',
  '#FCDC00',
  '#DBDF00',
  '#A4DD00',
  '#68CCCA',
  '#73D8FF',
  '#AEA1FF',
  '#FDA1FF',
  '#333333',
  '#808080',
  '#cccccc',
  '#D33115',
  '#E27300',
  '#FCC400',
  '#B0BC00',
  '#68BC00',
  '#16A5A5',
  '#009CE0',
  '#7B64FF',
  '#FA28FF',
  '#000000',
  '#666666',
  '#B3B3B3',
  '#9F0500',
  '#C45100',
  '#FB9E00',
  '#808900',
  '#194D33',
  '#0C797D',
  '#0062B1',
  '#653294',
  'transparent'
]

export const borderWidthList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const borderDasharrayList = [
  {
    name: '实线',
    value: 'none'
  },
  {
    name: '虚线1',
    value: '5,5'
  },
  {
    name: '虚线2',
    value: '10,10'
  },
  {
    name: '虚线3',
    value: '20,10,5,5,5,10'
  },
  {
    name: '虚线4',
    value: '5,5,1,5'
  },
  {
    name: '虚线5',
    value: '15,10,5,10,15'
  },
  {
    name: '虚线6',
    value: '1,5'
  },
  {
    name: '虚线7',
    value: '6,4'
  }
]

export const borderRadiusList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const lineWidthList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const lineHeightList = [1, 1.2, 1.5, 2, 2.5, 3]

export const lineStyleMap = {
  straight: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="60" height="26"><path d="M18,14L30,14L30,5L42,5" fill="none" stroke="#000" stroke-width="2"></path><path d="M18,14L30,14L30,23L42,23" fill="none" stroke="#000" stroke-width="2"></path></svg>`,
  curve: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="60" height="26"><path d="M18,14C30,14 30,5 42,5" fill="none" stroke="#000" stroke-width="2"></path><path d="M18,14C30,14 30,23 42,23" fill="none" stroke="#000" stroke-width="2"></path></svg>`,
  curve2: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="60" height="26"><path d="M18,14L30,14A12,-9 0 0 1 42,5" fill="none" stroke="#000" stroke-width="2"></path><path d="M18,14L30,14A12,9 0 0 0 42,23" fill="none" stroke="#000" stroke-width="2"></path></svg>`,
  direct: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="60" height="26"><path d="M18,14L30,14L42,5" fill="none" stroke="#000" stroke-width="2"></path><path d="M18,14L30,14L42,23" fill="none" stroke="#000" stroke-width="2"></path></svg>`
}

export const lineStyleList = [
  {
    name: '直线',
    value: 'straight'
  },
  {
    name: '曲线',
    value: 'curve'
  },
  {
    name: '曲线2',
    value: 'curve2'
  },
  {
    name: '直连',
    value: 'direct'
  }
]

export const rootLineKeepSameInCurveList = [
  {
    name: '括号',
    value: false
  },
  {
    name: '大括号',
    value: true
  }
]

export const rootLineKeepSameInCurveList2 = [
  {
    name: '括号',
    value: true
  },
  {
    name: '大括号',
    value: false
  }
]

export const backgroundRepeatList = [
  {
    name: '不重复',
    value: 'no-repeat'
  },
  {
    name: '重复',
    value: 'repeat'
  },
  {
    name: '水平方向重复',
    value: 'repeat-x'
  },
  {
    name: '垂直方向重复',
    value: 'repeat-y'
  }
]

export const backgroundPositionList = [
  {
    name: '默认',
    value: '0% 0%'
  },
  {
    name: '左上',
    value: 'left top'
  },
  {
    name: '左中',
    value: 'left center'
  },
  {
    name: '左下',
    value: 'left bottom'
  },
  {
    name: '右上',
    value: 'right top'
  },
  {
    name: '右中',
    value: 'right center'
  },
  {
    name: '右下',
    value: 'right bottom'
  },
  {
    name: '中上',
    value: 'center top'
  },
  {
    name: '居中',
    value: 'center center'
  },
  {
    name: '中下',
    value: 'center bottom'
  }
]

export const backgroundSizeList = [
  {
    name: '自动',
    value: 'auto'
  },
  {
    name: '覆盖',
    value: 'cover'
  },
  {
    name: '保持',
    value: 'contain'
  }
]

export const store = {
  sidebarZIndex: 1
}
const isMac = checkIsMac()
const ctrl = isMac ? '⌘' : 'Ctrl'
const enter = isMac ? 'Return' : 'Enter'
const macFn = isMac ? 'fn + ' : ''

export const shortcutKeyList = [
  {
    type: 'Obsidian特有',
    list: [
      {
        icon: 'iconbaocun',
        name: '保存并更新图像数据',
        value: `${ctrl} + Shfit + S`
      },
      {
        icon: 'iconxinbiaoqianyedakai',
        name: '新标签页打开超链接',
        value: `${ctrl} + 左键`
      }
    ]
  },
  {
    type: '节点操作',
    list: [
      {
        icon: 'icontianjiazijiedian',
        name: '插入下级节点',
        value: 'Tab | Insert'
      },
      {
        icon: 'iconjiedian',
        name: '插入同级节点',
        value: enter
      },
      {
        icon: 'icondodeparent',
        name: '插入父节点',
        value: 'Shift + Tab'
      },
      {
        icon: 'iconshangyi',
        name: '上移节点',
        value: `${ctrl} + ↑`
      },
      {
        icon: 'iconxiayi',
        name: '下移节点',
        value: `${ctrl} + ↓`
      },
      {
        icon: 'icongaikuozonglan',
        name: '插入概要',
        value: `${ctrl} + G`
      },
      {
        icon: 'iconzhankai',
        name: '展开/收起节点',
        value: '/'
      },
      {
        icon: 'iconshanchu',
        name: '删除节点',
        value: 'Delete | Backspace'
      },
      {
        icon: 'iconshanchu',
        name: '仅删除当前节点',
        value: 'Shift + Backspace'
      },
      {
        icon: 'iconbianji',
        name: '编辑节点',
        value: macFn + 'F2'
      },
      {
        icon: 'iconzuoyouduiqi',
        name: '一键同级节点对齐',
        value: `${ctrl} + E`
      },
      {
        icon: 'iconsousuo',
        name: '搜索和替换',
        value: `${ctrl} + F`
      }
    ]
  },
  {
    type: '编辑操作',
    list: [
      {
        icon: 'iconhoutui-shi',
        name: '回退',
        value: `${ctrl} + Z`
      },
      {
        icon: 'iconqianjin1',
        name: '前进',
        value: `${ctrl} + Y`
      },
      {
        icon: 'iconhuanhang',
        name: '文本换行',
        value: `Shift + ${enter}`
      },
      {
        icon: 'iconcase',
        name: '增大字号',
        value: `${ctrl} + Shift + +`
      },
      {
        icon: 'iconcase',
        name: '减小字号',
        value: `${ctrl} + Shift + -`
      },
      {
        icon: 'iconzitijiacu',
        name: '加粗',
        value: `${ctrl} + B`
      },
      {
        icon: 'iconzitixieti',
        name: '斜体',
        value: `${ctrl} + I`
      },
      {
        icon: 'iconzitixiahuaxian',
        name: '添加下划线',
        value: `${ctrl} + U`
      },
      {
        icon: 'iconshanchuxian',
        name: '添加删除线',
        value: `${ctrl} + [`
      },
      {
        icon: 'iconfuzhi',
        name: '复制节点',
        value: `${ctrl} + C`
      },
      {
        icon: 'iconjianqie',
        name: '剪切节点',
        value: `${ctrl} + X`
      },
      {
        icon: 'iconniantie',
        name: '粘贴节点',
        value: `${ctrl} + V`
      },
      {
        icon: 'iconquanxuan',
        name: '全选',
        value: `${ctrl} + A`
      },
      {
        icon: 'iconquanxuan',
        name: '多选',
        value: `右键 / ${ctrl} + 左键`
      }
    ]
  },
  {
    type: '画布操作',
    list: [
      {
        icon: 'iconfangda',
        name: '放大',
        value: `${ctrl} + +`
      },
      {
        icon: 'iconsuoxiao',
        name: '缩小',
        value: `${ctrl} + -`
      },
      {
        icon: 'iconfangda',
        name: '放大/缩小',
        value: `${ctrl} + 鼠标滚动`
      },
      {
        icon: 'icondingwei',
        name: '回到根节点',
        value: `${ctrl} + ${enter}`
      },
      {
        icon: 'iconquanping1',
        name: '适应画布',
        value: `${ctrl} + Shift + I`
      },
      {
        icon: 'iconzhengli',
        name: '一键整理布局',
        value: `${ctrl} + R`
      },
      {
        icon: 'iconshubiaoyidong',
        name: '移动画布',
        value: `左键 / 右键 / 空格键 + 左键`
      },
      {
        icon: 'iconshangxiayidong',
        name: '上下移动画布',
        value: `鼠标滚动`
      },
      {
        icon: 'iconzuoyouyidong',
        name: '左右移动画布',
        value: `Shift + 鼠标滚动`
      }
    ]
  },
  {
    type: '大纲操作',
    list: [
      {
        icon: 'iconhuanhang',
        name: '文本换行',
        value: `Shift + ${enter}`
      },
      {
        icon: 'iconshanchu',
        name: '删除节点',
        value: 'Delete'
      },
      {
        icon: 'iconjiedian',
        name: '插入同级节点',
        value: enter
      },
      {
        icon: 'icondodechild',
        name: '下移一个层级',
        value: 'Tab'
      },
      {
        icon: 'icondodeparent',
        name: '上移一个层级',
        value: 'Shift + Tab'
      },
      {
        icon: 'iconjiedian',
        name: '将光标后的内容创建为同级节点',
        value: `Ctrl + ${enter}`
      }
    ]
  }
]

export const shapeListMap = {
  rectangle: 'M 4 12 L 4 3 L 56 3 L 56 21 L 4 21 L 4 12 Z',
  diamond: 'M 4 12 L 30 3 L 56 12 L 30 21 L 4 12 Z',
  parallelogram: 'M 10 3 L 56 3 L 50 21 L 4 21 L 10 3 Z',
  roundedRectangle:
    'M 13 3 L 47 3 A 9 9 0, 0 1 47 21 L 13 21 A 9 9 0, 0 1 13 3 Z',
  octagonalRectangle:
    'M 4 12 L 4 9 L 10 3 L 50 3 L 56 9 L 56 15 L 50 21 L 10 21 L 4 15 L 4 12 Z',
  outerTriangularRectangle:
    'M 4 12 L 10 3 L 50 3 L 56 12 L 50 21 L 10 21 L 4 12 Z',
  innerTriangularRectangle:
    'M 10 12 L 4 3 L 56 3 L 50 12 L 56 21 L 4 21 L 10 12 Z',
  ellipse: 'M 4 12 A 26 9 0, 1, 0 30 3 A 26 9 0, 0, 0 4 12 Z',
  circle: 'M 21 12 A 9 9 0, 1, 0 30 3 A 9 9 0, 0, 0 21 12 Z'
}

export const shapeList = [
  {
    name: '矩形',
    value: 'rectangle'
  },
  {
    name: '菱形',
    value: 'diamond'
  },
  {
    name: '平行四边形',
    value: 'parallelogram'
  },
  {
    name: '圆角矩形',
    value: 'roundedRectangle'
  },
  {
    name: '八角矩形',
    value: 'octagonalRectangle'
  },
  {
    name: '外三角矩形',
    value: 'outerTriangularRectangle'
  },
  {
    name: '内三角矩形',
    value: 'innerTriangularRectangle'
  },
  {
    name: '椭圆',
    value: 'ellipse'
  },
  {
    name: '圆',
    value: 'circle'
  }
]

export const langList = [
  {
    value: 'zh',
    name: '简体中文'
  },
  {
    value: 'zhtw',
    alias: 'zh-TW',
    name: '繁體中文'
  },
  {
    value: 'en',
    name: 'English'
  },
  {
    value: 'vi',
    name: 'Tiếng Việt'
  }
]

export const sidebarTriggerList = [
  {
    name: '节点样式',
    value: 'nodeStyle',
    icon: 'iconzhuti'
  },
  {
    name: '基础样式',
    value: 'baseStyle',
    icon: 'iconjichuyangshi'
  },
  {
    name: '主题',
    value: 'theme',
    icon: 'iconjingzi'
  },
  {
    name: '结构',
    value: 'structure',
    icon: 'iconjiegou'
  },
  {
    name: '大纲',
    value: 'outline',
    icon: 'iconfuhao-dagangshu'
  },
  {
    name: '设置',
    value: 'setting',
    icon: 'iconshezhi'
  }
]

export const downTypeList = [
  {
    name: '思绪文件',
    type: 'smm',
    icon: 'iconwenjian',
    desc: 'SimpleMindMap私有格式，可用于再次导入，客户端可直接编辑'
  },
  {
    name: '图片',
    type: 'png',
    icon: 'iconPNG',
    desc: '常用图片格式，适合查看分享'
  },
  {
    name: 'SVG',
    type: 'svg',
    icon: 'iconSVG',
    desc: '可缩放矢量图形'
  },
  {
    name: 'PDF',
    type: 'pdf',
    icon: 'iconpdf',
    desc: '适合查看浏览和打印'
  },
  {
    name: 'Markdown',
    type: 'md',
    icon: 'iconmarkdown',
    desc: 'md文本格式，便于其他软件打开'
  },
  {
    name: 'XMind',
    type: 'xmind',
    icon: 'iconxmind',
    desc: 'XMind软件格式'
  },
  {
    name: 'Txt',
    type: 'txt',
    icon: 'iconTXT',
    desc: '纯文本文件'
  },
  {
    name: 'JSON',
    type: 'json',
    icon: 'iconjson',
    desc: '流行的数据交换格式，可用于再次导入'
  }
]

export const linearGradientDirList = [
  {
    name: '从左到右',
    value: '1',
    start: [0, 0],
    end: [1, 0]
  },
  {
    name: '从右到左',
    value: '2',
    start: [1, 0],
    end: [0, 0]
  },
  {
    name: '从上到下',
    value: '3',
    start: [0, 0],
    end: [0, 1]
  },
  {
    name: '从下到上',
    value: '4',
    start: [0, 1],
    end: [0, 0]
  },
  {
    name: '从左上到右下',
    value: '5',
    start: [0, 0],
    end: [1, 1]
  },
  {
    name: '从左下到右上',
    value: '6',
    start: [0, 1],
    end: [1, 0]
  },
  {
    name: '从右上到左下',
    value: '7',
    start: [1, 0],
    end: [0, 1]
  },
  {
    name: '从右下到左上',
    value: '8',
    start: [1, 1],
    end: [0, 0]
  }
]

export const alignList = [
  {
    name: '左对齐',
    value: 'left'
  },
  {
    name: '居中对齐',
    value: 'center'
  },
  {
    name: '右对齐',
    value: 'right'
  }
]

export const layoutGroupList = [
  {
    name: '逻辑结构图',
    list: ['logicalStructure', 'logicalStructureLeft']
  },
  {
    name: '思维导图',
    list: ['mindMap']
  },
  {
    name: '组织结构图',
    list: ['organizationStructure']
  },
  {
    name: '目录组织图',
    list: ['catalogOrganization']
  },
  {
    name: '时间轴',
    list: [
      'timeline',
      'timeline2',
      'verticalTimeline'
    ]
  },
  {
    name: '鱼骨图',
    list: ['fishbone']
  }
]

export const iconNameMap = {
  back: '回退',
  forward: '前进',
  painter: '格式刷',
  image: '插入图片',
  icon: '插入图标',
  link: '插入超链接',
  note: '插入备注',
  tag: '插入标签',
  summary: '插入概要',
  associativeLine: '添加关联线',
  formula: '插入数学公式',
  outerFrame: '添加外框',
  ai: 'AI一键生成'
}
