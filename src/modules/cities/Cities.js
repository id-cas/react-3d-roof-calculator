/** Системные модули */
import React from "react";

/** Кастомные модули */
import { cls } from '../utils/Utils'

/** Стили */
import './Cities.scss';

/** Переводы */
import I18N from '../../i18n/I18N';

function Cities({lang}){
	const i18n = new I18N(lang);
	
    return(
        <header className={cls('header')}>
			<div className={cls('container')}>
				<div className={cls('header-wrap')}>
					{/* <div className={cls('choice-city')}>
						<span>{i18n.tr('cities.header-city')}:</span>&nbsp;
						<a href="/">{i18n.tr('cities.header-default-city')}</a>
					</div> */}

					<a className={cls('btn-close')} href="/" data-target="#js--dialog-close">{i18n.tr('cities.header-close')}</a>
					<a className={cls('btn-close-city')} href="/">{i18n.tr('cities.header-oollapse')}</a>
				</div>
			</div>
		</header>
	);
	
}


export default Cities
