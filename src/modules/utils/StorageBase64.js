import {decode as base64_decode, encode as base64_encode} from 'base-64';

export function setStorage64(storageName, data) {

    let type = 'string';
    if (typeof data == 'object' && data !== null){
        type = 'object';
        data = JSON.stringify(data);
    }

    let storingData = {
        type: type,
        data: data
    };
    
    try {
        storingData = JSON.stringify(storingData);

        storingData = encodeURIComponent(storingData).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        })

        localStorage.setItem(storageName, base64_encode(storingData));
    }
    catch(e){
        console.warn('No Local Storage avaliable');
    }
}


export function getStorage64(storageName) {

    let storedString = localStorage.getItem(storageName);
    if(!storedString){
        return '';
    }

    try {
        storedString = base64_decode(storedString);
        storedString = decodeURIComponent(storedString.split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        let storedData = JSON.parse(storedString);

        if(storedData.type && storedData.type === 'string'){
            return storedData.data;
        }

        else if(storedData.type && storedData.type === 'object'){
           return JSON.parse(storedData.data);
        }
        
        else {
            return '';
        }
        
    }
    catch(e){
        console.warn('Invalid Local Storage data');
        return '';
    }
}

export function remStorage64(storageName) {
    return localStorage.removeItem(storageName);
}