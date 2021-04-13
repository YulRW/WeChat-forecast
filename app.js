//app.js

// 引入Promise
const yy = require('./utils/Promise.js');

App({
    onLaunch: function() {
        this.userLogin();

    },
    userLogin() {
        wx.showLoading({
            title: '正在登陆...',
            mask: true
        })
        yy.login({

            })
            .then(res => {
                let loginURL = this.globalData.ip + this.globalData.request.login
                return yy.request({
                    url: loginURL,
                    method: 'post',
                    data: {
                        code: res.code
                    }
                })
            })
            .then(res => {
                this.globalData.userData = res.data.data
                wx.hideLoading()
            })
    },
    globalData: {
        userData: null,
        userInfo: null,
        ip: 'https://www.lizeqiang.top:8889',
        request: {
            login: '/user/login', //登录
            submitTestQuestionnaire: '/user/submitTestQuestionnaire', //训练
            submitForecastQuestionnaire: '/user/submitForecastQuestionnaire', //预测
            getQuestion: '/user/listQuestion', //获取问卷列表

        }
    },
    yy,


})