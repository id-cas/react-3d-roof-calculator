/** Системные модули */
import React from 'react'

/** Кастомные модули */
import { cls } from './Utils'

/** Стили */
import './Utils.scss';


function Loader({ total }) {
    return (
        <div className={cls('loader-roller')}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    );
}

export default Loader