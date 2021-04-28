<template>
  <div id="app">
    <div ref="editor"><p>Content of the editor.</p></div>
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
      editor.config.fontSizes = {
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
    },
    methods: {}
  }
</script>
