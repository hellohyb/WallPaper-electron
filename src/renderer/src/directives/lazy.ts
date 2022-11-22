import load from '../assets/img/load.gif'
export default{
    mounted(el){
        const imgUrl = el.src
        //把含有v-lazy的元素的图片地址设置为空，也可以自定义图片
        el.src = load
        //观察者
        const observer = new IntersectionObserver(([{isIntersecting}]) => {
        //   判断元素是否出现和离开可视区域
            if(isIntersecting){
                //加载图片
                el.src = imgUrl
                //加载完停止观察
                observer.unobserve(el)
            }
        })
        //调用观察者
        observer.observe(el);
    }
}