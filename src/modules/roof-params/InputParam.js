/** Системные модули */
import React from "react";

/** Кастомные модули */
import { cls } from '../utils/Utils'
// import RoofTypeItem from './RoofTypeItem'

/** Стили */
import './RoofParams.scss';


function position(param){
	return {
		top: param.pos.top ? param.pos.top : 'auto',
		left: param.pos.left ? param.pos.left : 'auto',
		right: param.pos.right ? param.pos.right : 'auto',
		bottom: param.pos.bottom ? param.pos.bottom : 'auto'
	};
}


function InputParam({ param, paramRev, onChange }){

	const [fieldError, setFieldError] = React.useState(false);

	return(
		<div className={cls('form-box' + (fieldError ? ' form-box-error' : ''))} style={position(param)}>
			<input
				type="number"
				defaultValue={param.val}
				onChange={(event) => {
					if(event.target.value <= param.min || event.target.value >= param.max){
						setFieldError(true);
						return;
					}
					setFieldError(false);

					param.val = parseFloat(event.target.value);

					// Для вида сверху обновляем значения полей для "реверсной" версии (угол !не угол)
					if(typeof paramRev !== 'undefined'){
						paramRev.val = param.val;
					}

					onChange(param);
				}} />
			<span>{param.unit}</span>
		</div>
	);
	
}


export default InputParam
