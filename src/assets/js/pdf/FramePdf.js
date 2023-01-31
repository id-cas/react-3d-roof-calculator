import { jsPDF } from 'jspdf';
import 'svg2pdf.js';        // Plugin для jspdf
import 'jspdf-autotable';   // Plugin для jspdf

import QRCode from 'qrcode';


// module.exports = function() {
export default  function FramePdf(ops){
    // Документация
    // http://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#~Point

    // Коэффициенты для расчета реального размера шрифтов
    // case 'pt':  k = 1;          break;
    // case 'mm':  k = 72 / 25.4;  break;
    // case 'cm':  k = 72 / 2.54;  break;
    // case 'in':  k = 72;         break;
    // case 'px':  k = 96 / 72;    break;
    // case 'pc':  k = 12;         break;
    // case 'em':  k = 12;         break;
    // case 'ex':  k = 6;          break;


    // Ссылка на источник данных для документа
    this.srcLink = ops.srcLink || '';

    // Инстанс генератора PDF
    this.docPdf = {};
    this.docPdf.orientation = ops.orientation || 'landscape';
    this.docPdf.units = ops.units || 'mm';
    this.docPdf.format = ops.format || [297, 210];
    
    this.pdf = new jsPDF('portrait', this.docPdf.units, this.docPdf.format);

    this.orientation = this.docPdf.orientation;
    
    // Отступы в полях блока Осноных надписей
    this.fieldsPadding = {
        top: 1,
        left: 1,
        bottom: 1,
        right: 1
    };

    // Толщина основной линии для рамки
    this.lineWidth = 0.3;

    // Размер шрифтов в полях блока Осноных надписей
    let opsFonts = ops.fonts || {};
    this.fontSizes = {
        header: opsFonts.header || 18,
        labels: opsFonts.labels || 6,
        title:  opsFonts.title || 8,
        author:  opsFonts.author || 8,
        date:  opsFonts.date || 8,
        pages:  opsFonts.pages || 8,

        srcLink: opsFonts.srcLink || 8
    };

    // Загрузим в vFS шрифт, который будем использовать в документе
    this.pdf.addFileToVFS("Roboto-Regular.ttf", require('./fonts/RobotoRegularB64.json').data); // your font in binary format as second parameter (font in base64)
    this.pdf.addFont("Roboto-Regular.ttf", "RobotoRegular", "normal"); 
    this.pdf.setFont("RobotoRegular");
    // console.log(this.pdf.getFontList());

    // Установить ориентацию и инициализировать начальные параметры листа
    this.__setOrientation(this.orientation);

    // Установить значения для меток блока Основных надписей
    this.__setLabelsData();
};



/** PRIVATE */
/** Установить ориентацию и инициализировать начальные параметры листа */
FramePdf.prototype.__setLabelsData = function(labels){
    labels = labels || {};

    this.labels = {};
    this.labels.logo = labels.logo || 'Company logo';
    this.labels.title = labels.title || 'Title';
    this.labels.author = labels.author || 'Author';
    this.labels.date = labels.date || 'Date';
    this.labels.pages = labels.pages || 'Pages';
}

FramePdf.prototype.__setOrientation = function(orientation){
    this.orientation = 'landscape';

    if(orientation !== this.orientation){
        this.orientation = 'portrait';
    }


    // Размеры листа в зависимости от ориентации
    this.a4 = {
        landscape: {
            width: 297,
            height: 210
        },

        portrait: {
            width: 210,
            height: 297
        }
    };

    // Отступы вокруг рамки        
    this.padding = {
        top: 5,
        left: 10,   // Стандартное значение 20
        bottom: 5,
        right: 5
    };

    // Размеры блока основных записей в правом нижем углу
    this.titleBlock = {
        width: 185,
        height: 30
    };

    if(this.orientation === 'portrait'){
        this.titleBlock.width = this.a4[this.orientation].width - (this.padding.left + this.padding.right);
    }
}

/** Основная рамка по периметру */
FramePdf.prototype.__addMainFrame = function(){
    // Основная рамка
    this.pdf.saveGraphicsState();
    this.pdf.setLineWidth(this.lineWidth);
    
    let boundingRect = this.__getFrameBounding();
    this.pdf.rect(boundingRect.x, boundingRect.y, boundingRect.width, boundingRect.height, 'S');
    
    this.pdf.restoreGraphicsState();
}

/** Блок с Основными надписями */
FramePdf.prototype.__addTitleBlock = function(){
    // Основная рамка
    this.pdf.saveGraphicsState();
    this.pdf.setLineWidth(this.lineWidth);
    this.pdf.setFillColor(255);
    
    let boundingRect = this.__getFrameBounding();

    // Главная рамка блока
    let startX = (boundingRect.x + boundingRect.width - this.titleBlock.width),
        startY = (boundingRect.y + boundingRect.height - this.titleBlock.height);

    this.pdf.rect(
        startX,
        startY,
        this.titleBlock.width,
        this.titleBlock.height,
        'FD'
    );

    // Блок для логотипа
    this.blockLogo = {
        x: startX,
        y: startY,
        width: this.titleBlock.width * (1/3),
        height: this.titleBlock.height
    };
    this.pdf.rect(
        this.blockLogo.x,
        this.blockLogo.y,
        this.blockLogo.width,
        this.blockLogo.height,
        'S'
    );


    
    // Отдельные строки блока
    let linesCount = 3;
    let lineHeight = this.titleBlock.height / linesCount;
    
    // Блок с назаванием чертежа
    this.blockTitle = {
        x: this.blockLogo.x + this.blockLogo.width,
        y: this.blockLogo.y,
        width: this.titleBlock.width * (2/3),
        height: lineHeight
    };
    this.pdf.rect(
        this.blockTitle.x,
        this.blockTitle.y,
        this.blockTitle.width,
        this.blockTitle.height,
        'S'
    );

    // Блок с автором
    this.blockAuthor = {
        x: this.blockTitle.x,
        y: this.blockTitle.y + lineHeight,
        width: this.blockTitle.width,
        height: lineHeight
    };
    this.pdf.rect(
        this.blockAuthor.x,
        this.blockAuthor.y,
        this.blockAuthor.width,
        this.blockAuthor.height,
        'S'
    );


    // Блок с Датой
    this.blockDate = {
        x: this.blockAuthor.x,
        y: this.blockAuthor.y + lineHeight,
        width: this.blockAuthor.width / 2,
        height: lineHeight
    };
    this.pdf.rect(
        this.blockDate.x,
        this.blockDate.y,
        this.blockDate.width,
        this.blockDate.height,
        'S'
    );


    // Блок с Постраничкой
    this.blockPages = {
        x: this.blockDate.x + this.blockDate.width,
        y: this.blockDate.y,
        width: this.blockDate.width,
        height: lineHeight
    };
    this.pdf.rect(
        this.blockPages.x,
        this.blockPages.y,
        this.blockPages.width,
        this.blockPages.height,
        'S'
    );
    
    this.pdf.restoreGraphicsState();
}


/** Добавить метки в поля блока Основных записей */
FramePdf.prototype.__addTitleBlockLabels = function(){
    this.pdf.saveGraphicsState();
    this.pdf.setFontSize(this.fontSizes.labels);
    this.pdf.setTextColor(80);
    
    // Блок для логотипа - this.blockLogo
    this.pdf.text(this.labels.logo, this.blockLogo.x + this.fieldsPadding.left, this.blockLogo.y + this.fieldsPadding.top, {baseline: 'top'});

    // Блок с назаванием чертежа - this.blockTitle
    this.pdf.text(this.labels.title, this.blockTitle.x + this.fieldsPadding.left, this.blockTitle.y + this.fieldsPadding.top, {baseline: 'top'});
    
    // Блок с автором - this.blockAuthor
    this.pdf.text(this.labels.author, this.blockAuthor.x + this.fieldsPadding.left, this.blockAuthor.y + this.fieldsPadding.top, {baseline: 'top'});
    
    // Блок с Датой - this.blockDate
    this.pdf.text(this.labels.date, this.blockDate.x + this.fieldsPadding.left, this.blockDate.y + this.fieldsPadding.top, {baseline: 'top'});

    // Блок с Постраничкой - this.blockPages
    this.pdf.text(this.labels.pages, this.blockPages.x + this.fieldsPadding.left, this.blockPages.y + this.fieldsPadding.top, {baseline: 'top'});

    this.pdf.restoreGraphicsState();
}


/** Добавить ссылку на страницу - источник данных */
FramePdf.prototype.__addSourceSiteLink = function(){
    if(!this.srcLink){
        return;
    }

    this.pdf.saveGraphicsState();

    this.pdf.setFontSize(this.fontSizes.srcLink);
    this.pdf.setTextColor(80);
    
    this.pdf.text(this.srcLink, this.padding.left * 0.5, this.a4[this.orientation].height - (this.padding.bottom + this.fontSizes.srcLink * 0.25), {baseline: 'middle', angle: 90});

    this.pdf.restoreGraphicsState();
}



/** PUBLIC */
/** Изменить ориентацию листа */
FramePdf.prototype.setOrientation = function(orientation){
    this.__setOrientation(orientation);
}

/** Изменить/установить наименование меток блока Основных надписей  */
FramePdf.prototype.setLabelsData = function(labels){
    this.__setLabelsData(labels);
}

/** Устновить значения для основных полей */
FramePdf.prototype.setFieldsData = function(fields){
    this.pdf.setTextColor(0);

    // Блок для логотипа - this.blockLogo
    if(fields.logo) {
        let maxImgWidth = this.blockLogo.width - (this.fieldsPadding.left + this.fieldsPadding.right);
        let maxImgHeight = this.blockLogo.height - (this.fieldsPadding.top + this.fieldsPadding.bottom + this.fontSizes.labels);

        let scaleX = maxImgWidth / fields.logo.width;
        let scaleY = maxImgHeight / fields.logo.height;
        let scale = scaleX < scaleY ? scaleX : scaleY;

        let scaledImgWidth = fields.logo.width * scale,
            scaledImgHeight = fields.logo.height * scale;

        let imgPosX = (this.blockLogo.x + this.fieldsPadding.left) + ((this.blockLogo.width - (this.fieldsPadding.left + this.fieldsPadding.right)) - scaledImgWidth) * 0.5,
            imgPosY = this.blockLogo.y + this.fieldsPadding.top + this.fontSizes.labels * 0.5;

        this.pdf.saveGraphicsState();

        if(['svg', 'png', 'jpg', 'jpeg'].indexOf(fields.logo.ext) > -1){
            this.addImage(
                fields.logo.b64,
                fields.logo.ext,
                
                imgPosX,
                imgPosY,
                
                scaledImgWidth,
                scaledImgHeight
            );
        }
    }
    
    // Блок с назаванием чертежа - this.blockTitle
    if(fields.title) {
        this.pdf.saveGraphicsState();
        this.pdf.setFontSize(this.fontSizes.title);
        this.pdf.text(fields.title, this.blockTitle.x + this.fieldsPadding.left, this.blockTitle.y + 0.5 * this.blockTitle.height, {baseline: 'middle'});
        this.pdf.restoreGraphicsState();
    }

    // Блок с автором - this.blockAuthor
    if(fields.author) {
        this.pdf.saveGraphicsState();
        this.pdf.setFontSize(this.fontSizes.author);
        this.pdf.text(fields.author, this.blockAuthor.x + this.fieldsPadding.left, this.blockAuthor.y + 0.5 * this.blockAuthor.height, {baseline: 'middle'});
        this.pdf.restoreGraphicsState();
    }
        
    // Блок с Датой - this.blockDate
    if(fields.date) {
        this.pdf.saveGraphicsState();
        this.pdf.setFontSize(this.fontSizes.date);
        this.pdf.text(fields.date, this.blockDate.x + this.fieldsPadding.left, this.blockDate.y + 0.5 * this.blockDate.height, {baseline: 'middle'});
        this.pdf.restoreGraphicsState();
    }


    // Блок с Постраничкой - this.blockPages
    if(fields.pages) {
        this.pdf.saveGraphicsState();
        this.pdf.setFontSize(this.fontSizes.pages);
        this.pdf.text(fields.pages, this.blockPages.x + this.fieldsPadding.left, this.blockPages.y + 0.5 * this.blockPages.height, {baseline: 'middle'});
        this.pdf.restoreGraphicsState();
    }

}

/** Устновить значение поля для одного из основных полей (кроме логотипа) */
FramePdf.prototype.setFieldData = function(fieldName, value){

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    if(['title', 'author', 'date', 'pages'].indexOf(fieldName) > -1) {
        
        let sizesBlockName = 'block' + capitalizeFirstLetter(fieldName);

        this.pdf.saveGraphicsState();
        this.pdf.setFontSize(this.fontSizes[fieldName]);
        this.pdf.text(value, this[sizesBlockName].x + this.fieldsPadding.left, this[sizesBlockName].y + 0.5 * this[sizesBlockName].height, {baseline: 'middle'});
        this.pdf.restoreGraphicsState();
    }

}


/** Перейти на контекст страницы с номером */
FramePdf.prototype.setPage = function(pageNum){
    this.pdf.setPage(pageNum);
}

/** Получить размеры и положение зоны внутри рамки */
FramePdf.prototype.__getFrameBounding = function(orientation){
    // Размеры листа А4 в зависимости от ориентации
    let szA4 = orientation ? this.a4[orientation] : this.a4[this.orientation];

    return {
        x: this.padding.left,
        y: this.padding.top,
        width: szA4.width - (this.padding.left + this.padding.right),
        height: szA4.height - (this.padding.top + this.padding.bottom)
    };
}

/** Получить размеры и положение зоны для возможного размещения чертежей, с учетом блока основных записей в нижнем правом углу */
FramePdf.prototype.getEffectiveBounding = function(orientation, partOfPage){
    // Часть страницы от которой нужно определить максимальный размер зоны
    partOfPage = partOfPage ? partOfPage : 'effective';

    // Размеры листа А4 в зависимости от ориентации
    let szA4 = orientation ? this.a4[orientation] : this.a4[this.orientation];

    if(partOfPage === 'effective'){
        return {
            x: this.padding.left,
            y: this.padding.top,
            width: szA4.width - (this.padding.left + this.padding.right),
            height: szA4.height - (this.padding.top + this.padding.bottom) - this.titleBlock.height,
            maxX: szA4.width,
            maxY: szA4.height
        };
    }
    else if(partOfPage === 'fullframe'){
        return {
            x: this.padding.left,
            y: this.padding.top,
            width: szA4.width - (this.padding.left + this.padding.right),
            height: szA4.height - (this.padding.top + this.padding.bottom),
            maxX: szA4.width,
            maxY: szA4.height
        };
    }
    else if(partOfPage === 'fullpage'){
        return {
            x: 0,
            y: 0,
            width: szA4.width,
            height: szA4.height,
            maxX: szA4.width,
            maxY: szA4.height
        };
    }
}


/** Получить коэффициент масштабирования для зоны эффективного отображения чертежа */
FramePdf.prototype.getScaleFactor = function(srcDrwWidht, srcDrwHeight, orientation, partOfPage){
    partOfPage = partOfPage ? partOfPage : 'effective'; // effective || fullframe || fullpage

    let effectiveBounding = this.getEffectiveBounding(orientation, partOfPage);

    let scaleX = effectiveBounding.width / srcDrwWidht;
    let scaleY = effectiveBounding.height / srcDrwHeight;
    let scale = scaleX < scaleY ? scaleX : scaleY;

    return scale;
}


/** Генерирует рамку для всего документа */
FramePdf.prototype.addFrame = function(){
    // Основная рамка
    this.__addMainFrame();
    

    // Рамка в правом нижем углу - осноные надписи
    this.__addTitleBlock();

    // Добавить метки к основным надписям
    this.__addTitleBlockLabels();

    // Добавить метку источника данных URL
    this.__addSourceSiteLink();
}

/** Добавляет SVG в документ */
FramePdf.prototype.addSvg = function(svgText, ops){
    return this.pdf.svg(svgText, {
        x: ops.x,
        y: ops.y,
        width: ops.width,
        height: ops.height
    });
}

/** Добавляет страницу в документ */
FramePdf.prototype.addPage = function(format, orientation){
    this.pdf.addPage(format, orientation);
}

/** Сохраняет документ */
FramePdf.prototype.save = function(filePath, ops){
    // Удалим заглавную страницу, т.к. все равно пока пустая (потом можно сгенерировать титульный лист)
    this.deletePage(1);

    return this.pdf.save(filePath, ops);
}

/** Удалить страницу */
FramePdf.prototype.deletePage = function(targetPage){
    this.pdf.deletePage(targetPage);
}


/** Установим данные для Главной страницы и сгенерируем ее представления */
FramePdf.prototype.setTitlePageData = function(fields){
    // Добавить страницу, которая будет использоваться как титульная
    this.addPage(this.docPdf.format, this.orientation);

    // Добавить рамку на страницу
    this.__addMainFrame();

    // Рамзмеры внутри рамки
    let bounding = this.getEffectiveBounding(this.orientation, 'fullframe');
    
    // Размеры блока для создания титульного листа
    let lastY = 0,
        deltaY = this.fontSizes.header / (72 / 25.4) * 1.3;
    let maxHeaderBlockWidth = 120;

    // Название проекта
    if(fields.header){
        this.pdf.saveGraphicsState();
        
        this.pdf.setFontSize(this.fontSizes.header);
        
        // Разбиваем текст на части, для переноса слов
        let splitHeader = this.pdf.splitTextToSize(fields.header, maxHeaderBlockWidth);
        
        let posX = bounding.x + bounding.width * 0.5,
            posY = bounding.y + bounding.height * (1/3);
        for(let i = 0, li = splitHeader.length; i < li; i++){
            this.pdf.text(
                splitHeader[i],
                
                posX,
                posY,
                
                {baseline: 'bottom', align: 'center'}
            );
            posY += deltaY;
        }
        
        lastY = posY;

        this.pdf.restoreGraphicsState();
    }

    // Логотип
    if(fields.logo) {
        let maxImgWidth = maxHeaderBlockWidth;
        let maxImgHeight = 50;

        let scaleX = maxImgWidth / fields.logo.width;
        let scaleY = maxImgHeight / fields.logo.height;
        let scale = scaleX < scaleY ? scaleX : scaleY;

        let scaledImgWidth = fields.logo.width * scale,
            scaledImgHeight = fields.logo.height * scale;

        let imgPosX = bounding.x + (bounding.width - scaledImgWidth) * 0.5,
            imgPosY = lastY;

        this.pdf.saveGraphicsState();

        if(['svg', 'png', 'jpg', 'jpeg'].indexOf(fields.logo.ext) > -1){
            this.addImage(
                fields.logo.b64,
                fields.logo.ext,
                
                imgPosX,
                imgPosY,
                
                scaledImgWidth,
                scaledImgHeight
            );
        }

        lastY += (scaledImgHeight + deltaY);

        this.pdf.restoreGraphicsState();
    }

    // Автор проекта
    if(fields.author) {
        this.pdf.saveGraphicsState();
        
        this.pdf.setFontSize(0.5 * this.fontSizes.header );
        
        // Разбиваем текст на части, для переноса слов
        let splitAuthor = this.pdf.splitTextToSize(fields.author, maxHeaderBlockWidth);
        
        let posX = bounding.x + bounding.width * 0.5,
            posY = lastY;
        for(let i = 0, li = splitAuthor.length; i < li; i++){
            this.pdf.text(
                splitAuthor[i],
                
                posX,
                posY,
                
                {baseline: 'bottom', align: 'center'}
            );
            posY += 0.5 * this.fontSizes.header / (72 / 25.4) * 1.3;
        }
        
        lastY = posY + deltaY;

        this.pdf.restoreGraphicsState();
    }

    // Дата/Год
    if(fields.date) {
        this.pdf.saveGraphicsState();
        
        this.pdf.setFontSize(0.5 * this.fontSizes.header );
        
        this.pdf.text(
            fields.date,
            
            bounding.x + bounding.width * 0.5,
            lastY,
            
            {baseline: 'bottom', align: 'center'}
        );
        
        lastY += deltaY;

        this.pdf.restoreGraphicsState();
    }



    // QR-код со ссылкой на расчет
    if(fields.qrData){
        this.pdf.saveGraphicsState();

        /** Костыль синхронность */
        // >>>>>>>>>>>>>>>>>>>>>>>
        let qrData = null;
        QRCode.toDataURL(fields.qrData, function (err, url) {
            qrData = url;
        });

        // Ожидаем когда QR будет сгенерирован
        var iterationCounter = 0,
            maxIterations = 1e3;
        while(!qrData && maxIterations < iterationCounter){
            iterationCounter++;
        }
        // <<<<<<<<<<<<<<<<<<<<<<<

        // Если QR сгенерировался, добавим его в документ
        if(qrData){
            let qrWidth = 25,
                qrHeight = 25;

            this.addImage(
                qrData,
                'png',
                
                bounding.x + bounding.width - qrWidth - 2,
                bounding.y + bounding.height - qrHeight - 2,
                
                qrWidth,
                qrHeight
            );
        }
        

        this.pdf.restoreGraphicsState();
    }
}


/** Добавить изображение */
FramePdf.prototype.addImage = function(data, ext, x, y, width, height){
    this.pdf.addImage(
        data,
        ext,
        
        x,
        y,
        
        width,
        height
    );
}


/** Получить контекст pdf */
FramePdf.prototype.getContextJsPdf = function(){
    return this.pdf;
}


/** Добавление таблицы */
FramePdf.prototype.autoTable = function(data){
    this.pdf.autoTable(data);
}

/** Добавление таблицы */
FramePdf.prototype.output = function(data){
    return this.pdf.output(data);
}
