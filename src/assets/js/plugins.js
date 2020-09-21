import Vue from 'vue'

// 防止多次点击提交事件  只有点击的是按钮的时候才有节流的效果
const preventReClick = Vue.directive('preventReClick', {
    inserted: function (el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 3000)
            }
        })
    }
});



export { preventReClick }
