/** 使用第三方地图逆地址解析经纬度获取用户当前所在位置信息
 * @param {Number} lat
 * @param {Number} lng
 */
 
export const getUserCurrentLocationInfo = (lat, lng) => {
    var GDMapWX = require('../assets/GD/amap-wx.130.js');
    var GDMapSdk = new GDMapWX.AMapWX({
        key: '54077752f4d1d6c01305719008a54953' // 必填
    });
    return new Promise((resolve, reject) => {
        GDMapSdk.getRegeo({
            location: lng + ',' + lat,
            success: res => {
                if (res && res.length > 0) {
                    resolve(res); // 确保返回的结果是一个数组
                } else {
                    reject('No data returned');
                }
            },
            fail: function(error) {
                reject(error);
            }
        });
    });
}