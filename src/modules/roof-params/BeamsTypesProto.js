/** Custom modules */
import I18N from '../../global/i18n/I18N';


export default function BeamsTypesProto(){}


BeamsTypesProto.prototype.get = function(lang){
    const i18n = new I18N(lang);

    return  {
        beamsTypes: {
            title: i18n.tr('input.beams-types'),
            type: 'select',
            unit: '',
            selected: 0,
            options: [
                {
                    value: 'metal',
                    label: i18n.tr('glob.metal-beam')
                },
                {
                    value: 'wood',
                    label: i18n.tr('glob.wood-beam')
                },
                {
                    value: 'concrete',
                    label: i18n.tr('glob.concrete-beam')
                }
            ]
        }
    };
}