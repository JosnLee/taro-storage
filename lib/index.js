'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ENV_TYPE = process.env.TARO_ENV;
var globalData = {};

var storage = {
    // 获取会话内存储的值
    getSessionStorage: function getSessionStorage(key) {
        try {
            if (ENV_TYPE === 'h5') {
                // 对象方式获取值
                return JSON.parse(sessionStorage.getItem(key)).data;
            } else {
                //小程序需要写入全局变量
                return globalData[key];
            }
        } catch (err) {
            return null;
        }
    },

    // 写入会话内缓存
    setSessionStorage: function setSessionStorage(key, value) {
        var tmpData = { data: value };
        try {
            if (ENV_TYPE === 'h5') {
                sessionStorage.setItem(key, JSON.stringify(tmpData));
            } else {
                globalData[key] = tmpData.data;
            }
            return true;
        } catch (err) {
            return false;
        }
    },

    // 移除会话内的单个存储
    removeSessionStorage: function removeSessionStorage(key) {
        try {
            if (ENV_TYPE === 'h5') {
                // 对象方式获取值
                return sessionStorage.removeItem(key);
            } else {
                //小程序需要写入全局变量
                return delete globalData[key];
            }
        } catch (err) {
            return null;
        }
    },

    //本地永久存储写入有效期，有效期内会取出来，失效后会清空
    setLocalStorage: function setLocalStorage(key, value, exp) {
        var tmpData = { data: value, exp: exp, startTime: new Date().getTime() };
        if (ENV_TYPE === 'h5') {
            // 对象方式获取值
            localStorage.setItem(key, JSON.stringify(tmpData));
        } else {
            //小程序需要写入全局变量
            wx.setStorageSync(key, tmpData);
        }
    },

    // 处理数据本地数据缓存返回
    handleLocalDataBack: function handleLocalDataBack(tmpData, key) {
        var returnData = null;
        var date = new Date().getTime();
        // 如果有设置过期时间
        if (tmpData && tmpData.exp) {
            if (date - tmpData.startTime > tmpData.exp) {
                //缓存过期，清除缓存，返回false
                ENV_TYPE === 'h5' ? localStorage.removeItem(key) : wx.removeStorageSync(key);
                returnData = null;
            } else {
                //缓存未过期，返回值
                returnData = tmpData.data;
            }
        } else {
            returnData = tmpData;
        }
        return returnData;
    },

    // 移除所有的h5过期的本地缓存
    removeAllH5Exp: function removeAllH5Exp() {
        var localItemsLength = localStorage.length;
        var that = this;
        for (var index = 0; index < localItemsLength; index++) {
            var key = localStorage.key(index);
            that.handleLocalDataBack(JSON.parse(localStorage.getItem(key)), key);
        }
    },

    // 移除所有的wx-mini过期的本地缓存
    removeAllWxMiniExp: function removeAllWxMiniExp() {
        var that = this;
        wx.getStorageInfo({
            success: function success(res) {
                var keys = res.keys;
                keys.forEach(function (key) {
                    that.handleLocalDataBack(wx.getStorageSync(key), key);
                });
            }
        });
    },

    // 移除所有的本地存储
    removeAllLocal: function removeAllLocal() {
        if (ENV_TYPE === 'h5') {
            localStorage.clear();
        } else {
            wx.clearStorageSync();
        }
    },

    // 移除本地所有的过期的缓存
    removeAllLocalExp: function removeAllLocalExp() {
        if (ENV_TYPE === 'h5') {
            this.removeAllH5Exp();
        } else {
            this.removeAllWxMiniExp();
        }
    },

    //本地取出存储的值
    getLocalStorage: function getLocalStorage(key) {
        var tmpData = null;
        if (ENV_TYPE === 'h5') {
            // 对象方式获取值
            tmpData = JSON.parse(localStorage.getItem(key) || '{}').data;
            return this.handleLocalDataBack(tmpData, key);
        } else {
            //小程序需要写入全局变量
            tmpData = wx.getStorageSync(key) ? wx.getStorageSync(key).data : null;
            return this.handleLocalDataBack(tmpData, key);
        }
    },

    //本地删除存储
    removeLocalStorage: function removeLocalStorage(key) {
        if (ENV_TYPE === 'h5') {
            // 对象方式获取值
            localStorage.removeItem(key);
        } else {
            //小程序需要写入全局变量
            wx.removeStorageSync(key);
        }
    }
};

exports.default = storage;