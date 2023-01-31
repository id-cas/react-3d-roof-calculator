/** Custom modules */
import I18N from '../../global/i18n/I18N';


export default function RoofSheetsParamsProto(){}


RoofSheetsParamsProto.prototype.get = function(lang){
    const i18n = new I18N(lang);

    // return  {
    //     sheetLength: {
    //         title: i18n.tr('input.roof-sheets-param-length'),
    //         type: 'select',
    //         unit: i18n.tr('glob.unit-m'),
    //         selected: 0,
    //         options: [
    //             // {
    //             //     value: 'auto',
    //             //     label: i18n.tr('input.auto-size')
    //             // },
    //             {
    //                 value: 1.750,
    //                 label: 1750 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 2.100,
    //                 label: 2100 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 2.450,
    //                 label: 2450 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 2.800,
    //                 label: 2800 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 3.150,
    //                 label: 3150 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 3.500,
    //                 label: 3500 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 3.850,
    //                 label: 3850 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 4.200,
    //                 label: 4200 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 4.550,
    //                 label: 4550 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 4.900,
    //                 label: 4900 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 5.250,
    //                 label: 5250 + ' ' + i18n.tr('glob.unit-mm')
    //             },


    //             {
    //                 value: 5.600,
    //                 label: 5600 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 5.950,
    //                 label: 5950 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 6.300,
    //                 label: 6300 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 6.650,
    //                 label: 6650 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 7.000,
    //                 label: 7000 + ' ' + i18n.tr('glob.unit-mm')
    //             },
    //             {
    //                 value: 7.350,
    //                 label: 7350 + ' ' + i18n.tr('glob.unit-mm')
    //             }
    //         ]
    //     }
    // };

    return  {
        sheetLength: {
            title: i18n.tr('input.roof-sheets-param-length'),
            type: 'select',
            unit: i18n.tr('glob.unit-m'),
            selected: 0,
            options: [
                // {
                //     value: 'auto',
                //     label: i18n.tr('input.auto-size')
                // },
                {
                    value: 0,
                    label: 1750 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 1,
                    label: 2100 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 2,
                    label: 2450 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 3,
                    label: 2800 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 4,
                    label: 3150 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 5,
                    label: 3500 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 6,
                    label: 3850 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 7,
                    label: 4200 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 8,
                    label: 4550 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 9,
                    label: 4900 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 10,
                    label: 5250 + ' ' + i18n.tr('glob.unit-mm')
                },


                {
                    value: 11,
                    label: 5600 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 12,
                    label: 5950 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 13,
                    label: 6300 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 14,
                    label: 6650 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 15,
                    label: 7000 + ' ' + i18n.tr('glob.unit-mm')
                },
                {
                    value: 16,
                    label: 7350 + ' ' + i18n.tr('glob.unit-mm')
                }
            ]
        }
    };
}