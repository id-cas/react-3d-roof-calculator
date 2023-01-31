/** Системные модули */
import React from "react";

/** Кастомные модули */
import Context from "../../Context";
import { cls } from '../utils/Utils';
import InputParam from './InputParam';


/** Стили */
import './RoofParams.scss';


function Tab({ params, type, angleDefined }){
	const { setRoofParams } = React.useContext(Context);

	if(typeof params[type] === 'undefined'){
		return(
			<div>No configuration</div>
		);
	}


	const angleDef = angleDefined ? 'withangle' : 'noangle';
	const angleDefRev = !angleDefined ? 'withangle' : 'noangle';

	return(
		<div className={cls('row')}>
			
			{/* Пройдемся по всем проекциям */}
			{Object.keys(params[type][angleDef]).map(plane => {
				
				return (
					<div key={plane + '-' + angleDef} className={cls('col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 text-center')}>
						<div className={cls('box-item')}>
							<img src={params[type][angleDef][plane].img} alt="" className={cls('img-fluid')} />

							{Object.keys(params[type][angleDef][plane].sizes).map(size => {
								return <InputParam 
										key={plane + '-' + size + '-' + angleDef} 
										param={params[type][angleDef][plane].sizes[size]}
										paramRev={params[type][angleDefRev][plane].sizes[size]}
										onChange={() => {  setRoofParams(params); }}/>;
							})}
						</div>
					</div>
				);
			})}

		</div>
	);
	
}


export default Tab;
