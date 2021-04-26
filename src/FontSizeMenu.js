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
    let fontStyleList = new FontSizeList(editor.config.fontSizes)
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
    const styleWithCSS = editor.config.styleWithCSS
    // 此方式只能在styleWithCSS模式下生效 临时切换模式
    if (!styleWithCSS) {
      document.execCommand('styleWithCSS', false, 'true')
    }
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
    editor.cmd.do('fontSize', value)
    // 获取包含完整选区的元素
    let current = editor.selection._currentRange.commonAncestorContainer
    if (current.nodeType !== 1) {
      current = current.parentNode
    }
    let nodes = []
    if (!current.children || current.children.length === 0) {
      nodes = [current]
    } else {
      // 根据选区的开始结束节点 获取实际选择的元素
      let start = editor.selection._currentRange.startContainer
      let end = editor.selection._currentRange.endContainer
      if (start.nodeType !== 1) {
        start = start.parentNode
      }
      if (end.nodeType !== 1) {
        end = end.parentNode
      }
      let add = false
      // 获取开始->结束之间的所有节点
      function find(start, end, el) {
        for (let c of el.children) {
          if (c === start) {
            add = true
          }
          if (add) {
            nodes.push(c)
          }
          if (c === end) {
            break
          }
          find(start, end, c)
        }
      }
      find(start, end, current)
      nodes.splice(nodes.indexOf(end) + 1)
      // 检测结束节点 节点是否父节点的最后一个节点 如果不是 递归排除父节点 如果是 向上递归检测
      function checkEnd(end) {
        let parent = end.parentNode
        let last = parent.lastChild
        if (end !== last) {
          while (parent) {
            if (nodes.includes(parent)) {
              nodes.splice(nodes.indexOf(parent), 1)
            }
            parent = parent.parentNode
          }
        } else {
          checkEnd(parent)
        }
      }
      checkEnd(end)
    }
    // 设置选择的元素的字号 移除子元素的字号 添加自身的字号
    nodes.forEach((n) => {
      removeChildFontSize(n)
      n.style.fontSize = value
    })
    if (isEmptySelection) {
      // 需要将选区范围折叠起来
      editor.selection.collapseRange()
      editor.selection.restoreSelection()
    }
    // 恢复用户配置的styleWithCSS模式
    if (!styleWithCSS) {
      document.execCommand('styleWithCSS', false, false)
    }
  }

  tryChangeActive() {}
}
