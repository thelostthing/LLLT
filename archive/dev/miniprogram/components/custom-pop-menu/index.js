// components/custom-pop-menu/index.js

{/* <custom-pop-menu id="customPopMenu" safebottom="150rpx">...</custom-pop-menu> */}
{/* <view id="test-1" bind:tap="test"></view> */}
// this.selectComponent("#customPopMenu").show(`#${e.currentTarget.id}`);

const App = getApp();

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    margin: {
      type: String,
      optionalTypes: [Number],
      value: '4rpx'
    },
    safeleft: {
      type: String,
      optionalTypes: [Number],
      value: '0'
    },
    saferight: {
      type: String,
      optionalTypes: [Number],
      value: '0'
    },
    safetop: {
      type: String,
      optionalTypes: [Number],
      value: '0'
    },
    safebottom: {
      type: String,
      optionalTypes: [Number],
      value: '0'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showCustomPopMenu: false,
    customPopMenuStyle: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hide() {
      this.setData({showCustomPopMenu: false, customPopMenuStyle: ''})
    },
    format(value) {
      if(typeof value == 'string') {
        if(value.endsWith('rpx')) {
          return App.rpx2px(parseInt(value))
        } else {
          return parseInt(value)
        }
      } else if(typeof value == 'number') {
        return value
      }
    },
    calculateMenuPosition(triggerX, triggerY, triggerWidth, triggerHeight, menuWidth, menuHeight, viewportX, viewportY, viewportWidth, viewportHeight, margin) {
      // position(x,y) is top-left point of menu
      const positions = [
        { x: triggerX, y: triggerY + triggerHeight + margin, label: 'bottom-right' },
        { x: triggerX, y: triggerY - margin - menuHeight, label: 'top-right' },
        { x: triggerX + triggerWidth - menuWidth, y: triggerY + triggerHeight + margin, label: 'bottom-left' },
        { x: triggerX + triggerWidth - menuWidth, y: triggerY - margin - menuHeight, label: 'top-left' },
      ];
  
      // check if each position's menu rect is in viewport
      for(let i = 0; i < positions.length; i ++) {
        const pos = positions[i];
        if (
          (pos.x >= viewportX) &&
          (pos.y >= viewportY) &&
          ((pos.x + menuWidth) <= (viewportX + viewportWidth)) &&
          ((pos.y + menuHeight) <= (viewportY + viewportHeight))
        ) {
          return pos;
        }
      }
  
      return positions[0];
    },
    show(targetSelector) {
      let {margin=0, safeleft=0, saferight=0, safetop=0, safebottom=0} = this.data;
      margin = this.format(margin);
      safeleft = this.format(safeleft);
      saferight = this.format(saferight);
      safetop = this.format(safetop);
      safebottom = this.format(safebottom);

      const p1 = new Promise((resolve, reject) => {
        wx.createSelectorQuery().select(targetSelector).boundingClientRect((rect) => {
          resolve(rect)
        }).exec();  
      })
      const p2 = new Promise((resolve, reject) => {
        this.createSelectorQuery().select(`.customPopMenuContent`).boundingClientRect((rect) => {
          resolve(rect)
        }).exec();  
      })
      Promise.all([p1, p2]).then(value => {
        const {left: triggerX, top: triggerY, width: triggerWidth, height: triggerHeight} = value[0];
        const {width: menuWidth, height: menuHeight} = value[1];
        const {safeArea} = wx.getWindowInfo()
        const viewportX = safeArea.left + safeleft;
        const viewportY = safeArea.top + safetop;
        const viewportWidth = safeArea.width - safeleft - saferight;
        const viewportHeight = safeArea.height - safetop - safebottom;
        const position = this.calculateMenuPosition(triggerX, triggerY, triggerWidth, triggerHeight, menuWidth, menuHeight, viewportX, viewportY, viewportWidth, viewportHeight, margin);
        this.setData({showCustomPopMenu: true, customPopMenuStyle: `transform: translate3d(${position.x}px, ${position.y}px, 0);`})
      })
    }
  }
})