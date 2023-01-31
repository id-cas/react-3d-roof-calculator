import svgExport from 'save-svg-as-png';

import FramePdf from './../../pdf/FramePdf';

const CalcScene2D = require('./CalcScene2D')();

export default function Scene2DView(){
};

require('../WinViewModal')(Scene2DView);

/** Инициализация параметров класса */
Scene2DView.prototype.init = function(ops){
    /** Список доступных входных параметров */
    this.i18n = ops.i18n;
    this.user = ops.user;
    this.winWrapId = ops.winWrapId;
    this.uniqIdMod = ops.uniqIdMod || Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));


    /** Валидация входных данных */
    if(!(this.winWrapId && document.getElementById(this.winWrapId))){
        console.warn('Wrapper for 2D Editor window is not found.');
        return;
    }


    /** ОБЯЗАТЕЛЬНО: Идентификаторы элементов окна */
    this.winId = 'js--win2d-' + this.uniqIdMod;
    this.bodyId = 'js--win2d-body-' + this.uniqIdMod;
    this.splashId = 'js--win2d-splash-' + this.uniqIdMod;

    this.screenId = 'js--win2d-screen-' + this.uniqIdMod;
    this.toolbarId = 'js--win2d-toolbar-' + this.uniqIdMod;


    /** Создаем исходный HTML для интерфейса */
    this.createWinHtml();
};

Scene2DView.prototype.createWinHtml = function(){
    var html = null;

    /** Создадим шаблон будущего просмотрщика 2D */
    html = 
    `<div id="` + this.winId + `" class="__xr-win2d">
        <div id="` + this.toolbarId + `" class="__xr-win2d-toolbar"></div>
        <div id="` + this.bodyId + `" class="__xr-win2d-body">
            <div class="__xr-win2d-body-cols">
                <div id="` + this.screenId + `" class="__xr-win2d-screen">
                    <div id="` + this.splashId + `" class="__xr-win2d-splash-screen"></div>
                </div>
            </div>
        </div>
    </div>`
    ;
    document.getElementById(this.winWrapId).innerHTML = html;

    /** ОБЯЗАТЕЛЬНО: Инициализируем доступ к элементам управления просмотрщика */
    this.nodes = {
        splash: document.getElementById(this.splashId),
        screen: document.getElementById(this.screenId),
        toolbar: document.getElementById(this.toolbarId),
        win: document.getElementById(this.winId),
        body: document.getElementById(this.bodyId)
    };


    /** СЦЕНА 2D*/
    this.calcScene2D = new CalcScene2D({
        i18n: this.i18n,
        nodes: this.nodes,
        uniqIdMod: this.uniqIdMod,
        
        getCalcName: this.__getCalcName.bind(this),
        refreshCallback: this.__refreshSceneCallback.bind(this)
    });
    
    // Создать функционал всплывающих окон
    this.modalInc = new Scene2DView.Modal({i18n: this.i18n, nodes: this.nodes, uniqIdMod: this.uniqIdMod});

    // Создать панель инструментов и добавить в нее кнопки
    this.toolbarInc = new Scene2DView.Toolbar({
        i18n: this.i18n,
        nodes: this.nodes,
        calcScene2D: this.calcScene2D,
        modal: this.modalInc,
        uniqIdMod: this.uniqIdMod,

        user: this.user,
        
        getCalcName: this.__getCalcName.bind(this)
    }); 


    /** СОБЫТИЕ: Убираем экран заставку */
    var splash = document.getElementById(this.splashId);
    splash.addEventListener('click', function(){
        splash.removeEventListener('click', function(){});
        splash.remove();
    });
}

Scene2DView.prototype.__getCalcName = function(){
    return this.calcName;
}

/**
 * Сцена 2D обновилась, можно забирать данные об объектах
 */
 Scene2DView.prototype.__refreshSceneCallback = function(data){
    // Обновлять состояние селектора чертежей drawingSelector
    this.drwSelectorInc = this.toolbarInc.getDrawingsSelector()
    this.drwSelectorInc.update(data);
}


/**
 * Обновить сцену в соответсвии с новыми данными, полученными от сервера
 */
Scene2DView.prototype.updateScene = function(data, calcName){
    // Инициализируем функционал работы с чертежами в редакторе
    if(!this.viewerScene){
        this.viewerScene = new Scene2DView.Scene({i18n: this.i18n, nodes: this.nodes, calcScene2D: this.calcScene2D, toolbarInc: this.toolbarInc, uniqIdMod: this.uniqIdMod});
    }

    // console.log('updateScene');
    // Обновим состояние сцены
    this.calcName = calcName;
    this.viewerScene.refresh(data);
}



/**************************************** 
 *  
 * A P I
 * 
 *  */
/** Получить набор чертежей для API */
Scene2DView.prototype.apiGetDrawingsList = function(){
    return this.toolbarInc.getDrawingsList();
}



/**************************************** 
 * ИНСТРУМЕНТЫ
 * 
 * Абстракция отвечающая за панель инструментов наверху
 * 
 * 
 * 
 *  */
Scene2DView.Toolbar = function(ops){
    /** Список доступных входных параметров */
    this.i18n = ops.i18n;
    this.nodes = ops.nodes;
    this.calcScene2D = ops.calcScene2D;
    this.modal = ops.modal;
    this.uniqIdMod = ops.uniqIdMod || Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
    this.user = ops.user;
    this.getCalcName = ops.getCalcName;


    /** Кнопки в панеле инструментов */
    this.tools = {
        settings: {
            reset: {
                title: this.i18n.tr('2d-viewer.btn-reset'),
                class: 'reset'
            }
        },
        sizes: {
            zoomIn: {
                title: this.i18n.tr('2d-viewer.btn-zoom-in'),
                class: 'zoom-in'
            },
            zoomOut: {
                title: this.i18n.tr('2d-viewer.btn-zoom-out'),
                class: 'zoom-out'
            }
        },
        move: {
            moveLeft: {
                title: this.i18n.tr('2d-viewer.btn-move-left'),
                class: 'mov-left'
            },
            moveRight: {
                title: this.i18n.tr('2d-viewer.btn-move-right'),
                class: 'mov-right'
            },
            moveTop: {
                title: this.i18n.tr('2d-viewer.btn-move-top'),
                class: 'mov-top'
            },
            moveBottom: {
                title: this.i18n.tr('2d-viewer.btn-move-bottom'),
                class: 'mov-bot'
            }
        },
        rotate: {
            rotateClockwise: {
                title: this.i18n.tr('2d-viewer.btn-rotate-clockwise'),
                class: 'rot-clock'
            },
            rotateCounterClockwise: {
                title: this.i18n.tr('2d-viewer.btn-rotate-counterclockwise'),
                class: 'rot-cclock'
            }
        },
        files: {
            download: {
                title: this.i18n.tr('2d-viewer.btn-download-files'),
                class: 'down'
            }
        },
        display: {
            fullScreen: {
                title: this.i18n.tr('2d-viewer.btn-fullscreen'),
                class: 'full-scr'
            }
        },
        help: {
            about: {
                title: this.i18n.tr('2d-viewer.btn-about'),
                class: 'about'
            }
        }
    };

    /** Инициализируем все доступные инструменты */
    this.addTools();

    /** Инициализируем список доступных чертежей */
    this.drwSelectorInc = new Scene2DView.Toolbar.DrawingsSelector({
        i18n: this.i18n,
        nodes: this.nodes,
        uniqIdMod: this.uniqIdMod,
    
        onChangeCallback: this.calcScene2D.draw.bind(this.calcScene2D),
        
        getCalcName: this.getCalcName
    });

    /** Обработчик нажатий на кнопки в панеле иснтрументов */
    this.__eventListener();
}


/** Возвращаем инстанс выбора чертежей */
Scene2DView.Toolbar.prototype.getDrawingsSelector = function(){
    return this.drwSelectorInc;
}

/** Возвращаем набор чертежей с буффером, содержащим изображение, а также размеры изображения (чертежа) */
Scene2DView.Toolbar.prototype.getDrawingsList = function(){
    var drawings = this.calcScene2D.getDrawingsNames();
    var names = Object.keys(drawings);

    var name = '', title = '';
    var buff = null;
    var res = {};
    for (var i = 0, li = names.length; i < li; i++) {
        // Название чертежа
        name = names[i];
        title = this.i18n.tr(this.getCalcName() + '.' + drawings[names[i]]);
        
        // Данные с черетежа
        buff = this.calcScene2D.getDrawingBuff(names[i], this.user.drwFormat);

        res[name] = {
            title: title,
            b64: buff.b64,
            width: buff.width,
            height: buff.height
        };
    }

    return res;
}



/*****************************************
 *  СОБЫТИЯ
 ****************************************/
/**
 * Private: Сброс настроек конкретного чертежа
 */
 Scene2DView.Toolbar.prototype.__eventReset = function(){
    this.calcScene2D.reset();
}

/**
 * Private: Приблизить/Увеличить
 */
Scene2DView.Toolbar.prototype.__eventZoomIn = function(){
    this.calcScene2D.zoomIn();
}

/**
 * Private: Удалиться/Уменьшить
 */
Scene2DView.Toolbar.prototype.__eventZoomOut = function(){
    this.calcScene2D.zoomOut();
}

/**
 * Private: Сместить влево
 */
Scene2DView.Toolbar.prototype.__eventMoveLeft = function(){
    this.calcScene2D.translate(-10, 0);
}

/**
 * Private: Сместить вправо
 */
Scene2DView.Toolbar.prototype.__eventMoveRight = function(){
    this.calcScene2D.translate(10, 0);
}

/**
 * Private: Сместить вверх
 */
Scene2DView.Toolbar.prototype.__eventMoveTop = function(){
    this.calcScene2D.translate(0, -10);
}


/**
 * Private: Сместить вниз
 */
Scene2DView.Toolbar.prototype.__eventMoveBottom = function(){
    this.calcScene2D.translate(0, 10);
}


/**
 * Private: Вращать по часовой стрелки
 */
Scene2DView.Toolbar.prototype.__eventRotateClockwise = function(){
    this.calcScene2D.rotate(90);
}

/**
 * Private: Вращать против часовой стрелки
 */
 Scene2DView.Toolbar.prototype.__eventRotateCounterClockwise = function(){
    this.calcScene2D.rotate(-90);
}

/**
 * Private: Переход в полноэкранный режим
 */
Scene2DView.Toolbar.prototype.__eventFullScreen = function(elem){
    var fullScreenClassName = '__xr-win2d-fullscreen';
    var activeClassName = '__xr-win2d-toolbar-btn-active';

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
     * СОБЫТИЕ: сообщим всему документу об изменении размеров экрана для просмотра 2D
     */
    var self = this;
    document.dispatchEvent(new CustomEvent('win2d-sceen-resize-' + self.uniqIdMod, { 
        detail: { 
            elem: self.nodes.screen,
            sizes: self.nodes.screen.getBoundingClientRect()
        }
    }));
}


/**
 * Private: Вызов справки
 */
Scene2DView.Toolbar.prototype.__eventAbout = function(elem){
    this.modal.show({
        title: this.i18n.tr('modal.title-about'),
        content: this.i18n.tr('modal.content-about')
    });
}

/**
 * Private: Сохранить/скачать чертежи
 */
Scene2DView.Toolbar.prototype.__eventDownload = function(){
    var self = this;

    /** Покажем модальное окно если у пользователя нет подписки */
    if(!this.user.subscribed){
        this.modal.subscribe();
        return false;
    }

    // Ограничение для подписки Умелец
    var disabled = (this.user.drwFormat === 'svg') ? false : true;

    var classDownloadVarians = '__xr-win2d-modal-download-var';
    var htmlContent = `
        <div style="margin: 30px auto; width: 200px;">
            
            <div style="margin-bottom: 30px">
                <div class="__xr-win2d-modal-download-item">
                    <input id="js--win2d-modal-dowload-pdf-all" type="radio" class="${classDownloadVarians}" value="pdf-all" name="file2d-type" ${disabled ? 'disabled' : ''}/>
                    <label for="js--win2d-modal-dowload-pdf-all">${this.i18n.tr('2d-viewer.label-download-pdf-all')}</label>
                </div>

                <div class="__xr-win2d-modal-download-item">
                    <input id="js--win2d-modal-dowload-pdf" type="radio" class="${classDownloadVarians}" value="pdf" name="file2d-type" ${disabled ? 'disabled' : ''}/>
                    <label for="js--win2d-modal-dowload-pdf">${this.i18n.tr('2d-viewer.label-download-pdf')}</label>
                </div>

                <div class="__xr-win2d-modal-download-item">
                    <input id="js--win2d-modal-dowload-png" type="radio" class="${classDownloadVarians}" value="png" name="file2d-type" checked/>
                    <label for="js--win2d-modal-dowload-png">${this.i18n.tr('2d-viewer.label-download-png')}</label>
                </div>

                <div class="__xr-win2d-modal-download-item">
                    <input id="js--win2d-modal-dowload-svg" type="radio" class="${classDownloadVarians}" value="svg" name="file2d-type" ${disabled ? 'disabled' : ''}/>
                    <label for="js--win2d-modal-dowload-svg">${this.i18n.tr('2d-viewer.label-download-svg')}</label>
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
    
    /** Покажем модальное окно и настроим действия на совершение нажатия кнопок */
    this.modal.show({
        title: this.i18n.tr('modal.title-download-2D-file'),
        content: htmlContent,
        btnAccept: {
            html: this.i18n.tr('modal.button-download'),
            callback: function(){
                // Получим список форматов для сохранения
                var format = getDownloadFormat();
                if(format.length){
                    var imgFormat = format[0];

                    // Закрыть окно
                    self.modal.hide();

                    // Текущее наименование чертежа
                    const actualDrawing = self.drwSelectorInc.getSelected();
                    const drwName = actualDrawing.value;
                    const drwTitle = actualDrawing.title;

                    const date = new Date(); // Or the date you'd like converted.
                    const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                    let fileName = self.i18n.tr(drwTitle).toLowerCase().replace(/\s/g, '_') + '_' + isoDateTime.slice(0,19).replace(/(-|T|:)/g,"");

                    // Получим буффер с данными об изображении SVG/PNG
                    var drwBuff = null;
                    
                    // imgFormat = 'pdf-all';

                    // Сохраним выбранный чертеж в выбранном формате
                    // PNG
                    if(imgFormat === 'png'){
                        if(self.user.drwFormat === 'svg'){
                            try {
                                drwBuff = self.calcScene2D.getDrawingBuff(drwName, self.user.drwFormat);
                                svgExport.saveSvgAsPng(drwBuff.b64, fileName + '.png');
                            }
                            catch(e){
                                modalErr(self.i18n.tr('modal.title-error-download-update-browser'));
                            }
                        }
                        else {
                            try {
                                drwBuff = self.calcScene2D.getDrawingBuff(drwName, self.user.drwFormat);
                                svgExport.download(fileName + '.png', drwBuff.b64, {});
                            }
                            catch(e){
                                modalErr(self.i18n.tr('modal.title-error-download-update-browser'));
                            }
                        }
                        
                    }

                    // SVG
                    if(imgFormat === 'svg'){
                        if(self.user.drwFormat === 'svg'){
                            try {
                                drwBuff = self.calcScene2D.getDrawingBuff(drwName, self.user.drwFormat);
                                svgExport.saveSvg(drwBuff.b64, fileName + '.svg');
                            }
                            catch(e){
                                modalErr(self.i18n.tr('modal.title-error-download-update-browser'));
                            }
                        }
                        else {
                            modalErr(self.i18n.tr('modal.title-error-download-unsupported-file-format'));
                        }
                    }

                    // PDF
                    if(imgFormat === 'pdf'){
                        if(self.user.drwFormat === 'svg'){
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


                                // Данные с изображением                               
                                drwBuff = self.calcScene2D.getDrawingBuff(drwName, self.user.drwFormat);
                                
                                // Рассчитаем оптимальную ориентацию для текущего чертежа
                                let scale = {
                                    landscape: pdfFrame.getScaleFactor(drwBuff.width, drwBuff.height, 'landscape', 'fullpage'),
                                    portrait: pdfFrame.getScaleFactor(drwBuff.width, drwBuff.height, 'portrait', 'fullpage')
                                };

                                
                                pdfOrientation = (scale['landscape'] >= scale['portrait']) ? 'landscape' : 'portrait';
                                pdfFrame.setOrientation(pdfOrientation);
                                let effBounding = pdfFrame.getEffectiveBounding(pdfOrientation, 'fullpage') ;

                                // Добавляем страницу
                                pdfFrame.addPage(pdfFormat, pdfOrientation);

                                // Размеры чертежа в документе                                
                                let drwActualSizes = {
                                    width: drwBuff.width * scale[pdfOrientation],
                                    height: drwBuff.height * scale[pdfOrientation]
                                };

                                // Сохраним простой PDF (без рамки)
                                pdfFrame.addSvg(drwBuff.b64, {
                                    x: effBounding.x + 0.5 * (effBounding.width - drwActualSizes.width),
                                    y: effBounding.y + 0.5 * (effBounding.height - drwActualSizes.height),
                                    width: drwActualSizes.width,
                                    height: drwActualSizes.height
                                }).then(() => {
                                    // Сохраняем документ
                                    pdfFrame.save(fileName + '.pdf');
                                });
                            }
                            catch(e){
                                modalErr(self.i18n.tr('modal.title-error-download-update-browser'));
                            }
                        }
                        else {
                            modalErr(self.i18n.tr('modal.title-error-download-unsupported-file-format'));
                        }
                    }

                    // PDF (All Drawings)
                    if(imgFormat === 'pdf-all'){
                        fileName = 'drawings_' + isoDateTime.slice(0,19).replace(/(-|T|:)/g,"");

                        // Параметры PDF документа
                        const pageWidth = 297, pageHeight = 210;
                        const pdfFormat = [pageWidth, pageHeight];
                        let pdfOrientation = 'landscape'; // portrait || landscape

                        const pdfFrame = new FramePdf({
                            orientation: pdfOrientation,
                            units: 'mm',
                            format: pdfFormat,

                            pageWidth: pageWidth,
                            pageHeight: pageHeight,

                            srcLink: window.location.href,  // Ссылка на страницу источник данных
                            showTitlePage: true              // Показывать титульную страницу
                        });

                        // Установить подписи к полям для блока Основных надписей
                        pdfFrame.setLabelsData({
                            logo: self.i18n.tr('2d-viewer.pdf-label-drw-logo'),
                            title: self.i18n.tr('2d-viewer.pdf-label-drw-title'),
                            author: self.i18n.tr('2d-viewer.pdf-label-drw-author'),
                            date: self.i18n.tr('2d-viewer.pdf-label-drw-date'),
                            pages: self.i18n.tr('2d-viewer.pdf-label-drw-pages')
                        });

                        // Установить значения полей для Главной страницы
                        pdfFrame.setTitlePageData({
                            header: self.i18n.tr('calc.' + self.getCalcName()),
                            logo: {
                                b64: self.user.logo.b64,
                                ext: self.user.logo.ext,
                                width: self.user.logo.width,
                                height: self.user.logo.height
                            },
                            author: self.user.name,
                            date: isoDateTime.replace(/T.*/, ''),

                            qrData: window.location.href
                        });

                        var drawings = self.getDrawingsList();
                        var names = Object.keys(drawings), namesCount = names.length;

                        (async function loop(names) {
                            for (let i = 0, li = namesCount; i < li; i++) {
                                /** Разметка страницы */
                                // Чертеж
                                let drawing = drawings[names[i]];
                                
                                // Рассчитаем оптимальную ориентацию для текущего чертежа
                                let scale = {
                                    landscape: pdfFrame.getScaleFactor(drawing.width, drawing.height, 'landscape'),
                                    portrait: pdfFrame.getScaleFactor(drawing.width, drawing.height, 'portrait')
                                };
                                
                                pdfOrientation = (scale['landscape'] >= scale['portrait']) ? 'landscape' : 'portrait';

                                pdfFrame.setOrientation(pdfOrientation);
                                let effBounding = pdfFrame.getEffectiveBounding(pdfOrientation, 'effective') ;

                                // Добавляем страницу
                                pdfFrame.addPage(pdfFormat, pdfOrientation);

                                // Размеры чертежа в документе                                
                                let drwActualSizes = {
                                    width: drawing.width * scale[pdfOrientation],
                                    height: drawing.height * scale[pdfOrientation]
                                };

                                // Promise функциция (ожидаем асинхронное завершение)
                                await pdfFrame.addSvg(drawing.b64, {
                                        x: effBounding.x + 0.5 * (effBounding.width - drwActualSizes.width),
                                        y: effBounding.y + 0.5 * (effBounding.height - drwActualSizes.height),
                                        width: drwActualSizes.width,
                                        height: drwActualSizes.height
                                    });
                                
                                
                                /** Добавим разметку рамки */
                                /** >>>>>>>>>>>>>>>>>>>>>> */
                                pdfFrame.addFrame();
                                
                                // Добавить подписи в блок Основных надписей
                                pdfFrame.setFieldsData({
                                    logo: {
                                        b64: self.user.logo.b64,
                                        ext: self.user.logo.ext,
                                        width: self.user.logo.width,
                                        height: self.user.logo.height
                                    },
                                    title: drawing.title,
                                    author: self.user.name,
                                    date: isoDateTime.replace(/T/, ' ').replace(/\.\d{3}Z$/, ''),
                                    pages: `${(i + 1)}/${namesCount}`
                                });
                                /** <<<<<<<<<<<<<<<<<<<<<< */


                                if(i >= (li - 1)){
                                    // Сохраняем документ
                                    pdfFrame.save(fileName + '.pdf');
                                }
                            }
                        })(names);

                    }
                }
            }
        }
    });
}


/**
 * Запрещает обратку событий при нажатии на кнопки Панели инструментов
 */
Scene2DView.Toolbar.prototype.eventsDisable = function(){
    this.eventsDisabled = true;
}

/**
 * Разрешает обратку событий при нажатии на кнопки Панели инструментов
 */
 Scene2DView.Toolbar.prototype.eventsEnable = function(){
    this.eventsDisabled = false;
}


/**
 * Private: Обрабатывает нажатия на кнопки в Панели инструментов
 */
Scene2DView.Toolbar.prototype.__eventListener = function(){
    var self = this;

    var capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    document.addEventListener('win2d-toolbar-btn-click-' + this.uniqIdMod, function(e){
        
        // Если заблокированна обратка событий (например, нет чертежей), тогда пректатим их обаботку
        if(self.eventsDisabled){
            return false;
        }

        var elem = e.detail.elem;
        var btnId = e.detail.btnId;

        // Выполним действие в зависимости от нажатой кнопки
        var method = '__event' + capitalize(btnId);
        if(self[method]){
            self[method](elem);
        }
        else {
            console.warn('Event handler method ' + method + ' is not defined in Scene2DView.Toolbar.prototype');
        }
        
    });
}



/*****************************************
 *  HTML
 ****************************************/
/**
 * Private: Добавляет разделитель в панель инструментов
 */
Scene2DView.Toolbar.prototype.__htmlAddToolbarSeparator = function(){
    var separator = document.createElement('div');
    separator.classList.add('__xr-win2d-toolbar-separator');
    this.nodes.toolbar.appendChild(separator);
}

/**
 * Private: Добавляет кнопку в панель инструментов
 */
 Scene2DView.Toolbar.prototype.__htmlAddToolbarButton = function(btnId, props){
    var btn = document.createElement('button');
    
    // Картинка
    var img = document.createElement('div');
    img.classList.add('__xr-win2d-toolbar-btn-img');
    btn.appendChild(img);

    // Всплывающая подсказка
    var title = document.createElement('span');
    title.classList.add('__xr-win2d-toolbar-btn-title');
    title.innerHTML = props.title;
    btn.appendChild(title);

    // Сама кнопка
    btn.classList.add('__xr-win2d-toolbar-btn');
    btn.classList.add('__xr-win2d-toolbar-btn-' + props.class);

    if(props.active){
        btn.classList.add('__xr-win2d-toolbar-btn-active');
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
Scene2DView.Toolbar.prototype.addTools = function(){

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

/**
 * Создает селектор для выбора актичного чертежа
 */
Scene2DView.Toolbar.DrawingsSelector = function(ops){
    this.i18n = ops.i18n;
    this.uniqIdMod = ops.uniqIdMod || Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
    this.nodes = ops.nodes || {};
    this.onChangeCallback = ops.onChangeCallback;
    this.getCalcName = ops.getCalcName;


    var wrapper = document.createElement('div');
    wrapper.classList.add('__xr-win2d-toolbar-drw-selector-wrap');

    this.nodes.drwSelector = document.createElement('select');
    this.nodes.drwSelector.classList.add('__xr-win2d-toolbar-drw-selector');
    this.nodes.drwSelector.setAttribute('id', 'js--win2d-' + this.uniqIdMod);

    var drwSelectorTitle = document.createElement('span');
    drwSelectorTitle.classList.add('__xr-win2d-toolbar-drw-selector-title');
    drwSelectorTitle.innerHTML = this.i18n.tr('2d-viewer.drawings-selector-title');
    
    wrapper.appendChild(this.nodes.drwSelector);
    wrapper.appendChild(drwSelectorTitle);

    this.nodes.toolbar.appendChild(wrapper);
    

    // Событие при нажатии на кнопку
    var self = this;
    this.nodes.drwSelector.addEventListener('change', function(){
        self.onChangeCallback(self.nodes.drwSelector.value);
    });
}

Scene2DView.Toolbar.DrawingsSelector.prototype.update = function(options){
    this.nodes.drwSelector.innerHTML = '';
   
    var opKeys = Object.keys(options);
    var key = null, title = '', selected = false;
    var op = null;
    for(var i = 0, len = opKeys.length; i < len; i++){
        key = opKeys[i];
        
        title = options[key].title;
        selected = (typeof options[key].selected !== 'undefined') ? !!options[key].selected : false;

        op = document.createElement('option');
        op.value = key;
        op.innerHTML = this.i18n.tr(this.getCalcName() + '.' + title);

        if(selected === true){
            op.selected = 'selected';
        }
        
        this.nodes.drwSelector.appendChild(op);
    }

}

/**
 * Возвращает актуальное выбранное название чертежа
 * @returns
 */
Scene2DView.Toolbar.DrawingsSelector.prototype.getSelected = function(){
    var selectedIndex = this.nodes.drwSelector.selectedIndex;
    return {
        value: this.nodes.drwSelector.options[selectedIndex].value,
        title: this.nodes.drwSelector.options[selectedIndex].text
    };
}






/**************************************** 
 * СЦЕНА 2D
 * 
 * Абстракция отвечающая за отображение 2D на Canvas
 * 
 * 
 * 
 *  */
Scene2DView.Scene = function(ops){
    /** Список доступных входных параметров */
    this.i18n = ops.i18n;
    this.nodes = ops.nodes;
    this.calcScene2D = ops.calcScene2D;
    this.toolbarInc = ops.toolbarInc;
    this.uniqIdMod = ops.uniqIdMod;

    /** Обработка событий */
    this.__eventListener();
}

/**
 * Загружает новую сцену в редактор
 * 
 */
Scene2DView.Scene.prototype.refresh = function(data){
    
    // Если чертежа нет, заблокируем обработку событий
    if(!Object.keys(data).length){
        this.toolbarInc.eventsDisable();
    }
    else {
        this.toolbarInc.eventsEnable();
    }
    

    // Обновим отображение
    this.calcScene2D.refresh(data);
}



/*****************************************
 *  СОБЫТИЯ
 ****************************************/
/**
 * Private: Обработка событий
 */
 Scene2DView.Scene.prototype.__eventListener = function(){
    this.__eventViewerResize();
}


/**
 * Private: Изменение размеров окна
 */
Scene2DView.Scene.prototype.__eventViewerResize = function(){
    var self = this;
    document.addEventListener('win2d-sceen-resize-' + self.uniqIdMod, function(event){
        // var screenSizes = event.detail.sizes;

        // Сброс позиционирования изображений для всех проекций
        self.calcScene2D.reset();
    });
}



