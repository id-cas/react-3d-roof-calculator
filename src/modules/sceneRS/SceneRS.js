/** Системные модули */
import React from "react";


/** Кастомные модули */
import Context from "../../Context";
import { cls } from '../utils/Utils';

/** Переводы */
import I18N from '../../global/i18n/I18N';
import User from '../../global/users/User';


// const SceneRSConstruct = require('./assets/js/SceneRSConstruct');
import SceneRSView from '../../assets/js/win/results/SceneRSView';


// Уникальный идентификатор
const uniqid = require('uniqid');
const winRSWrapId = '__xr-winRs-wrp-' + uniqid();

let viewerRS = null;


class SceneRS extends React.Component {

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
		viewerRS = new SceneRSView();
		viewerRS.init({
			i18n: this.i18n,
			user: this.user,
			winWrapId: winRSWrapId
		});

		this.context.sceneRSMounted(this.refresh);

		// Передадим контекст Просмотрищика в основное приложение
		this.context.api('viewerRS', viewerRS);
    }

	refresh (data, calcName) {
		// console.log('SceneRS refresh');
		viewerRS.updateScene(data, calcName);
	}

    render() {
		return(
			<section className={cls('wh-box wh-box-mt anim-op')}>
				<div className={cls('wh-box-title')}>{this.props.pos && <span>{this.props.pos}.&nbsp;</span>}{this.i18n.tr('section.RS-title')}</div>
				<div id={winRSWrapId} className={cls('win3d-wrp')}>
					{/* There will be 3D interaface based on native JS */}
				</div>
			</section>
		)
  }
}

export default SceneRS

