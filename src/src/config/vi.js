import { checkIsMac } from '@/utils/index.js'

export const fontFamilyList = [
  {
    name: 'Song Thân',
    value: '宋体, SimSun, Songti SC'
  },
  {
    name: 'Microsoft và Yahoo',
    value: '微软雅黑, Microsoft YaHei'
  },
  {
    name: 'Chữ Khải',
    value: '楷体, 楷体_GB2312, SimKai, STKaiti'
  },
  {
    name: 'Da đen',
    value: '黑体, SimHei, Heiti SC'
  },
  {
    name: 'Lệ Thư',
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

export const borderDasharrayList = [
  {
    name: 'Dòng rắn',
    value: 'none'
  },
  {
    name: 'Đường chấm 1',
    value: '5,5'
  },
  {
    name: 'Đường chấm 2',
    value: '10,10'
  },
  {
    name: 'Đường chấm 3',
    value: '20,10,5,5,5,10'
  },
  {
    name: 'Đường chấm 4',
    value: '5,5,1,5'
  },
  {
    name: 'Đường chấm 5',
    value: '15,10,5,10,15'
  },
  {
    name: 'Đường chấm 6',
    value: '1,5'
  },
  {
    name: 'Đường chấm 7',
    value: '6,4'
  }
]

export const lineStyleList = [
  {
    name: 'Đường thẳng',
    value: 'straight'
  },
  {
    name: 'Đường cong',
    value: 'curve'
  },
  {
    name: 'Đường cong2',
    value: 'curve2'
  },
  {
    name: 'Trực tiếp',
    value: 'direct'
  }
]

export const rootLineKeepSameInCurveList = [
  {
    name: 'ngoặc đơn',
    value: false
  },
  {
    name: 'ngoặc nhọn',
    value: true
  }
]

export const rootLineKeepSameInCurveList2 = [
  {
    name: 'ngoặc đơn',
    value: true
  },
  {
    name: 'ngoặc nhọn',
    value: false
  }
]

export const backgroundRepeatList = [
  {
    name: 'Không lặp lại',
    value: 'no-repeat'
  },
  {
    name: 'Lặp lại',
    value: 'repeat'
  },
  {
    name: 'Lặp lại hướng ngang',
    value: 'repeat-x'
  },
  {
    name: 'Lặp lại theo chiều dọc',
    value: 'repeat-y'
  }
]

export const backgroundPositionList = [
  {
    name: 'Mặc định',
    value: '0% 0%'
  },
  {
    name: 'Trái trên',
    value: 'left top'
  },
  {
    name: 'Trái giữa',
    value: 'left center'
  },
  {
    name: 'Trái dưới',
    value: 'left bottom'
  },
  {
    name: 'Phải trên',
    value: 'right top'
  },
  {
    name: 'Phải giữa',
    value: 'right center'
  },
  {
    name: 'Dưới bên phải',
    value: 'right bottom'
  },
  {
    name: 'Giữa trên',
    value: 'center top'
  },
  {
    name: 'Ở giữa',
    value: 'center center'
  },
  {
    name: 'Dưới',
    value: 'center bottom'
  }
]

export const backgroundSizeList = [
  {
    name: 'Tự động',
    value: 'auto'
  },
  {
    name: 'Ghi đè',
    value: 'cover'
  },
  {
    name: 'Giữ',
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
    type: 'Obsidian đặc biệt',
    list: [
      {
        icon: 'iconbaocun',
        name: 'Lưu và cập nhật dữ liệu hình ảnh',
        value: `${ctrl} + Shfit + S`
      },
      {
        icon: 'iconxinbiaoqianyedakai',
        name: 'Trang nhãn mới Mở siêu kết nối',
        value: `${ctrl} + Trái`
      }
    ]
  },
  {
    type: 'Hoạt động nút',
    list: [
      {
        icon: 'icontianjiazijiedian',
        name: 'Chèn nút thấp hơn',
        value: 'Tab | Insert'
      },
      {
        icon: 'iconjiedian',
        name: 'Chèn nút ngang hàng',
        value: enter
      },
      {
        icon: 'icondodeparent',
        name: 'Chèn nút cha',
        value: 'Shift + Tab'
      },
      {
        icon: 'iconshangyi',
        name: 'Chuyển nút lên',
        value: `${ctrl} + ↑`
      },
      {
        icon: 'iconxiayi',
        name: 'Di chuyển nút xuống',
        value: `${ctrl} + ↓`
      },
      {
        icon: 'icongaikuozonglan',
        name: 'Chèn tóm tắt',
        value: `${ctrl} + G`
      },
      {
        icon: 'iconzhankai',
        name: 'Mở rộng/thu gọn các nút',
        value: '/'
      },
      {
        icon: 'iconshanchu',
        name: 'Xóa nút',
        value: 'Delete | Backspace'
      },
      {
        icon: 'iconshanchu',
        name: 'Chỉ xóa nút hiện tại',
        value: 'Shift + Backspace'
      },
      {
        icon: 'iconbianji',
        name: 'Sửa nút',
        value: macFn + 'F2'
      },
      {
        icon: 'iconzhengli',
        name: 'Name',
        value: `${ctrl} + R`
      },
      {
        icon: 'iconzuoyouduiqi',
        name: 'Căn chỉnh một nút cùng cấps',
        value: `${ctrl} + E`
      },
      {
        icon: 'iconsousuo',
        name: 'Tìm kiếm và thay thế',
        value: `${ctrl} + F`
      }
    ]
  },
  {
    type: 'Sửa hành động',
    list: [
      {
        icon: 'iconhoutui-shi',
        name: 'Lùi lại',
        value: `${ctrl} + Z`
      },
      {
        icon: 'iconqianjin1',
        name: 'Tiến lên!',
        value: `${ctrl} + Y`
      },
      {
        icon: 'iconhuanhang',
        name: 'Dòng mới',
        value: `Shift + ${enter}`
      },
      {
        icon: 'iconcase',
        name: 'Mở cỡ',
        value: `${ctrl} + Shift + +`
      },
      {
        icon: 'iconcase',
        name: 'Giảm cỡ',
        value: `${ctrl} + Shift + -`
      },
      {
        icon: 'iconzitijiacu',
        name: 'Thô',
        value: `${ctrl} + B`
      },
      {
        icon: 'iconzitixieti',
        name: 'Nghiêng',
        value: `${ctrl} + I`
      },
      {
        icon: 'iconzitixiahuaxian',
        name: 'Thêm dòng xóa',
        value: `${ctrl} + U`
      },
      {
        icon: 'iconshanchuxian',
        name: 'Thêm dòng xóa',
        value: `${ctrl} + [`
      },
      {
        icon: 'iconfuzhi',
        name: 'Sao chép nút',
        value: `${ctrl} + C`
      },
      {
        icon: 'iconjianqie',
        name: 'Cắt nút',
        value: `${ctrl} + X`
      },
      {
        icon: 'iconniantie',
        name: 'Dán nút',
        value: `${ctrl} + V`
      },
      {
        icon: 'iconquanxuan',
        name: 'Chọn tất cả',
        value: `${ctrl} + A`
      },
      {
        icon: 'iconquanxuan',
        name: 'Nhiều lựa chọn',
        value: `Phải / ${ctrl} + Trái`
      }
    ]
  },
  {
    type: 'Hoạt động Canvas',
    list: [
      {
        icon: 'iconfangda',
        name: 'Phóng to',
        value: `${ctrl} + +`
      },
      {
        icon: 'iconsuoxiao',
        name: 'Thu nhỏ',
        value: `${ctrl} + -`
      },
      {
        icon: 'iconfangda',
        name: 'Phóng to/Thu nhỏ',
        value: `${ctrl} + Cuộn chuột`
      },
      {
        icon: 'icondingwei',
        name: 'Trở lại Root node',
        value: `${ctrl} + ${enter}`
      },
      {
        icon: 'iconquanping1',
        name: 'Thích nghi với Canvas',
        value: `${ctrl} + Shift + I`
      },
      {
        icon: 'iconshubiaoyidong',
        name: 'Di chuyển Canvas',
        value: `Trái / Phải / Phím cách + Trái`
      },
      {
        icon: 'iconshangxiayidong',
        name: 'Di chuyển Canvas lên và xuống',
        value: `Cuộn chuột`
      },
      {
        icon: 'iconzuoyouyidong',
        name: 'Di chuyển canvas trái và phải',
        value: `Shift + Cuộn chuột`
      }
    ]
  },
  {
    type: 'Hoạt động phác thảo',
    list: [
      {
        icon: 'iconhuanhang',
        name: 'Dòng mới',
        value: `Shift + ${enter}`
      },
      {
        icon: 'iconshanchu',
        name: 'Xóa nút',
        value: 'Delete'
      },
      {
        icon: 'iconjiedian',
        name: 'Chèn nút ngang hàng',
        value: enter
      },
      {
        icon: 'icondodechild',
        name: 'Di chuyển một bậc xuống',
        value: 'Tab'
      },
      {
        icon: 'icondodeparent',
        name: 'Di chuyển lên một cấp',
        value: 'Shift + Tab'
      },
      {
        icon: 'iconjiedian',
        name: 'Tạo nội dung sau con trỏ là nút cùng cấp',
        value: `Ctrl + ${enter}`
      }
    ]
  }
]

export const shapeList = [
  {
    name: 'Hình chữ nhật',
    value: 'rectangle'
  },
  {
    name: 'Kim cương',
    value: 'diamond'
  },
  {
    name: 'Tứ giác song song',
    value: 'parallelogram'
  },
  {
    name: 'Hình chữ nhật tròn',
    value: 'roundedRectangle'
  },
  {
    name: 'Hình chữ nhật bát giác',
    value: 'octagonalRectangle'
  },
  {
    name: 'Hình chữ nhật tam giác ngoài',
    value: 'outerTriangularRectangle'
  },
  {
    name: 'Hình chữ nhật tam giác bên trong',
    value: 'innerTriangularRectangle'
  },
  {
    name: 'Hình elip',
    value: 'ellipse'
  },
  {
    name: 'Vòng tròn',
    value: 'circle'
  }
]

export const sidebarTriggerList = [
  {
    name: 'Kiểu nút',
    value: 'nodeStyle',
    icon: 'iconzhuti'
  },
  {
    name: 'Kiểu nền tảng',
    value: 'baseStyle',
    icon: 'iconyangshi'
  },
  {
    name: 'Chủ đề',
    value: 'theme',
    icon: 'iconjingzi'
  },
  {
    name: 'Cấu trúc',
    value: 'structure',
    icon: 'iconjiegou'
  },
  {
    name: 'Trang chủ',
    value: 'outline',
    icon: 'iconfuhao-dagangshu'
  },
  {
    name: 'Thiết lập',
    value: 'setting',
    icon: 'iconshezhi'
  }
]

export const downTypeList = [
  {
    name: '思绪Tài liệu',
    type: 'smm',
    icon: 'iconwenjian',
    desc:
      'SimpleMindMap Định dạng riêng tư, có thể được sử dụng để nhập lại, có thể được chỉnh sửa trực tiếp bởi khách hàng'
  },
  {
    name: 'Hình ảnh',
    type: 'png',
    icon: 'iconPNG',
    desc: 'Định dạng ảnh phổ biến, phù hợp để xem chia sẻ'
  },
  {
    name: 'SVG',
    type: 'svg',
    icon: 'iconSVG',
    desc: 'Thu phóng đồ họa vector'
  },
  {
    name: 'PDF',
    type: 'pdf',
    icon: 'iconpdf',
    desc: 'Thích hợp để xem trình duyệt và in'
  },
  {
    name: 'Markdown',
    type: 'md',
    icon: 'iconmarkdown',
    desc: 'Định dạng văn bản md để dễ dàng mở phần mềm khác'
  },
  {
    name: 'XMind',
    type: 'xmind',
    icon: 'iconxmind',
    desc: 'Định dạng phần mềm XMind'
  },
  {
    name: 'Txt',
    type: 'txt',
    icon: 'iconTXT',
    desc: 'Tập tin văn bản thuần túy'
  },
  {
    name: 'JSON',
    type: 'json',
    icon: 'iconjson',
    desc:
      'Các định dạng trao đổi dữ liệu phổ biến có thể được sử dụng để nhập lại'
  }
]

export const linearGradientDirList = [
  {
    name: 'Từ trái sang phải',
    value: '1',
    start: [0, 0],
    end: [1, 0]
  },
  {
    name: 'Từ phải sang trái',
    value: '2',
    start: [1, 0],
    end: [0, 0]
  },
  {
    name: 'Từ trên xuống dưới',
    value: '3',
    start: [0, 0],
    end: [0, 1]
  },
  {
    name: 'Từ dưới lên trên',
    value: '4',
    start: [0, 1],
    end: [0, 0]
  },
  {
    name: 'Từ trái lên phải xuống',
    value: '5',
    start: [0, 0],
    end: [1, 1]
  },
  {
    name: 'Từ trái xuống phải',
    value: '6',
    start: [0, 1],
    end: [1, 0]
  },
  {
    name: 'Từ trên xuống dưới',
    value: '7',
    start: [1, 0],
    end: [0, 1]
  },
  {
    name: 'Từ phải xuống trái',
    value: '8',
    start: [1, 1],
    end: [0, 0]
  }
]

export const alignList = [
  {
    name: 'Trái:',
    value: 'left'
  },
  {
    name: 'Căn giữa',
    value: 'center'
  },
  {
    name: 'Phải',
    value: 'right'
  }
]

export const layoutGroupList = [
  {
    name: 'Sơ đồ cấu trúc logic',
    list: ['logicalStructure', 'logicalStructureLeft']
  },
  {
    name: 'Bản đồ tư duy',
    list: ['mindMap']
  },
  {
    name: 'Sơ đồ tổ chức',
    list: ['organizationStructure']
  },
  {
    name: 'Sơ đồ tổ chức thư mục',
    list: ['catalogOrganization']
  },
  {
    name: 'Dòng thời gian',
    list: [
      'timeline',
      'timeline2',
      'verticalTimeline'
    ]
  },
  {
    name: 'Bản đồ Fishbone',
    list: ['fishbone']
  }
]

export const iconNameMap = {
  back: 'Quay lại',
  forward: 'Tiến lên',
  painter: 'Sao chép định dạng',
  image: 'Chèn hình ảnh',
  icon: 'Chèn biểu tượng',
  link: 'Chèn siêu liên kết',
  note: 'Chèn ghi chú',
  tag: 'Chèn nhãn',
  summary: 'Chèn tóm tắt',
  associativeLine: 'Thêm đường liên kết',
  formula: 'Chèn công thức toán',
  outerFrame: 'Thêm khung viền',
  ai: 'AI tạo tự động'
}
