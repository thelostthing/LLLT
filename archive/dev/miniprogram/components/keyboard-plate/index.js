// components/keyboard-plate/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
    plateIndex: {
      type: Number, 
      value: 0
    },
    plateChar: {
      type: String,
      value: ''
    },
    placeholder: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
		keyValue1: '京津渝沪冀晋辽吉黑苏',
		keyValue2: '浙皖闽赣鲁豫鄂湘粤琼',
		keyValue3: '川贵云陕甘青蒙桂宁新',
		keyValue4: '藏使领警学港澳',
		keyNumber: '1234567890',
		keyLetterValue1: 'QWERTYUIOP',
		keyLetterValue2: 'ASDFGHJKL',
		keyLetterValue3: 'ZXCVBNM',
		keyLetterValue4: '使领警学港澳',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickKey(e) {
      const {key} = e.currentTarget.dataset;
      if(key == 'delete') {
        this.triggerEvent('delete');
      } else {
        this.triggerEvent('input', key);
      }
    }
  }
})