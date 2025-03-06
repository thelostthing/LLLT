// components/custom-collapse-text/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String, 
      value: ''
    },
    textOpen: {
      type: String,
      value: '展开'
    },
    textClose: {
      type: String,
      value: '收起'
    },
    textColor: {
      type: String,
      value: 'rgba(47, 47, 49, 1)',
    },
    collapseColor: {
      type: String,
      value: 'rgba(35, 155, 151, 1)',
    },
    textSize: {
      type: String,
      value: '32rpx'
    },
    collapseLine: {
      type: Number,
      value: 2,
    },
    lineHeight: {
      type: String,
      value: '42rpx'
    },
    collapsed: {
      type: Boolean,
      value: true,
    },
    catchCollapse: {
      type: Boolean,
      value: false
    },
    coverColor: {
      type: String,
      value: 'white'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setCollapsed() {
      if(this.data.catchCollapse) {
        this.triggerEvent('collapse', !this.data.collapsed)
      } else {
        this.setData({collapsed: !this.data.collapsed})
      }
    }
  }
})