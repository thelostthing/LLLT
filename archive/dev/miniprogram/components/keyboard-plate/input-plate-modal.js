// components/keyboard-plate/input-plate-modal.js
import Toast from '@vant/weapp/toast/toast';
const {validatePlate, onPlateInputShare, onPlateDeleteShare, onPlateClearShare, onPlateEVShare} = require('./share.js');

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    defaultPlate: {
      type: String,
      value: '苏'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentPlateMaxLength: 7,
    currentPlate: '',
    currentPlateIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCancelPlate() {
      this.onPlateClear()
      this.triggerEvent('cancel');
    },
    onOkPlate() {
      const {currentPlate} = this.data;
      if(validatePlate(currentPlate)) {
        this.triggerEvent('ok', currentPlate);
        this.onCancelPlate()
      } else {
        Toast.fail({
          message: '当前输入车牌格式不正确',
          context: this
        });
      }
    },
    onPlateInput(e) {
      const {currentPlate, currentPlateIndex, currentPlateMaxLength} = this.data;
      this.setData(onPlateInputShare(e.detail, {currentPlate, currentPlateIndex, currentPlateMaxLength}))
    },
    onPlateDelete() {
      const {currentPlate, currentPlateIndex, currentPlateMaxLength} = this.data;
      this.setData(onPlateDeleteShare({currentPlate}))
    },
    onPlateClear() {
      this.setData(onPlateClearShare())
    },
    onPlateEV() {
      const {currentPlate, currentPlateIndex, currentPlateMaxLength} = this.data;
      this.setData(onPlateEVShare({currentPlateIndex, currentPlate}));
    },
  },
  observers: {
    'show': function(value) {
      if(value && this.data.defaultPlate) {
        this.setData({
          currentPlateIndex: this.data.defaultPlate.length,
          currentPlate: this.data.defaultPlate
        })
      }
    },
  }
})