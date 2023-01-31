/** Системные модули */
import React from 'react'

/** Кастомные модули */
import { cls } from './Utils'
import Loader from './Loader'

/** Стили */
import './Utils.scss';


function AppLock({ total }) {
    return (
        <div className={cls('app-lock')}>
            <Loader />
        </div>
    );
}

export default AppLock