// components/keyboard-plate/input-plate.js
Component({

  /**
   * 组件的属性列表
   */
  externalClasses: ['clear-class'],
  properties: {
    plateIndex: {
      type: Number, 
      value: 0
    },
    plate: {
      type: String,
      value: ''
    },
    platelength: {
      type: Number,
      value: 7
    },
    width: {
      type: String,
      value: '624rpx'
    },
    plateBackground: {
      type: String,
      value: 'rgba(247, 247, 247, 1)'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    plateArray: [],
    isEV: false,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClear() {
      this.triggerEvent('clear');
    },
    enableEV() {
      this.triggerEvent('ev');
    }
  },
  observers: {
    'plate': function(value) {
      if(value) {
        this.setData({plateArray: value.split('')})
      } else {
        this.setData({plateArray: ''})
      }
    },
    'platelength': function(value) {
      if(value == 8) {
        this.setData({isEV: true})
      } else {
        this.setData({isEV: false})
      }
    }
  }
})