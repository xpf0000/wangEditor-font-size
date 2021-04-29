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
