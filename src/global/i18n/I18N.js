
// export default function I18N(lang){
// 	this.translations = require('./translations/' + lang + '.json');
// }

export default function I18N(langData){
	this.translations = langData;
}

I18N.prototype.tr = function(label){
    if(this.translations[label]){
        return this.translations[label];
    }

    return label.replace(/^.*?\./, '');
    // return 'i18n.' + label;
}