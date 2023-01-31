/** Системные модули */
import React from "react";


/** Кастомные модули */
import Context from "../../Context";
import { cls } from '../utils/Utils';

/** Переводы */
import I18N from '../../global/i18n/I18N';
import User from '../../global/users/User';


import Scene2DView from '../../assets/js/win/2d/Scene2DView';


// Уникальный идентификатор
const uniqid = require('uniqid');
const win2DWrapId = '__xr-win2d-wrp-' + uniqid();

let viewer2D = null;


class Scene2D extends React.Component {

	static contextType = Context;
	static i18n = null;
	static user = null;

	// // State before component mounting
	// componentWillMount () {
	// 	const lang = this.context.lang;
	// 	this.i18n = new I18N(lang);
	// }

	// Language translation detect
	i18n = new I18N(this.context.lang);

	// Пользователь
	user = new User();


	// Component mounted
	componentDidMount () {
		// Инициализируем библиотеку работы с 2D
		viewer2D = new Scene2DView();
		viewer2D.init({
			i18n: this.i18n,
			user: this.user,
			winWrapId: win2DWrapId
		});

		this.context.scene2DMounted(this.refresh);

		// Передадим контекст Просмотрищика в основное приложения
		this.context.api('viewer2D', viewer2D);
    }

	refresh (data, calcName) {
		// console.log('Scene2D refresh');
		viewer2D.updateScene(data, calcName);
	}

    render() {
		return(
			<section className={cls('wh-box wh-box-mt anim-op')}>
				<div className={cls('wh-box-title')}>{this.props.pos && <span>{this.props.pos}.&nbsp;</span>}{this.i18n.tr('section.2D-title')}</div>
				<div id={win2DWrapId} className={cls('win2d-wrp')}>
					{/* There will be 3D interaface based on native JS */}
				</div>
			</section>
		)
  }
}

export default Scene2D

