import FramePdf from './../../pdf/FramePdf';

// TODO: Lazy loading
import * as THREE from "three";
const CalcScene3D = require('./CalcScene3D')(THREE);


export default function Scene3DView(){
};

require('../WinViewModal')(Scene3DView);

Scene3DView.prototype.init = function(ops){
    /** Список доступных входных параметров */
    this.i18n = ops.i18n;
    this.user = ops.user;
    this.winWrapId = ops.winWrapId;
    this.uniqIdMod = ops.uniqIdMod || Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
    
    // Наличие доступа к расширенным возможностям Просмотрщика
    this.user.subscribed = this.user.subscribed || true;
    // this.user.subscribed = window.KalkPro.globals.isSubscribed || true;

     // Назавние калькулятора из текущего расчета
     this.calcName = '';


    /** Валидация входных данных */
    if(!(this.winWrapId && document.getElementById(this.winWrapId))){
        console.warn('Wrapper for 3D Editor window is not found.');
        return;
    }


    /** ОБЯЗАТЕЛЬНО: Идентификаторы элементов окна */
    this.winId = 'js--win3d-' + this.uniqIdMod;
    this.bodyId = 'js--win3d-body-' + this.uniqIdMod;
    this.splashId = 'js--win3d-splash-' + this.uniqIdMod;
    this.rulerId = 'js--win3d-ruler-' + this.uniqIdMod;

    this.screenId = 'js--win3d-screen-' + this.uniqIdMod;
    this.videoId = 'js--win3d-video-' + this.uniqIdMod;
    this.canvasId = 'js--win3d-canvas-' + this.uniqIdMod;
    this.toolbarId = 'js--win3d-toolbar-' + this.uniqIdMod;
    this.menuId = 'js--win3d-menu-' + this.uniqIdMod;
    this.menuContainerId = 'js--win3d-menu-сontainer-' + this.uniqIdMod;


    /** Avaliable class data */
    this.tools = null;


    /** Создаем исходный HTML для интерфейса */
    this.createWinHtml();

};


Scene3DView.prototype.createWinHtml = function(){
    var html = null;

    /** Создадим шаблон будущего просмотрщика 3D */
    html = 
        `<div id="` + this.winId + `" class="__xr-win3d">
            <div id="` + this.toolbarId + `" class="__xr-win3d-toolbar"></div>
            <div id="` + this.bodyId + `" class="__xr-win3d-body">
                <div class="__xr-win3d-body-cols">
                    <div id="` + this.menuId + `" class="__xr-win3d-menu">
                        <div id="` + this.menuContainerId + `"  class="__xr-win3d-menu-container"></div>
                        <div class="__xr-win3d-menu-btn"></div>
                    </div>
                    <div id="` + this.screenId + `" class="__xr-win3d-screen">
                        <div id="` + this.rulerId + `" class="__xr-win3d-ruler" style="display:none"></div>
                        <div id="` + this.splashId + `" class="__xr-win3d-splash-screen"></div>
                        <video id="` + this.videoId + `" class="__xr-win3d-video"></video>
                        <canvas id="` + this.canvasId + `" class="__xr-win3d-canvas"></canvas>
                    </div>
                </div>
            </div>
        </div>`
    ;
    document.getElementById(this.winWrapId).innerHTML = html;



    /** ОБЯЗАТЕЛЬНО: Инициализируем доступ к элементам управления просмотрщика */
    this.nodes = {
        canvas: document.getElementById(this.canvasId),
        video: document.getElementById(this.videoId),
        ruler: document.getElementById(this.rulerId),
        splash: document.getElementById(this.splashId),
        screen: document.getElementById(this.screenId),
        toolbar: document.getElementById(this.toolbarId),
        menu: document.getElementById(this.menuId),
        menuContainer: document.getElementById(this.menuContainerId),
        menuBtn: document.getElementById(this.menuId).getElementsByClassName('__xr-win3d-menu-btn')[0],
        win: document.getElementById(this.winId),
        body: document.getElementById(this.bodyId)
    };

    /** СЦЕНА 3D*/
    this.calcScene3D = new CalcScene3D({
        nodes: this.nodes,
        bgImageLink: !this.user.subscribed ? 'https://kalk-pro.ru/public/images/textures/kalk.pro-spaced-logo-op04.png' : undefined,
        refreshCallback: this.__refreshSceneCallback.bind(this)
    });
    


    // Создать функционал всплывающих окон
    this.modalInc = new Scene3DView.Modal({i18n: this.i18n, nodes: this.nodes, uniqIdMod: this.uniqIdMod});

    // Создать панель инструментов и добавить в нее кнопки
    this.toolbarInc = new Scene3DView.Toolbar({
        i18n: this.i18n,
        nodes: this.nodes,
        calcScene3D: this.calcScene3D,
        modal: this.modalInc,
        uniqIdMod: this.uniqIdMod,

        user: this.user
    });  // Передадим в класс все доступное от родителя
    this.toolbarInc.addTools();

    // Создать панель меню
    this.menuInc = new Scene3DView.Menu({
            i18n: this.i18n,
            nodes: this.nodes,
            calcScene3D: this.calcScene3D,
            uniqIdMod: this.uniqIdMod,
        
            getCalcName: this.__getCalcName.bind(this)
        });

    // // Создать панель линейки с выводом размера
    // this.rulerInc = new Scene3DView.Ruler({
    //     i18n: this.i18n,
    //     nodes: this.nodes,
    //     modal: this.modalInc,
    //     uniqIdMod: this.uniqIdMod,

    //     user: this.user
    // });


    /** СОБЫТИЕ: Убираем экран заставку */
    var splash = document.getElementById(this.splashId);
    splash.addEventListener('click', function(){
        splash.removeEventListener('click', function(){});
        splash.remove();
    });

}

Scene3DView.prototype.__getCalcName = function(){
    return this.calcName;
}

/**
 * Сцена 3D обновилась, можно забирать данные об объектах
 */
Scene3DView.prototype.__refreshSceneCallback = function(data){
    // Обновлять Меню, только если это новые данные (с сервера)
    // При обновлении состояния, где инициатор само меню, обновлять само Меню не нужно.
    if(data.type === 'new'){
        this.menuInc.refresh(data);
    }
}

/**
 * Обновить сцену в соответсвии с новыми данными, полученными от сервера
 */
Scene3DView.prototype.updateScene = function(data, calcName){
    // Инициализируем сцену на Canvas (если это не произошло ранее)
    if(!this.viewerScene){
        this.viewerScene = new Scene3DView.Scene({
            i18n: this.i18n,
            calcScene3D: this.calcScene3D,
            nodes: this.nodes,
            uniqIdMod: this.uniqIdMod
        });
    }
    // Обновим состояние сцены
    this.calcName = calcName;
    this.viewerScene.refresh(data);
}


/**************************************** 
 *  
 * A P I
 * 
 *  */
/**
 * Получить данные с изображением сцены для API
 */
Scene3DView.prototype.apiGetScreenData = function(){
    return this.toolbarInc.getScreenData();
}

/**
 * Получить материал кровли, который был выбран
 */
Scene3DView.prototype.apiGetSelectetRoofMaterial = function(){
    return this.state;
}

/**
 * Получить указанный цвет материала кровли
 */
 Scene3DView.prototype.apiGetSelectedTexture = function(materialName){
    var selectedTextures = document.getElementsByClassName('__xr-win3d-menu-item-sub-texture-selected');
    
    let textureTitle = '';
    Array.prototype.forEach.call(selectedTextures, selectedTexture => {
        if(selectedTexture.dataset){
            if(selectedTexture.dataset.name === materialName){
                textureTitle = selectedTexture.dataset.title;
            }
        }
    });
   
    
    return textureTitle;
}


/**************************************** 
 * ИНСТРУМЕНТЫ
 * 
 * Абстракция отвечающая за панель инструментов наверху
 * 
 * 
 * 
 *  */
Scene3DView.Toolbar = function(ops){
    /** Список доступных входных параметров */
    this.i18n = ops.i18n;
    this.nodes = ops.nodes;
    this.calcScene3D = ops.calcScene3D;
    this.user = ops.user;
    this.modal = ops.modal;
    this.uniqIdMod = ops.uniqIdMod || Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));


    /** Кнопки в панеле инструментов */
    this.tools = {
        sizes: {
            zoomIn: {
                title: this.i18n.tr('3d-viewer.toolbar-btn-zoom-in'),
                class: 'zoom-in'
            },
            zoomOut: {
                title: this.i18n.tr('3d-viewer.toolbar-btn-zoom-out'),
                class: 'zoom-out'
            },
            // ruler: {
            //     title: this.i18n.tr('3d-viewer.toolbar-btn-ruler'),
            //     class: 'ruler'
            // }
        },
        files: {
            screenShot: {
                title: this.i18n.tr('3d-viewer.toolbar-btn-screenshot'),
                class: 'scr-shot'
            },
            download: {
                title: this.i18n.tr('3d-viewer.toolbar-btn-download-files'),
                class: 'down'
            }
        },
        moving: {
            sceneRotate: {
                title: this.i18n.tr('3d-viewer.toolbar-btn-scene-rotate'),
                class: 'scn-rot',
                active: true
            },
            sceneMove: {
                title: this.i18n.tr('3d-viewer.toolbar-btn-scene-move'),
                class: 'scn-mov'
            }
        },
        // augmentedReality:{
        //     ar: {
        //         title: this.i18n.tr('3d-viewer.toolbar-btn-ar'),
        //         class: 'ar'
        //     },
        //     perInc: {
        //         title: this.i18n.tr('3d-viewer.toolbar-btn-perspective-inc'),
        //         class: 'per-inc'
        //     },
        //     perDec: {
        //         title: this.i18n.tr('3d-viewer.toolbar-btn-perspective-dec'),
        //         class: 'per-dec'
        //     },
        //     perRes: {
        //         title: this.i18n.tr('3d-viewer.toolbar-btn-perspective-res'),
        //         class: 'per-res'
        //     }
        // },
        display: {
            fullScreen: {
                title: this.i18n.tr('3d-viewer.toolbar-btn-fullscreen'),
                class: 'full-scr'
            }
        }
        ,
        help: {
            about: {
                title: this.i18n.tr('3d-viewer.toolbar-btn-about'),
                class: 'about'
            }
        }
    };

    /** Обработчик нажатий на кнопки в панеле иснтрументов */
    this.__eventListener();
}


/**
 * Получить данные с изображением сцены
 */
 Scene3DView.Toolbar.prototype.getScreenData = function(){
    if(this.videoStream){
        // Если есть активный видео-поток - активирован режим AR
        return this.calcScene3D.sceneScreenShot(this.nodes.video);
    }
    else {
        // Просто изображение
        return this.calcScene3D.sceneScreenShot(null);
    }
}


/*****************************************
 *  СОБЫТИЯ
 ****************************************/
/**
 * Private: Приблизить/Увеличить
 */
Scene3DView.Toolbar.prototype.__eventZoomIn = function(){
    this.calcScene3D.zoomIn();
}

/**
 * Private: Удалиться/Уменьшить
 */
Scene3DView.Toolbar.prototype.__eventZoomOut = function(){
    this.calcScene3D.zoomOut();
}

/**
 * Private: Включить линейку
 */
Scene3DView.Toolbar.prototype.__eventRuler = function(elem){
    if(!this.user.subscribed){
        this.modal.subscribe();
        return false;
    }

    var activeClassName = '__xr-win3d-toolbar-btn-active';

    // Зададим активность состояния для кнопки
    elem.classList.toggle(activeClassName);

    var isRulerActive = !!(new RegExp('(\\s|^)' + activeClassName + '(\\s|$)').test(elem.className));
    if(isRulerActive){
        this.calcScene3D.ruler.__keyShiftPressed();
    }
    else {
        this.calcScene3D.ruler.__keyShiftUp();
    }
    

}

/**
 * Private: Скачать файл сцены
 */
Scene3DView.Toolbar.prototype.__eventDownload = function(){
    var self = this;
    
    /** Покажем модальное окно если у пользователя нет подписки */
    if(!this.user.subscribed){
        this.modal.subscribe();
        return false;
    }


    var classDownloadVarians = '__xr-win3d-modal-dowload-var';
    var htmlContent = `
        <div style="margin: 30px auto; width: 120px;">
            
            <div style="margin-bottom: 30px">
                <div class="__xr-win2d-modal-download-item">
                    <input type="checkbox" id="js--win3d-modal-dowload-obj" class="${classDownloadVarians}" name="obj" checked/>
                    <label for="js--win3d-modal-dowload-obj">OBJ</label>
                </div>

                <div class="__xr-win2d-modal-download-item">
                    <input type="checkbox" id="js--win3d-modal-dowload-gltf" class="${classDownloadVarians}" name="gltf"/>
                    <label for="js--win3d-modal-dowload-gltf">GLTF/GLB</label>
                </div>

                <div class="__xr-win2d-modal-download-item">
                    <input type="checkbox" id="js--win3d-modal-dowload-dae" class="${classDownloadVarians}" name="dae"/>
                    <label for="js--win3d-modal-dowload-dae">DAE</label>
                </div>
            </div>
        </div>
    `;


    // Функция для получения списка форматов в которых нужно скачать 3D сцену
    var getDownloadFormats = function(){
        // var elems = document.getElementsByClassName(classDownloadVarians);
        // for(var i = 0, len = elems.length; i < len; i++){}
        return Array.from(document.getElementsByClassName(classDownloadVarians)).map(function(elem){
            return elem.checked ? elem.getAttribute('name') : null;
        }).filter(elem => elem !== null);
    };


    /** Покажем модальное окно и настроим действия на совершение нажатия кнопок */
    this.modal.show({
        title: this.i18n.tr('modal.title-download'),
        content: htmlContent,
        btnAccept: {
            html: this.i18n.tr('modal.button-download'),
            callback: function(){
                // Получим список форматов для сохранения
                const formats = getDownloadFormats();
                if(formats.length){
                    // Запрос на сохранение файлов в выбранных форматах
                    self.calcScene3D.download(formats);

                    // Закрыть окно
                    self.modal.hide();
                }
            }
        }
    });
}

/**
 * Private: Левая кнопка мыши вращает сцену
 */
Scene3DView.Toolbar.prototype.__eventSceneRotate = function(elem){
    var activeClassName = '__xr-win3d-toolbar-btn-active';

    // Проверим, может быть кнопка уже активна, тогда ничего не делаем
    var isBtnActive = !!(new RegExp('(\\s|^)' + activeClassName + '(\\s|$)').test(elem.className));
    if(isBtnActive){
        return false;
    }

    elem.classList.add(activeClassName);

    // Уберем активность зависимой кнопки
    document.getElementsByClassName('__xr-win3d-toolbar-btn-scn-mov')[0].classList.remove(activeClassName);

    // Переключим режим работы кнопок мыши и прикосновений
    this.calcScene3D.navigationPriorityCombination('rotate');
}

/**
 * Private: Левая кнопка мыши двигает сцену
 */
 Scene3DView.Toolbar.prototype.__eventSceneMove = function(elem){
    var activeClassName = '__xr-win3d-toolbar-btn-active';

    // Проверим, может быть кнопка уже активна, тогда ничего не делаем
    var isBtnActive = !!(new RegExp('(\\s|^)' + activeClassName + '(\\s|$)').test(elem.className));
    if(isBtnActive){
        return false;
    }

    elem.classList.add(activeClassName);

    // Уберем активность зависимой кнопки
    document.getElementsByClassName('__xr-win3d-toolbar-btn-scn-rot')[0].classList.remove(activeClassName);

     // Переключим режим работы кнопок мыши и прикосновений
     this.calcScene3D.navigationPriorityCombination('move');
}


/**
 * Private: Переход в режим дополненной реальности
 * 
 * Делаем фон сцены прозрачным, а на задний план выводим изображение с камеры смартфона или планшета,
 * или с любой другой доступной камеры устройства
 * 
 */
 Scene3DView.Toolbar.prototype.__eventAr = function(elem){
    // /** Покажем модальное окно если у пользователя нет подписки */
    // if(!this.user.subscribed){
    //     this.modal.subscribe();
    //     return false;
    // }

    // Элекмент Экрана для видео
    var elemVideo = this.nodes.video;

    // Класса активности кнопки
    var activeClassName = '__xr-win3d-toolbar-btn-active';

    // Функция будет менять состояние кнопок Панели управления и Экрна для трансляции видео
    var changeViewerSate = function(){
        // Зададим активность состояния для кнопки
        elem.classList.toggle(activeClassName);

        // Развернем блок для просмотра видео
        elemVideo.classList.toggle('__xr-win3d-video-active');
    };    

    // Функция для завершения всех активных потоков с видео устройств
    var stopMediaTracks = function(stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
    };
    
    var isActive = !!(new RegExp('(\\s|^)' + activeClassName + '(\\s|$)').test(elem.className));
    if(isActive){
        // Отключаем потоковое видео
        if(typeof this.videoStream !== 'undefined'){
            stopMediaTracks(this.videoStream);
        }

        // Отменяем прозрачность сцены
        this.calcScene3D.sceneAlphaControl(1.0);

        // Изменим состояние интерфейса
        changeViewerSate();
    }
    else {
        // Активировать потоковое видео, если есть поддержка устройтва
        var self = this;
        self.cameraId = null;

        const getVideoDevices = function(mediaDevices) {
            return new Promise((resolve, reject) => {
               
                // Получим список доступных видео-устройств
                var videoDevices = {};
                mediaDevices.forEach(mediaDevice => {
                    if (mediaDevice.kind === 'videoinput') {
                        // videoDevices.push(mediaDevice.deviceId);
                        videoDevices[mediaDevice.deviceId] = {
                            facingMode: 'environment',
                            title: 'Main'
                        };

                        // Определим направление камеры
                        if(mediaDevice.label && mediaDevice.label.length > 0){
                            if(mediaDevice.label.toLowerCase().indexOf('back') > -1){
                                videoDevices[mediaDevice.deviceId].facingMode = 'environment';
                                videoDevices[mediaDevice.deviceId].title = 'Main';
                            }
                            else if(mediaDevice.label.toLowerCase().indexOf('front') > -1){
                                videoDevices[mediaDevice.deviceId].facingMode = 'user';
                                videoDevices[mediaDevice.deviceId].title = 'Front';
                            }
                            else if(mediaDevice.label.toLowerCase().indexOf('left') > -1){
                                videoDevices[mediaDevice.deviceId].facingMode = 'left';
                                videoDevices[mediaDevice.deviceId].title = 'Front left';
                            }
                            else if(mediaDevice.label.toLowerCase().indexOf('right') > -1){
                                videoDevices[mediaDevice.deviceId].facingMode = 'right';
                                videoDevices[mediaDevice.deviceId].title = 'Front right';
                            }
                        }

                    }
                });

                // Если не найдены камеры на устройстве
                var videoDevicesIds = Object.keys(videoDevices);
                if(!videoDevicesIds.length){
                    self.modal.show({
                        title: self.i18n.tr('modal.title-error'),
                        content: self.i18n.tr('modal.content-camera-error-not-found')
                    });

                    reject(null);
                }

                // Сформируем модальное окно с выбором камеры, которую нужно активировать
                var videoInputClass = '__xr-win3d-modal-video-input';
                var devicesHtml = '';
                for(var i = 0, len = videoDevicesIds.length; i < len; i++){
                    var videoDeviceId = videoDevicesIds[i];

                    devicesHtml += 
                        `<div style="margin-bottom: 30px">
                            <div>
                                <input type="radio" id="js--win3d-modal-video-${videoDeviceId}" class="${videoInputClass}" name="video-input" value="${videoDeviceId}" ${(i === 0) ? 'checked' : ''}>
                                <label for="js--win3d-modal-video-${videoDeviceId}">${self.i18n.tr('3d-viewer.toolbar-label-camera')} #${i + 1} - ${videoDevices[videoDeviceId].title}</label>
                            </div>
                        </div>`;
                }
                
                var htmlContent = 
                    `<div style="margin: 30px auto; width: 200px;">` +
                        devicesHtml +
                    `</div>`;


                // Функция для получения идентификатора выбранной камеры
                var getSelectedCameraId = function(){
                    var checked = Array.from(document.getElementsByClassName(videoInputClass)).map(function(elem){
                        return elem.checked ? elem.value : null;
                    }).filter(elem => elem !== null);

                    return checked.length ? checked[0] : null;
                };

                // Модальное окно с предложением выбора камеры из списка доступных
                self.modal.show({
                    title: self.i18n.tr('modal.title-select-video-input'),
                    content: htmlContent,
                    btnAccept: {
                        html: self.i18n.tr('modal.button-accept'),
                        callback: function(){
                            // Идентификатор камеры
                            var cameraId = getSelectedCameraId();

                            // Закроем окно
                            self.modal.hide();

                            // Вернем идентификатор камеры
                            resolve(cameraId);
                        }
                    }
                });

            });
        };


        

        /** ВЫБОР КАМЕРЫ */
        // Определим список доступных устройств
        navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
        /*********************************************************************************/   

            // Проверка наличия списка камер
            getVideoDevices(mediaDevices).then(selectedCameraId => {

                // Настройки выбранного медиа устройства
                const constraints = {
                    video: {
                        deviceId: { 
                            exact: selectedCameraId
                        }
                    },
                    audio: false
                };

                /** ВКЛЮЧАЕМ ВЫБРАННУЮ КАМЕРУ */
                // Если был какой-то активный видео-поток - отключим
                if (typeof self.videoStream !== 'undefined') {
                    stopMediaTracks(self.videoStream);
                }

                // Выбранная
                navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                    self.videoStream = stream;
                    let videoSettings = self.videoStream.getVideoTracks()[0].getSettings();
                    //console.log("videoSettings: width=%d, height=%d, frameRate=%d", videoSettings.width, videoSettings.height, videoSettings.frameRate);
        
        
        
                    //Making a separate pure video stream is a workaround
                    //let videoStream = new MediaStream(stream.getVideoTracks());
                    let video = self.nodes.video;
                    Object.assign(video, {
                        srcObject: self.videoStream,//videoStream,
                        width: videoSettings.width,
                        height: videoSettings.height,
                        autoplay: true,
                        //Setting muted here breaks everything
                        //muted: true,
                    });
        
                    self.calcScene3D.sceneAlphaControl(0.0);

                    // Изменим состояние интерфейса
                    changeViewerSate();
            
                }).catch(error => {
                    // Модальное окно с сообщением об ошибке
                    self.modal.show({
                        title: this.i18n.tr('modal.title-error'),
                        content: this.i18n.tr('modal.content-camera-error-exception'),
                    });
                });

            }).catch(error => {
                // Модальное окно с сообщением об ошибке
                self.modal.show({
                    title: this.i18n.tr('modal.title-error'),
                    content: this.i18n.tr('modal.content-camera-error-enumerate-cameras'),
                });
            });

        /*********************************************************************************/
        }).catch(error => {
            // Модальное окно с сообщением об ошибке
            self.modal.show({
                title: this.i18n.tr('modal.title-error'),
                content: this.i18n.tr('modal.content-camera-error-enumerate-media-devices'),
            });
        });
    }
}


/**
 * Увеличить перспективу камеры
 * 
 */
Scene3DView.Toolbar.prototype.__eventPerInc = function(elem){
    this.calcScene3D.PerspectiveChange(1);
}

/**
 * Уменьшить перспективу камеры
 * 
 */
Scene3DView.Toolbar.prototype.__eventPerDec = function(elem){
    this.calcScene3D.PerspectiveChange(-1);
}


/**
 * Сбросить перспективу камеры в исходное состояние
 * 
 */
Scene3DView.Toolbar.prototype.__eventPerRes = function(){
    this.calcScene3D.PerspectiveReset();
}



/**
 * Private: Переход в полноэкранный режим
 */
Scene3DView.Toolbar.prototype.__eventFullScreen = function(elem){
    var fullScreenClassName = '__xr-win3d-fullscreen';
    var activeClassName = '__xr-win3d-toolbar-btn-active';

    // Зададим активность состояния для кнопки
    elem.classList.toggle(activeClassName);


    // Зафиксируем размер подложки (высоту) перед переходом в полноэкранный режим, чтобы не дергался
    // скролл при смене режимов
    var isFullScreenActive = !!(new RegExp('(\\s|^)' + activeClassName + '(\\s|$)').test(elem.className));
    
    if(isFullScreenActive === true) {
        this.nodes.win.parentElement.style.height = this.nodes.win.getBoundingClientRect().height + 'px';   // зафиксируем исходный размер окна
        document.getElementsByTagName('body')[0].style.overflowY = 'hidden';

        // Переведм окно в полноэкранный режим или обратно
        this.nodes.win.classList.toggle(fullScreenClassName);


        /** Актаулизируем размеры внуренних элементов окна */
        var winHeight = this.nodes.win.getBoundingClientRect().height;
        var toolbarHeight = this.nodes.toolbar.getBoundingClientRect().height;

        // Установим размер тела окна
        this.nodes.body.style.height = (winHeight - toolbarHeight) + 'px';
    }
    else {
        document.getElementsByTagName('body')[0].style.overflowY = 'auto';

        // Переведм окно в полноэкранный режим или обратно
        this.nodes.win.classList.toggle(fullScreenClassName);

        this.nodes.body.style.height = 'auto';
    }



    /**
     * СОБЫТИЕ: сообщим всему документу об изменении размеров экрана для просмотра 3D
     */
    var self = this;
    self.nodes.canvas.style.display = 'none';
    document.dispatchEvent(new CustomEvent('win3d-sceen-resize-' + self.uniqIdMod, { 
        detail: { 
            elem: self.nodes.screen,
            sizes: self.nodes.screen.getBoundingClientRect()
        }
    }));
    self.nodes.canvas.style.display = 'block';
}


/**
 * Private: Вызов справки
 */
Scene3DView.Toolbar.prototype.__eventAbout = function(elem){
    this.modal.show({
        title: this.i18n.tr('modal.title-about'),
        content: this.i18n.tr('modal.content-about')
    });
}


/**
 * Private: Сделать скриншот сцены
 */
 Scene3DView.Toolbar.prototype.__eventScreenShot = function(){
    var self = this;

    // Запрет на скриншоты для пользователей без подписки
    if(!this.user.subscribed){
        this.modal.subscribe();
        return false;
    }

    // Выбор варианта для создания скриншота
    var classDownloadVarians = '__xr-win2d-modal-download-var';
    var htmlContent = `
        <div style="margin: 30px auto; width: 100px;">
            
            <div style="margin-bottom: 30px">

                <div class="__xr-win2d-modal-download-item">
                    <input id="js--win2d-modal-dowload-pdf" type="radio" class="${classDownloadVarians}" value="pdf" name="file2d-type"/>
                    <label for="js--win2d-modal-dowload-pdf">${this.i18n.tr('3d-viewer.label-download-pdf')}</label>
                </div>

                <div class="__xr-win2d-modal-download-item">
                    <input id="js--win2d-modal-dowload-png" type="radio" class="${classDownloadVarians}" value="png" name="file2d-type" checked/>
                    <label for="js--win2d-modal-dowload-png">${this.i18n.tr('3d-viewer.label-download-png')}</label>
                </div>
              
            </div>
        </div>
    `;

    // Функция для получения списка форматов в которых нужно скачать 3D сцену
    var getDownloadFormat = function(){
        return Array.from(document.getElementsByClassName(classDownloadVarians)).map(function(elem){
            return elem.checked ? elem.value : null;
        }).filter(elem => elem !== null);
    };

    var modalErr = function(errMsg){
        self.modal.show({
            title: self.i18n.tr('modal.title-error-download'),
            content: `<p>${errMsg}</p>`
        })
    };

    /** Вспомогательные функции, используемые для сохранения **/
    var save = function(url, fileName) {
        var link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link); // Firefox workaround, see #6594

        link.setAttribute('href', url);
        link.setAttribute('target', '_blank');
        link.setAttribute('download', fileName);
        link.click();
        URL.revokeObjectURL(link.href); // breaks Firefox...
    };


    /** Покажем модальное окно и настроим действия на совершение нажатия кнопок */
    this.modal.show({
        title: this.i18n.tr('modal.title-3D-screenshot'),
        content: htmlContent,
        btnAccept: {
            html: this.i18n.tr('modal.button-screenshot'),
            callback: function(){
                // Имя файла
                const date = new Date(); // Or the date you'd like converted.
                const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                const fileName = 'screenshot_3d_' + isoDateTime.slice(0,19).replace(/(-|T|:)/g,"");

                // Получим список форматов для сохранения
                var format = getDownloadFormat();
                if(format.length){
                    var imgFormat = format[0];

                    // Закрыть окно
                    self.modal.hide();

                    /** Получим изображение сцены */
                    let screenData = self.getScreenData();

                    // Сохраним выбранный чертеж в выбранном формате
                    // PNG
                    if(imgFormat === 'png'){
                        save(screenData.b64, fileName + '.png');
                    }

                    // PDF
                    if(imgFormat === 'pdf'){
                        try {
                            // PDF Генератор
                            const pageWidth = 297, pageHeight = 210;
                            const pdfFormat = [pageWidth, pageHeight];
                            let pdfOrientation = 'landscape'; // portrait || landscape

                            const pdfFrame = new FramePdf({
                                orientation: pdfOrientation,
                                units: 'mm',
                                format: pdfFormat,

                                pageWidth: pageWidth,
                                pageHeight: pageHeight
                            });

                            // Рассчитаем оптимальную ориентацию для текущего чертежа
                            let scale = {
                                landscape: pdfFrame.getScaleFactor(screenData.width, screenData.height, 'landscape', 'fullpage'),
                                portrait: pdfFrame.getScaleFactor(screenData.width, screenData.height, 'portrait', 'fullpage')
                            };

                            
                            pdfOrientation = (scale['landscape'] >= scale['portrait']) ? 'landscape' : 'portrait';
                            pdfFrame.setOrientation(pdfOrientation);
                            let effBounding = pdfFrame.getEffectiveBounding(pdfOrientation, 'fullpage') ;


                            // Добавляем страницу
                            pdfFrame.addPage(pdfFormat, pdfOrientation);

                            // Размеры скриншота в документе                                
                            let scrActualSizes = {
                                width: screenData.width * scale[pdfOrientation],
                                height: screenData.height * scale[pdfOrientation]
                            };


                            // Сохраним простой PDF (без рамки)
                            pdfFrame.addImage(
                                screenData.b64,
                                'png',
                                
                                effBounding.x + 0.5 * (effBounding.width - scrActualSizes.width),
                                effBounding.y + 0.5 * (effBounding.height - scrActualSizes.height),
                                
                                scrActualSizes.width,
                                scrActualSizes.height
                            );

                            // Сохраняем документ
                            pdfFrame.save(fileName + '.pdf');

                        }
                        catch(e){
                            modalErr(self.i18n.tr('modal.title-error-download-update-browser'));
                        }
                    }

                }
            }
        }
    });



    // // Если есть активный видео-поток - активирован режим AR
    // if(this.videoStream){
    //     /** VIDEO Захват */
    //     this.calcScene3D.sceneScreenShot(this.nodes.video);
    // }
    // else {
    //     this.calcScene3D.sceneScreenShot(null);
    // }

}


/**
 * Private: Обрабатывает нажатия на кнопки в панеле инструментов
 */
Scene3DView.Toolbar.prototype.__eventListener = function(){
    var self = this;

    var capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    document.addEventListener('win2d-toolbar-btn-click-' + this.uniqIdMod, function(e){
        var elem = e.detail.elem;
        var btnId = e.detail.btnId;

        // Выполним действие в зависимости от нажатой кнопки
        var method = '__event' + capitalize(btnId);
        if(self[method]){
            self[method](elem);
        }
        else {
            console.warn('Event handler method ' + method + ' is not defined in Scene3DView.Toolbar.prototype');
        }
        
    });
}



/*****************************************
 *  HTML
 ****************************************/
/**
 * Private: Добавляет разделитель в панель инструментов
 */
Scene3DView.Toolbar.prototype.__htmlAddToolbarSeparator = function(){
    var separator = document.createElement('div');
    separator.classList.add('__xr-win3d-toolbar-separator');
    this.nodes.toolbar.appendChild(separator);
}

/**
 * Private: Добавляет кнопку в панель инструментов
 */
 Scene3DView.Toolbar.prototype.__htmlAddToolbarButton = function(btnId, props){
    var btn = document.createElement('button');
    
    // Картинка
    var img = document.createElement('div');
    img.classList.add('__xr-win3d-toolbar-btn-img');
    btn.appendChild(img);

    // Всплывающая подсказка
    var title = document.createElement('span');
    title.classList.add('__xr-win3d-toolbar-btn-title');
    title.innerHTML = props.title;
    btn.appendChild(title);

    // Сама кнопка
    btn.classList.add('__xr-win3d-toolbar-btn');
    btn.classList.add('__xr-win3d-toolbar-btn-' + props.class);

    if(props.active){
        btn.classList.add('__xr-win3d-toolbar-btn-active');
    }

    this.nodes.toolbar.appendChild(btn);

    // Событие при нажатии на кнопку
    var self = this;
    btn.addEventListener('click', function(){
        document.dispatchEvent(new CustomEvent('win2d-toolbar-btn-click-' + self.uniqIdMod, { detail: { elem: btn, btnId: btnId } }));
    });
}


/**
 * Создает панель инструментов
 */
Scene3DView.Toolbar.prototype.addTools = function(){

    /** Пробежимся по всем кнопкам Панели инструментов и добавим для них HTML */
    var toolbarGroups = Object.keys(this.tools);
    for(var i = 0, toolbarGroupsLen = toolbarGroups.length; i < toolbarGroupsLen; i++){
        var groupButtons = this.tools[toolbarGroups[i]];

        // Добавим кнопки
        var buttonIds = Object.keys(groupButtons);
        for(var j = 0, buttonIdsLen = buttonIds.length; j < buttonIdsLen; j++){
            var buttonId = buttonIds[j];
            var button = groupButtons[buttonId];

            this.__htmlAddToolbarButton(buttonId, button);
        }

        // Добавим разделитель групп
        if(i < toolbarGroupsLen - 1){
            this.__htmlAddToolbarSeparator();
        }
    }
}





/**************************************** 
 * МЕНЮ
 * 
 * Абстракция отвечающая за панель меню с элементами управления объектами на сцене
 * 
 * 
 * 
 *  */
 Scene3DView.Menu = function(ops){
    /** Список доступных входных параметров */
    this.i18n = ops.i18n;
    this.nodes = ops.nodes;
    this.calcScene3D = ops.calcScene3D;
    this.uniqIdMod = ops.uniqIdMod || Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
    this.getCalcName = ops.getCalcName;

    // /** Создаем исходный HTML для интерфейса */
    // this.createMenuHtml();

    /** Обработчик нажатий на кнопки в панеле иснтрументов */
    this.__eventListener();
}


/*****************************************
 *  HTML
 ****************************************/
Scene3DView.Menu.prototype.clearMenuHtml = function(){
    this.nodes.menuContainer.innerHTML = '';
}

/**
 * Видимость
 */
Scene3DView.Menu.prototype.addMenuItemVisibilityHtml = function(nodeItemMenu, data){
    var subItem = document.createElement('div');
    subItem.classList.add('__xr-win3d-menu-item-sub-sub');

    var visibilityBtn = document.createElement('div');
    visibilityBtn.classList.add('__xr-win3d-menu-item-sub-visibility');
    visibilityBtn.innerHTML = this.i18n.tr('3d-viewer.menu-btn-visibility');

    subItem.appendChild(visibilityBtn);

    // Если группа скрыта по умолчанию
    if(data.state.visibility === 0){
        visibilityBtn.classList.toggle('__xr-win3d-menu-item-sub-visibility-none');
    }


    // Будем включать/отключать отображение группы на сцене
    var self = this;
    subItem.addEventListener('click', function(){
        var groupId = data.title;
        self.calcScene3D.toogleGroupVisibility(groupId);

        visibilityBtn.classList.toggle('__xr-win3d-menu-item-sub-visibility-none');
    });
    
    

    // Добавим в меню
    nodeItemMenu.appendChild(subItem);
}

/** Изменим состояние, выбранную текстуру */
Scene3DView.Menu.prototype.__changeTextureListState = function(res){
    res.data.state.materials.textureList = res.data.state.materials.textureList.map(function(item, index){
        item.selected = 0;
        if(index === res.selectedPos){
            item.selected = 1;

            res.data.state.materials.texture = {
                title: item.title,
                pattern: item.pattern,
                preview: item.preview,
                width: item.width,
                height: item.height
            };
        }
        return item;
    });


    this.calcScene3D.changeGroupState({
        name: res.data.title,
        state: res.data.state
    });
}

/**
 * Текстуры
 */
Scene3DView.Menu.prototype.addMenuItemTexturesHtml = function(nodeItemMenu, data){
    // // Вспомогательная УТИЛИТА
    // function findAncestor (el, cls) {
    //     while ((el = el.parentNode) && el.className.indexOf(cls) < 0);
    //     return el;
    // }
    this.texturesState = {};


    var self = this;

    // Создание HTML
    var subItem = document.createElement('div');
    subItem.classList.add('__xr-win3d-menu-item-sub-sub');

    // Заголовок
    var texturesTitle = document.createElement('div');
    texturesTitle.classList.add('__xr-win3d-menu-item-sub-textures');
    texturesTitle.innerHTML = this.i18n.tr('3d-viewer.menu-btn-textures');
    subItem.appendChild(texturesTitle);

    // Набор текстур 
    var texturesList = document.createElement('div');
    texturesList.classList.add('__xr-win3d-menu-item-sub-textures-list');

    var texturesVariants = data.state.materials.textureList;

    for(var i = 0, len = texturesVariants.length; i < len; i++){
        var tx = texturesVariants[i];

        var texture = document.createElement('div');
        texture.setAttribute('data-pos', i);
        texture.classList.add('__xr-win3d-menu-item-sub-texture');
        
        texture.dataset.name = data.title;
        texture.dataset.title = tx['title'];
        
        if(tx['selected'] === 1){
            texture.classList.add('__xr-win3d-menu-item-sub-texture-selected');
        }


        // Смена выбранной текстуры
        texture.addEventListener('click', function(event){
            var elem = event.currentTarget;
            var classSelected = '__xr-win3d-menu-item-sub-texture-selected';

            var isSelected = !!(new RegExp('(\\s|^)' + classSelected + '(\\s|$)').test(elem.className));
            if(isSelected === true){
                // Не предпринимать действий, если текстура уже выбрана
                return false;
            }

            // Пробежимся по всем текстурам группы и удалим класс выбора
            Array.from(texturesList.getElementsByClassName(classSelected)).map(function(selectedTexture){
                selectedTexture.classList.remove(classSelected);
                return null;
            });

            // Отметим актуальный выбор
            elem.classList.add(classSelected);

            // Создадим запрос на изменение состояния сцены
            self.__changeTextureListState({
                selectedPos: parseInt(elem.getAttribute('data-pos')),
                data: data
            });
        });

        var textureImg = document.createElement('div');
        textureImg.classList.add('__xr-win3d-menu-item-sub-texture-img');
        textureImg.style.backgroundImage = 'url(' + tx['preview'] + ')';

        var textureTitle = document.createElement('div');
        textureTitle.classList.add('__xr-win3d-menu-item-sub-texture-title');
        textureTitle.innerHTML = this.i18n.tr(this.getCalcName() + '.' + tx['title']);

        texture.appendChild(textureImg);
        texture.appendChild(textureTitle);
        texturesList.appendChild(texture);
    }
    texturesList.appendChild(texture);

    // Набор
    subItem.appendChild(texturesList);

    // Добавим в меню
    nodeItemMenu.appendChild(subItem);
}



/** Изменим состояние, выбранный цвет */
Scene3DView.Menu.prototype.__changeColorListState = function(res){
    res.data.state.materials.colorList = res.data.state.materials.colorList.map(function(item, index){
        item.selected = 0;
        if(index === res.selectedPos){
            item.selected = 1;

            res.data.state.materials.color = {
                title: item.title,
                ambient: item.pattern,
                diffuse: item.preview
            };
        }
        return item;
    });


    this.calcScene3D.changeGroupState({
        name: res.data.title,
        state: res.data.state
    });
}


/**
 * Цвета
 */
Scene3DView.Menu.prototype.addMenuItemColorsHtml = function(nodeItemMenu, data){
    var self = this;

    // Создание HTML
    var subItem = document.createElement('div');
    subItem.classList.add('__xr-win3d-menu-item-sub-sub');

    // Заголовок
    var colorsTitle = document.createElement('div');
    colorsTitle.classList.add('__xr-win3d-menu-item-sub-colors');
    colorsTitle.innerHTML = this.i18n.tr('3d-viewer.menu-btn-colors');
    subItem.appendChild(colorsTitle);

    // Набор Цветов 
    var colorsList = document.createElement('div');
    colorsList.classList.add('__xr-win3d-menu-item-sub-colors-list');

    var colorsVariants = data.state.materials.colorList;

    for(var i = 0, len = colorsVariants.length; i < len; i++){
        var col = colorsVariants[i];

        var color = document.createElement('div');
        color.setAttribute('data-pos', i);
        color.classList.add('__xr-win3d-menu-item-sub-color');
        if(col['selected'] === 1){
            color.classList.add('__xr-win3d-menu-item-sub-color-selected');
        }

        // Смена выбранной текстуры
        color.addEventListener('click', function(event){
            var elem = event.currentTarget;
            var classSelected = '__xr-win3d-menu-item-sub-color-selected';

            var isSelected = !!(new RegExp('(\\s|^)' + classSelected + '(\\s|$)').test(elem.className));
            if(isSelected === true){
                // Не предпринимать действий, если текстура уже выбрана
                return false;
            }

            // Пробежимся по всем текстурам группы и удалим класс выбора
            Array.from(colorsList.getElementsByClassName(classSelected)).map(function(selectedColor){
                selectedColor.classList.remove(classSelected);
                return null;
            });

            // Отметим актуальный выбор
            elem.classList.add(classSelected);

            // Создадим запрос на изменение состояния сцены
            self.__changeColorListState({
                selectedPos: parseInt(elem.getAttribute('data-pos')),
                data: data
            });
        });

        // Цвет блока для выбора цвета
        var colorBlock = document.createElement('div');
        colorBlock.classList.add('__xr-win3d-menu-item-sub-color-block');
        colorBlock.style.backgroundColor = col['ambient'];

        var colorTitle = document.createElement('div');
        colorTitle.classList.add('__xr-win3d-menu-item-sub-color-title');
        colorTitle.innerHTML = col['title'];

        color.appendChild(colorBlock);
        color.appendChild(colorTitle);
        colorsList.appendChild(color);
    }
    colorsList.appendChild(color);

    // Набор
    subItem.appendChild(colorsList);

    // Добавим в меню
    nodeItemMenu.appendChild(subItem);
}


Scene3DView.Menu.prototype.addMenuItemHtml = function(data){
    // console.log(data);
    var self = this;

    // Единичная группа
    var item = document.createElement('div');
    item.classList.add('__xr-win3d-menu-item');

    // Если состояние группы "открыто", добавим соответсвующий класс
    if(data.state.open){
        item.classList.add('__xr-win3d-menu-item-open');
    }
    else {
        item.classList.remove('__xr-win3d-menu-item-open');
    }
    


    // Кнопки работы с группой: свернуть/развернуть меню функционала
    var itemBtnWrap = document.createElement('div');
    itemBtnWrap.classList.add('__xr-win3d-menu-item-btn-wrap');
    itemBtnWrap.addEventListener('click', function(e) { self.__eventMenuBtnClick(e, data); });

    // Кнопка с Title
    var itemBtn = document.createElement('div');
    itemBtn.classList.add('__xr-win3d-menu-item-btn');
    itemBtn.innerHTML = data.name;
    itemBtn.setAttribute('data-title', data.title);
    // itemBtn.addEventListener('click', this.__eventMenuBtnClick);

    // Кнопка со стрелкой
    var itemState = document.createElement('div');
    itemState.classList.add('__xr-win3d-menu-item-state');
    // itemState.addEventListener('click', this.__eventMenuBtnClick);

    itemBtnWrap.appendChild(itemBtn);
    itemBtnWrap.appendChild(itemState);

    item.appendChild(itemBtnWrap);


    // Меню работы с группой
    var itemMenu = document.createElement('div');
    itemMenu.classList.add('__xr-win3d-menu-item-sub');

    /*****************************
     * Наполняем меню необходимым функционалом
     * 
     * TODO: Данный набор функциональных возможностей может расширяться 
     * и изменяться в зависимости от появления необходимости во внедрении
     * нового функционала
     */
    // Видимость на сцене
    this.addMenuItemVisibilityHtml(itemMenu, data);
    
    // Выбор текстуры
    if(data.state.materials.textureList && data.state.materials.textureList.length > 0){
        this.addMenuItemTexturesHtml(itemMenu, data);
    }

    // Выбор цвета
    if(data.state.materials.colorList && data.state.materials.colorList.length > 0){
        this.addMenuItemColorsHtml(itemMenu, data);
    }
    /*****************************/
    

    
    // Добавим элемент управления в меню
    item.appendChild(itemMenu);

    // Добавить в меню
    this.nodes.menuContainer.appendChild(item);
}


/******************************************
 * СОБЫТИЯ
 * 
 */


/** Клик по элементу меню: свернуть/развернуть */
Scene3DView.Menu.prototype.__eventMenuBtnClick = function(event, data){
    var target = event.currentTarget;

    // Изменим отображение в меню
    target.parentElement.classList.toggle('__xr-win3d-menu-item-open');

    // Изменим STATE отвечающий за состояние открытия элемента меню
    data.state.open = Number(!data.state.open);

    this.calcScene3D.changeGroupState({
        name: data.title,
        state: data.state
    });
}



Scene3DView.Menu.prototype.refresh = function(data){
    if(!data.groups){
        return false;
    }

    this.clearMenuHtml();
    
    var groupsNames = Object.keys(data.groups);
    for(var i = 0, len = groupsNames.length; i < len; i++){
        this.addMenuItemHtml({
            title: groupsNames[i],
            name: this.i18n.tr(this.getCalcName() + '.' + groupsNames[i]),
            state: data.groups[groupsNames[i]]
        });
    }
}



/*****************************************
 *  СОБЫТИЯ
 ****************************************/
/**
 * Private: Обработка событий
 */
Scene3DView.Menu.prototype.__eventListener = function(){
    this.__eventMenuSlideUp();
}


/**
 * Private: Свернуть/развернуть меню
 */
Scene3DView.Menu.prototype.__eventMenuSlideUp = function(){
    var minClass = '__xr-win3d-menu-min';
    var maxClass = '__xr-win3d-menu-max';

    var self = this;
    self.nodes.menuBtn.addEventListener('click', function(){
        // Сворачиваем/разворачиваем
        self.nodes.menuBtn.classList.toggle(minClass);
        self.nodes.menu.classList.toggle(minClass);

        // Меняем размер подложки (если она видна)
        self.nodes.splash.classList.toggle(maxClass);
    });

    // Проверим, если ширина экрана слишком узкая, то автоматически закроем меню через пару секунд после загрузки
    if(window.innerWidth <= 720){
        setTimeout(function(){
            self.nodes.menuBtn.click();
        }, 1500);
    }
}



/**************************************** 
 * СЦЕНА 3D
 * 
 * Абстракция отвечающая за отображение 3D на Canvas
 * 
 * 
 * 
 *  */
Scene3DView.Scene = function(ops){
    /** Список доступных входных параметров */
    this.i18n = ops.i18n;
    this.nodes = ops.nodes;
    this.calcScene3D = ops.calcScene3D;
    this.uniqIdMod = ops.uniqIdMod;

    /** Обработка событий */
    this.__eventListener();
}

/**
 * Загружает новую сцену в редактор
 * 
 */
Scene3DView.Scene.prototype.refresh = function(data){
    this.calcScene3D.refresh(data, 'new');
}

/*****************************************
 *  СОБЫТИЯ
 ****************************************/
/**
 * Private: Обработка событий
 */
 Scene3DView.Scene.prototype.__eventListener = function(){
    this.__eventViewerResize();
}


/**
 * Private: Изменение размеров окна
 */
Scene3DView.Scene.prototype.__eventViewerResize = function(){
    var self = this;
    
    document.addEventListener('win3d-sceen-resize-' + self.uniqIdMod, function(event){
        var screenSizes = event.detail.sizes;
        self.calcScene3D.resize({width: screenSizes.width, height: screenSizes.height});
    });
}



/**************************************** 
 * ЛИНЕЙКА
 * 
 * Экран вывода значений
 * 
 * 
 * 
 */
 Scene3DView.Ruler = function(ops){
    this.i18n = ops.i18n;
    this.nodes = ops.nodes;
    this.modal = ops.modal;
    this.user = ops.user;

    if(!this.user.subscribed){
        this.nodes.ruler.classList.add('__xr-win3d-ruler-blured');
        
        var self = this;
        this.nodes.ruler.addEventListener('click', function(){
            self.modal.subscribe();
        });
    }
}