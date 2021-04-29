## wangEditor 字号扩展 突破最多7个字号的限制

### 不支持IE IE没有Selection.containsNode方法

### 如果想支持IE 可以根据选择范围自己去获取所有的选中节点 目前未找到官方的方法去获取 只能根据选区Range 自己处理

### 此方法还有个问题 就是非styleWithCss模式或firefox浏览器中 会把内容拆的很碎 默认的document.execCommand('fontSize') 方法, 会自动拆分合并内容, 但是font标签上一旦加上style, 会导致无法合并内容, 对同一段内容多次设置字体的时候, 会生成很多<font>标签
 
```js
import wangEditor from 'wangeditor'
class FontSizeList {
  constructor(list) {
    this.itemList = []
    for (let key in list) {
      const item = list[key]
      this.itemList.push({
        $elem: wangEditor.$(`<p style="font-size:${key}">${item.name}</p>`),
        value: item.value
      })
    }
  }
  getItemList() {
    return this.itemList
  }
}

const removeChildFontSize = (dom) => {
  if (dom && dom.children) {
    let children = dom.children
    for (let child of children) {
      child.style.fontSize = ''
      removeChildFontSize(child)
    }
  }
}

export default class FontSizeMenu extends wangEditor.DropListMenu {
  constructor(editor) {
    // data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
    const $elem = wangEditor.$(
      `<div class="w-e-menu" data-title="字号"><i class="w-e-icon-text-heigh"></i></div>`
    )
    let fontStyleList = new FontSizeList(editor.config.fontSize)
    const fontListConf = {
      width: 160,
      title: '设置字号',
      type: 'list',
      list: fontStyleList.getItemList(),
      clickHandler: (value) => {
        this.command(value)
      }
    }
    super($elem, editor, fontListConf)
  }

  /**
   * 执行命令
   * @param value value
   */
  command(value) {
    const editor = this.editor
    const isEmptySelection = editor.selection.isSelectionEmpty()

    let selectionElem = editor.selection.getSelectionContainerElem()?.elems[0]

    if (selectionElem == null) return

    const isFont = selectionElem?.nodeName.toLowerCase() !== 'p'
    const isSameSize = selectionElem?.getAttribute('size') === value
    if (isEmptySelection) {
      if (isFont && !isSameSize) {
        const $elems = editor.selection.getSelectionRangeTopNodes()
        const focusElem = $elems[0].elems[0]
        editor.selection.createRangeByElem($elems[0])
        editor.selection.moveCursor(focusElem)
        selectionElem = focusElem
      }
      editor.selection.setRangeToElem(selectionElem)
      // 插入空白选区
      editor.selection.createEmptyRange()
    }
    // 给定一个默认的值
    editor.cmd.do('fontSize', 5)
    // 获取包含完整选区的元素
    let current = document.getSelection().getRangeAt(0).commonAncestorContainer
    if (current.nodeType !== 1) {
      current = current.parentNode
    }
    let nodes = []
    // 获取当前文档内的选区
    let selection = document.getSelection()
    // 获取选区内的所有节点
    function find(el) {
      for (let c of el.childNodes) {
        if (selection.containsNode(c, false)) {
          if (c.nodeType !== 1) {
            let p = c.parentNode
            if (!nodes.includes(p)) {
              nodes.push(p)
            }
          } else {
            if (!nodes.includes(c)) {
              nodes.push(c)
            }
          }
        }
        find(c)
      }
    }
    find(current)
    // 设置选择的元素的字号 移除size属性 否则下次无法更改字号 添加自身的字号
    nodes.forEach((n) => {
      n.removeAttribute('size')
      n.style.fontSize = value
    })
    if (isEmptySelection) {
      // 需要将选区范围折叠起来
      editor.selection.collapseRange()
      editor.selection.restoreSelection()
    }
  }

  tryChangeActive() {}
}

```

```js
// 系统自带的是fontSizes 这里使用fontSize 避免冲突 两者可以同时使用
editor.config.fontSize = {
        '10px': { name: '10px', value: '10px' },
        '12px': { name: '12px', value: '12px' },
        '14px': { name: '14px', value: '14px' },
        '16px': { name: '16px', value: '16px' },
        '18px': { name: '18px', value: '18px' },
        '20px': { name: '20px', value: '20px' },
        '24px': { name: '24px', value: '24px' },
        '28px': { name: '28px', value: '28px' },
        '32px': { name: '32px', value: '32px' },
        '36px': { name: '36px', value: '36px' },
        '40px': { name: '40px', value: '40px' },
        '44px': { name: '44px', value: '44px' },
        '48px': { name: '48px', value: '48px' },
        '56px': { name: '56px', value: '56px' },
        '64px': { name: '64px', value: '64px' },
        '72px': { name: '72px', value: '72px' }
      }
```
