const config = require('./../config')
const {calculateCenterOfMass} = require('./map')

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const storage = {
  get: (key) => {
		return wx.getStorageSync(key)
	},
	set: (key, value) => {
    wx.setStorageSync(key, value)
	},
	remove: (key) => {
		wx.removeStorageSync(key)
	},
	clear: () => {
    wx.clearStorageSync()
  },
};

const showEndBusy = (text, time) => wx.showToast({
  title: text,
  icon: 'none',
  duration: time || 1600
});

/*函数节流*/
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 300 ;//间隔时间，如果interval不传，则默认300ms
  return function() {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context,arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*函数防抖*/
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
  return function() {
    clearTimeout(timer);
    var context = this;
    var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function() {
      fn.call(context,args);
    }, gapTime);
  };
}

const getCenter = (getCurrent=false) => {
  // 当前定位 > 配置默认
  return new Promise((resolve, reject) => {
    let result = config.map.center; //配置默认
    try {
      if(getCurrent) {
        wx.getLocation({
          type: 'gcj02',
          isHighAccuracy: true,
          success: res => {
            wx.request({
              url: config.map.regeo, // `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_KEY}`
              data: {
                output: "json",
                location: `${res.longitude},${res.latitude}`,
                radius: "1000",
                extensions: "all",
                roadlevel: "0",
                batch: true,
              },
              success: (res2) => {
                if (res2.data && res2.data.regeocodes) {
                  result = {
                    longitude: res.longitude,
                    latitude: res.latitude,
                    name: res2.data.regeocodes[0].formatted_address
                  }
                }
                resolve(result);
              },
              fail: err => {
                resolve(result);
              }
            });
          },
          fail: err => {
            resolve(result);
          }
        })
      } else {
        resolve(result);
      }
    } catch(e) {
      resolve(result);
    }
  })
}

// type: gcj02 wgs84
const getLocation = (type='gcj02', getName=false) => {
  return new Promise((resolve, reject) => {
    try {
      wx.getLocation({
        type,
        isHighAccuracy: true,
        success: res => {
          if(getName) {
            wx.request({
              url: config.map.regeo, // `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_KEY}`
              data: {
                output: "json",
                location: `${res.longitude},${res.latitude}`,
                radius: "1000",
                extensions: "all",
                roadlevel: "0",
                batch: true,
              },
              success: (res2) => {
                if (res2.data && res2.data.regeocodes) {
                  resolve({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    name: res2.data.regeocodes[0].formatted_address
                  })
                } else {
                  resolve({longitude: res.longitude, latitude: res.latitude, name: '当前位置'});
                }
              },
              fail: err => {
                resolve({longitude: res.longitude, latitude: res.latitude, name: '当前位置'});
              }
            });
          } else {
            resolve({longitude: res.longitude, latitude: res.latitude})
          }
        },
        fail: err => {
          resolve(null);
        }
      })
    } catch(e) {}
  })
}

module.exports = {
  storage,
  showEndBusy,
  throttle,
  debounce,
  getCenter,
  getLocation
}
