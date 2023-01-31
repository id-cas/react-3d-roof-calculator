/** Системные модули */
import React from "react";

/** Кастомные модули */
import { cls } from '../utils/Utils'

/** Стили */
import './RoofType.scss';

function RoofTypeItem({id, title, img, selected, onChange}){
	id = 'xr-type-' + id;

    return(
		<div className={cls('col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3')}>
			<div className={cls('radio-item')}>
				<label className={cls('radio-item-label')} htmlFor={id}>
					<input type="radio" id={id} name='roof-types' checked={!!selected} onChange={onChange}/>
					<span className={cls('radio-item-pic')}>
						<img src={img} alt={title} className={cls('img-fluid')} />
					</span>
					<span className={cls('radio-item-title')}>{title}</span>
				</label>
			</div>
		</div>
	);
	
}

export default RoofTypeItem
