export default function User(){
    // Данные пользователя Kalk.Pro - window.KalkPro.user.data
    // let getKalkProUser = function(){
    //     if(!window.KalkPro){
    //         return null;
    //     }

    //     if(!window.KalkPro.user){
    //         return null;
    //     }

    //     if(!window.KalkPro.user.data){
    //         return null;
    //     }

    //     if(!window.KalkPro.user.data.props){
    //         return null;
    //     }

    //     var userProps = window.KalkPro.user.data.props;

    //     // var author = userProps.caption_drawings || 'Kalk.Pro',
    //     // var logoUrl = userProps.logo_drawings || 'https://static-1.kalk.pro/images-uploaded/logo/2189545813/124247a1d31f22b24751d82aa866eb47/320_240.png'

    //     return {
    //         name: userProps.caption_drawings || 'Kalk.Pro',
    //         logoUrl: userProps.logo_drawings || '/assets/images/kalk.pro.png'
    //     };
    // };

    this.user = {};
    
    // Наличие доступа к расширенным возможностям Просмотрщика
    this.user.subscribed = this.user.subscribed || true;
    // this.user.subscribed = window.KalkPro.globals.isSubscribed || true;
    
    // Формат четрежей (зависит от подписки Умелец - PNG или Профи - SVG)
    this.user.drwFormat = 'svg';

    // Имя пользователя и логотип
    // var userData = getKalkProUser();
    var userData = {};  // Для 'Kingspan ISOESTE'
    
    this.user.name = userData.name ? userData.name : 'Kingspan ISOESTE';
    this.user.logo = {};
    this.user.logo.url = userData.logoUrl ? userData.logoUrl : '/assets/images/kingspan-isoeste.jpg';

    // Назавние калькулятора из текущего расчета
    this.calcName = '';

    // Параметры логотипа
    var loadImg = function(url, callback){
        var image = new Image();
        image.setAttribute('crossOrigin', 'anonymous'); //getting images from external domain
       
        image.onload = function () {
            // Определим расширения файла с изображеним логотипа
            var imgExt = this.src.match(/\.(\w{3,4})$/)[1];

             // Растровые изображения (вектор автоматов в PNG)
            if(['svg', 'png', 'jpg', 'jpeg'].indexOf(imgExt) > -1){
                var canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight; 
    
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
    
                canvas.getContext('2d').drawImage(this, 0, 0);
    
                callback({
                    b64: canvas.toDataURL((imgExt !== 'svg') ? 'image/' + imgExt : ''),
                    ext: imgExt,
                    width: canvas.width,
                    height: canvas.height
                });

                canvas = null;
            }
        };

        image.src = url; 
        image = null;
    };

    // Получим представление логотипа в base64
    var self = this;
    loadImg(self.user.logo.url, function(res){
        self.user.logo.b64 = res.b64;
        self.user.logo.ext = res.ext;
        self.user.logo.width = res.width;
        self.user.logo.height = res.height;
    });

    return this.user;
}
