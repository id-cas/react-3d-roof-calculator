/** Системные модули */
import React from "react";
import I18N from '../../global/i18n/I18N';

import Select from 'react-select';

/** Кастомные модули */
import Context from "../../Context";
import { cls } from '../utils/Utils'

import Tab from './Tab'

/** Стили */
import './RoofParams.scss';


// https://react-select.com/
const colorStyles = {
	control: styles => ({ ...styles, backgroundColor: 'white' }),
	option: (styles, { data, isDisabled, isFocused, isSelected }) => {
	  return {
		...styles,
		backgroundColor: isSelected ? '#ddf2fc' : data.color,
		color: isSelected ? '#2D647F' : data.color,
		':active': {
		  ...styles[':active'],
		  backgroundColor: '#ddf2fc',
		},
	  };
	}
  };


function FieldSelectSheetLength({param, id}){
	const { setRoofSheetLength } = React.useContext(Context);

	return (
		<div className={cls('field')}>
			<label  className={cls('field-label')} htmlFor={param.type + 'param.type' + id}>{param.title}</label>
			<Select 
				id={param.type + 'param.type' + id}
				key={id}
				defaultValue={param.options[0]}
				options={param.options}
				onChange={(selectedOptions) => {
					setRoofSheetLength(selectedOptions.value);
				}}
				styles={colorStyles}
				theme={theme => ({
					...theme,
					colors: {
					...theme.colors,
					primary: '#c3e7f9',
					},
				})}
			/>
		</div>
	);
}


function FieldSelectBeamsTypes({param, id}){
	const { setBeamsTypes } = React.useContext(Context);

	return (
		<div className={cls('field')}>
			<label  className={cls('field-label')} htmlFor={param.type + 'param.type' + id}>{param.title}</label>
			<Select 
				id={param.type + 'param.type' + id}
				key={id}
				defaultValue={param.options[0]}
				options={param.options}
				onChange={(selectedOptions) => {
					setBeamsTypes(selectedOptions.value);
				}}
				styles={colorStyles}
				theme={theme => ({
					...theme,
					colors: {
					...theme.colors,
					primary: '#c3e7f9',
					},
				})}
			/>
		</div>
	);
}


function RoofParams({pos, type}){
	const { lang, setAngleIsDefined, roofParams, roofSheetsParams, beamsTypesParams } = React.useContext(Context);
	const i18n = new I18N(lang);

	const [angleDefined, setAngleDefined] = React.useState(false);

	function setAngleDefinedState(state){
		setAngleDefined(state);
		setAngleIsDefined(state);
	}

    return(
		<section className={cls('wh-box')}>
			<div className={cls('wh-box-title')}>{pos}.&nbsp;{i18n.tr('input.select-roof-params-title')}</div>

			<div className={cls('wh-box-content')}>
				<div className={cls('params-roof')}>
					<div className={cls('params-roof-subtitle')}>{i18n.tr('input.roof-angle-defined-question')}</div>

					<div className={cls('tabs')}>
						<div className={cls('tabs-wrap')}>
							<div className={cls('tabs-navi')}>
								<button className={cls('tab' + (angleDefined ? '' : ' tab-active'))} onClick={() => { setAngleDefinedState(false); }}>
									<span>{i18n.tr('input.roof-angle-undefined')}</span>
									<strong>{i18n.tr('input.roof-angle-undefined-short')}</strong>
								</button>

								<button className={cls('tab' + (!angleDefined ? '' : ' tab-active'))} onClick={() => { setAngleDefinedState(true); }}>
									<span>{i18n.tr('input.roof-angle-defined')}</span>
									<strong>{i18n.tr('input.roof-angle-defined-short')}</strong>
								</button>
							</div>
						</div>

						<div className={cls('tabs-content')}>
							<Tab params={roofParams} type={type} angleDefined={angleDefined}/>
						</div>

						{/* Beams material:  */}
						<div className={cls('fieldset')}>
							{Object.keys(beamsTypesParams).map(id => {
								let param = beamsTypesParams[id];
								if(param.type === 'select'){
									return <FieldSelectBeamsTypes key={id} param={JSON.parse(JSON.stringify(param))} id={id}/>
								}
								return null;
							})}
						</div>

						{/* Roof sheets sizes:  */}
						<div className={cls('fieldset')}>
							{Object.keys(roofSheetsParams).map(id => {
								let param = roofSheetsParams[id];
								if(param.type === 'select'){
									return <FieldSelectSheetLength key={id} param={JSON.parse(JSON.stringify(param))} id={id}/>
								}
								return null;
							})}
						</div>
					</div>

				</div>


        	</div>
		</section>
	);
	
}


export default RoofParams
