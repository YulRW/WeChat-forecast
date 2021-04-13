Page({
    data: {
        
    },
    share(){
        wx.showShareMenu({
            success:res=>{
                
            }
        });
    },
    onShareAppMessage(){

    },
    showToast(){
        wx.showToast({
            title: '饼',
            icon: 'none',
        })
    },
})