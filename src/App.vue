<template>
  <div id="app">
    <div ref="editor">
      <p>
        Conte
        <font style="font-size: 20px">nt of the editor.</font>
      </p>
      <p data-we-empty-p="" style="font-size: 20px">
        <font style="font-size: 20px">
          fasdfsd
          <font style="font-size: 20px">
            收到积分
            <font style="font-size: 20px">
              卡商
              <font style="font-size: 20px">家端看风使舵发</font>
            </font>
          </font>
        </font>
      </p>
      <p data-we-empty-p="" style="font-size: 40px">
        <font style="font-size: 40px">
          <font style="font-size: 20px">啊水</font>
          <font style="font-size: 20px">
            电
            <font style="font-size: 56px">费</font>
          </font>
          <font style="font-size: 56px">
            <font style="font-size: 56px">杰</font>
            <font style="font-size: 56px">
              <font style="font-size: 56px">卡斯</font>
              大
              <font ref="start" style="font-size: 12px">姐</font>
            </font>
          </font>
        </font>
        <font style="font-size: 40px" size="5">
          <font style="font-size: 56px">夫就</font>
          是看到
        </font>
      </p>
      <p>
        <font style="font-size: 40px">
          <font ref="end" style="font-size: 12px">sadjfkasjdkfjsdjfkdsjf</font>
          kjf
        </font>
        <font style="font-size: 40px">sdf</font>
        <br />
      </p>
    </div>
    <!--    eslint-disable-next-line-->
    <p ref="p" contenteditable="true">Example:<i> italic </i> and <b>b<span>old</span></b></p>
  </div>
</template>

<script>
  import E from 'wangeditor'
  export default {
    name: 'App',
    data() {
      return {}
    },
    mounted() {
      const editor = new E(this.$refs.editor)
      editor.config.styleWithCSS = true
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
      editor.create()

      setTimeout(() => {
        let range = new Range()
        // range.setStart(p.firstChild, 0)
        range.setStart(this.$refs.start.firstChild, 0)
        // range.setEnd(p.querySelector('b').firstChild, 1)
        range.setEnd(this.$refs.end.nextSibling, 0)
        console.log(range) // ample: italic and bol
        // use this range for selection (explained later)
        document.getSelection().addRange(range)
        editor.selection.saveRange(range)
      }, 2000)

      // document.execCommand('fontSize', null, 5)
      // console.log(document.getSelection().getRangeAt(0))
    },
    methods: {
      getRangeNode() {
        let range = document.getSelection().getRangeAt(0)
        let root = range.commonAncestorContainer
      }
    }
  }
</script>
