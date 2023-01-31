import Cookies from 'js-cookie'
import {decode as base64_decode, encode as base64_encode} from 'base-64';

export function setCookie64(cookieName, str, ops) {
    ops = ops || {};
    
    if(!ops.path){
        ops.path = '/';
    }

    if(!ops.expires){
        let d = new Date();
        d.setTime(d.getTime() + 365 * 24 * 60 * 1000);
        ops.expires = d;
    }


    str = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    })

    try {
        Cookies.set(cookieName, base64_encode(str), ops);
    }
    catch(e){
        console.warn('Invalid cookies write data');
    }
}

export function getCookie64(cookieName) {
    let str64 = Cookies.get(cookieName);
    if(!str64){
        return '';
    }

    try {
        let str = base64_decode(str64);
        return decodeURIComponent(str.split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
    catch(e){
        console.warn('Invalid cookies read data');
        return '';
    }
}

export function remCookie64(cookieName) {
    return Cookies.remove(cookieName);;
}