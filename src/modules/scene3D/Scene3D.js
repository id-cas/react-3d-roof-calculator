/** Системные модули */
import React from "react";


/** Кастомные модули */
import Context from "../../Context";
import { cls } from '../utils/Utils';

/** Переводы */
import I18N from '../../global/i18n/I18N';
import User from '../../global/users/User';


// const Scene3DConstruct = require('./assets/js/Scene3DConstruct');
import Scene3DView from '../../assets/js/win/3d/Scene3DView';


// Уникальный идентификатор
const uniqid = require('uniqid');
const win3DWrapId = '__xr-win3d-wrp-' + uniqid();

let viewer3D = null;


class Scene3D extends React.Component {

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
		// Инициализируем библиотеку работы с 3D
		viewer3D = new Scene3DView();
		viewer3D.init({
			i18n: this.i18n,
			user: this.user,
			winWrapId: win3DWrapId
		});

		this.context.scene3DMounted(this.refresh);

		// Передадим контекст Просмотрищика в основное приложение
		this.context.api('viewer3D', viewer3D);
    }

	refresh (data, calcName) {
		// console.log('Scene3D refresh');
		viewer3D.updateScene(data, calcName);
	}

    render() {
		return(
			<section className={cls('wh-box wh-box-mt anim-op')}>
				<div className={cls('wh-box-title')}>{this.props.pos && <span>{this.props.pos}.&nbsp;</span>}{this.i18n.tr('section.3D-title')}</div>
				<div id={win3DWrapId} className={cls('win3d-wrp')}>
					{/* There will be 3D interaface based on native JS */}
				</div>
			</section>
		)
  }
}

export default Scene3D

