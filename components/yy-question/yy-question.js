// components/yy-question/yy-question.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        question:{
            type:Array,
            observer:function(newVal,oldVal){
                this.setData({
                    questionData:newVal
                })
            },
        }

    },

    /**
     * 组件的初始数据
     */
    data: {
        

        // 当前问题
        index: 0,

        // 用户选择集合
        answer: [],

        //弹出框状态
        showAllQuestion: false,

        //问题卡动画
        questionShowAnimate: ''

    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleAllQuestion() {
            this.setData({
                showAllQuestion: !this.data.showAllQuestion
            })
        },

        //动画结束
        animateEnd() {
            this.setData({
                questionShowAnimate: ''
            })
        },

        // 单选选项
        selectChange(e) {
            setTimeout(() => {
                // let answerIndex = `answer[${this.data.index}]`
                // this.setData({
                //     [answerIndex]: e.detail.value
                // })
                let answerIndex = this.data.answer;
                answerIndex[this.data.index] = e.detail.value
                this.setData({
                    answer: answerIndex
                })

                if (this.data.questionData.length - 1 === this.data.index) {

                } else {
                    this.changeIndex(this.data.index + 1)
                }

            }, 200)

        },

        // 切换卡函数（包含动画）
        changeIndex(index) {
            this.animateEnd();
            this.setData({
                index: index,
                questionShowAnimate: 'flipInX'
            })
        },

        next() {
            this.changeIndex(this.data.index + 1)
        },

        pre() {
            this.changeIndex(this.data.index - 1)
        },

        selectQuestion(e) {
            let index = e.currentTarget.dataset.id
            this.changeIndex(index)
            this.handleAllQuestion()
        },

        // 提交——》触发外部函数
        submit() {
            this.triggerEvent('submit',{},{});
        },

    },
    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
            let len = this.data.questionData.length;
            let answer = new Array(len);

            for (let i = 0; i < len; i++) {
                answer[i] = -1
            }
            console.log(answer)

            this.setData({
                answer: answer
            })
        },

    },
})