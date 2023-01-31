/** Системные модули */
import React from "react";

/** Кастомные модули */
import Context from "../../Context";
import { cls } from '../utils/Utils'
import RoofTypeItem from './RoofTypeItem'

/** Стили */
import './RoofType.scss';

/** Переводы */
import I18N from '../../global/i18n/I18N';


function RoofType({pos, roofTypes}){
	const { lang, roofTypeChange } = React.useContext(Context);
	const i18n = new I18N(lang);

    return(
		<section className={cls('wh-box')}>
			<div className={cls('wh-box-title')}>{pos}.&nbsp;{i18n.tr('input.select-roof-type-title')}</div>

			<div className={cls('wh-box-content')}>
				<div className={cls('row align-items-center justify-content-center')}>
					{roofTypes.map((item) => {
						return <RoofTypeItem key={item.id} id={item.id} title={item.title} img={item.img} selected={item.selected} onChange={roofTypeChange}/>
					})}
				</div>
        	</div>
		</section>
	);
	
}


export default RoofType
