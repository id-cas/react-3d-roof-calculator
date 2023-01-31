/** System modules */
import React from "react";
import Context from "./Context";



/** Styles */
import './assets/scss/common.scss';


/** Custom modules */
import { cls } from './modules/utils/Utils';
import useWindowSize from "./modules/utils/useWindowSize";

// import Cities from './modules/cities/Cities';
import RoofType from './modules/roof-type/RoofType';
import RoofParams from './modules/roof-params/RoofParams';
import Scene3D from './modules/scene3D/Scene3D';
import Scene2D from './modules/scene2D/Scene2D';
import SceneRS from './modules/sceneRS/SceneRS';
// import { create3D } from './modules/scene3D/Scene3D';
import FramePdf from './assets/js/pdf/FramePdf';

import socketIOClient from 'socket.io-client';
import I18N from './global/i18n/I18N';
import User from './global/users/User';

import RoofParamsProto from './modules/roof-params/RoofParamsProto';
import RoofSheetsParamsProto from './modules/roof-params/RoofSheetsParamsProto';
import BeamsTypesProto from './modules/roof-params/BeamsTypesProto';


/** Socket for calculation server connection */
const ENDPOINT = 'https://node-2.kalk.pro/';
// const ENDPOINT = 'https://node-3.kalk.pro/';

/** Translations */
// const lang = 'en';	// Depricated

const fetch = require('sync-fetch');
const lang = fetch(process.env.PUBLIC_URL + '/i18n/actual.json?t=' + Date.now(), {headers : {'Content-Type': 'application/json', 'Accept': 'application/json'}}).json();
const i18n = new I18N(lang);


/** Установки пользователя */
const user = new User();

/** Data types */
const roofParamsProto= new RoofParamsProto();
const roofSheetsParamsProto= new RoofSheetsParamsProto();
const beamsTypesProto= new BeamsTypesProto();


// Уникальный просмотрщика
const uniqid = require('uniqid');
const win3DWrapId = '__xr-win3d-wrp-' + uniqid();
const win2DWrapId = '__xr-win2d-wrp-' + uniqid();
const winRSWrapId = '__xr-winRS-wrp-' + uniqid();


/** Async fonts loading to page */
function loadFonts() {
	const linkPre = document.createElement('link');
    linkPre.rel = 'preconnect';
    linkPre.href = 'https://fonts.gstatic.com';

	const linkRobo = document.createElement('link');
    linkRobo.rel = 'stylesheet';
    linkRobo.href = 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap';

	const head = document.getElementsByTagName('head')[0];
	head.appendChild(linkPre);
	head.appendChild(linkRobo);
}


/** Single load detector */
let isMounted = false;

// Результат расчета
let calcData = {};

// Видимая на все приложение функция (указатель на функцию в компоненте Scene3D.js -> refresh() куда отправляются данные
// для отрисовки 3Д сцены)
let scene3DRefreshFunc = null;
let scene2DRefreshFunc = null;
let sceneRSRefreshFunc = null;

function App() {


	const roofTypesProto = [
		{
			id: 'pent',
			calcId: 'materialsPentRoof',title: i18n.tr('input.roof-type-pent'),
			img: require('./public/resources/images/roof-types/pent.png').default.replace(/^\./, ''),
			selected: true
		},
		{
			id: 'gable',
			calcId: 'materialsGableRoof',
			title: i18n.tr('input.roof-type-gable'),
			img: require('./public/resources/images/roof-types/gable.png').default.replace(/^\./, ''),
			selected: false
		},
		// {
		// 	id: 'french',
		// 	calcId: 'materialsFrenchRoof',
		// 	title: i18n.tr('input.roof-type-french'),
		// 	img: require('./public/resources/images/roof-types/french.svg').default.replace(/^\./, ''),
		// 	selected: false
		// },
		// {
		// 	id: 'hip',
		// 	calcId: 'materialsHipRoof',
		// 	title: i18n.tr('input.roof-type-hip'),
		// 	img: require('./public/resources/images/roof-types/hip.svg').default.replace(/^\./, ''),
		// 	selected: false
		// }
	];
	

	
	// Interface state
	const [roofType, setRoofType] = React.useState('pent');
	const [roofAngleDefined, setAngleIsDefined] = React.useState(false);
	const [roofTypes, setRoofTypes] = React.useState(roofTypesProto);
	
	const [roofParams, setRoofParams] = React.useState(roofParamsProto.get(lang));
	const [roofSheetsParams, setRoofSheetsParams] = React.useState(roofSheetsParamsProto.get(lang));
	const [beamsTypesParams, setBeamTypesParams] = React.useState(beamsTypesProto.get(lang));
	
	const [roofSheetLength, setRoofSheetLength] = React.useState(roofSheetsParams.sheetLength.options[roofSheetsParams.sheetLength.selected].value);
	const [beamsTypes, setBeamsTypes] = React.useState(beamsTypesParams.beamsTypes.options[beamsTypesParams.beamsTypes.selected].value);


	const [showCalcResults, setCalcResults] = React.useState(false);
	
	const [calcInProgress, setCalcInProgress] = React.useState(false);

	// API взаимодействия между модулями
	const [api, setAPI] = React.useState({});


	// Выполняется единожды при загрузке приложения, единовременный запуск гарантирует переменная isMounted
	React.useEffect(() => {
		if(!isMounted){
			// Link specified fonts
			loadFonts();


			// var scene = new THREE.Scene();
			// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
			// var renderer = new THREE.WebGLRenderer();
			// renderer.setSize( window.innerWidth, window.innerHeight );

			// // Create CANVAS
			// document.body.appendChild( renderer.domElement );

		
			// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			// var material = new THREE.MeshStandardMaterial( { color: 0x7e31eb } );
			// var cube = new THREE.Mesh( geometry, material );
			// scene.add( cube );
			// const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
			// scene.add( light );
			
			// camera.position.z = 2;
			// var animate = function () {
			// 	requestAnimationFrame( animate );
			// 	cube.rotation.x += 0.01;
			// 	cube.rotation.y += 0.01;
			// 	cube.rotation.z += 0.01;
			// 	renderer.render( scene, camera );
			// };

			// animate();

			
		}

		return () => {
		  isMounted = true;
		};

	// eslint-disable-next-line 
	}, []);



	// Change selected roof type
	function roofTypeChange(event){
		const id = event.target.id;
		const type = id.replace(/^xr-type-/, '');

		setRoofTypes(roofTypes.map(item => {
			if(item.id === type){
				setRoofType(type);
				item.selected = true;
			}
			else {
				item.selected = false;
			}

			return item;
		}));
	}



	// Get selected calcId
	function getSelectedCalcId(){
		const type = roofTypes.filter(roof => (roof.id === roofType));
		return type.length ? type[0].calcId : '';
	}

	// Get selected roof params
	function getSelectedRoofParams(){
		return roofParams[roofType][roofAngleDefined ? 'withangle' : 'noangle'];
	}

	// Get sizes for selected roof
	function getSelectedRoofSizes(){
		let selParams = getSelectedRoofParams();

		
		// Accumulate from all plans
		let sizes = {};
		Object.keys(selParams).map(key => {
			
			Object.keys(selParams[key].sizes).map(sizeName => {
				sizes[sizeName] = selParams[key].sizes[sizeName].val;

				// // Clean size data
				// delete sizes[sizeName].min;
				// delete sizes[sizeName].max;
				// delete sizes[sizeName].unit;
				// delete sizes[sizeName].pos;
				
				return null;
			});

			return null;
		});


		return sizes;
	}


	/***************************************
	 * Кросс-компонентный вызов из Scene3D
	 * 
	 */
	function scene3DMounted(refreshFunc){
		// Определим указатель на функцию refreshFunc переданную нам после инициализации компонента scene3D
		// В дальнейшем при получении новых данных расчета будем вызывать сразу scene3DRefreshFunc в контексте App.js
		scene3DRefreshFunc = refreshFunc;

		// Передадим полученные данные в Scene3D
		scene3DRefreshFunc(calcData.s3D, getSelectedCalcId());
	}


	/***************************************
	 * Кросс-компонентный вызов из Scene2D
	 * 
	 */
	 function scene2DMounted(refreshFunc){
		// Определим указатель на функцию refreshFunc переданную нам после инициализации компонента scene2D
		// В дальнейшем при получении новых данных расчета будем вызывать сразу scene2DRefreshFunc в контексте App.js
		scene2DRefreshFunc = refreshFunc;

		// Передадим полученные данные в Scene2D
		scene2DRefreshFunc(calcData.s2D, getSelectedCalcId());
	}


	/***************************************
	 * Кросс-компонентный вызов из Results
	 * 
	 */
	 function sceneRSMounted(refreshFunc){
		// Определим указатель на функцию refreshFunc переданную нам после инициализации компонента Results
		// В дальнейшем при получении новых данных расчета будем вызывать сразу scene2DRefreshFunc в контексте App.js
		sceneRSRefreshFunc = refreshFunc;

		// Передадим полученные данные в Scene2D
		sceneRSRefreshFunc(calcData.res, getSelectedCalcId());
	}



	// Отправим запрос в socket чтобы получить 3D и 2D данные
	function calculate(){
		let reqData = {
			n: getSelectedCalcId(),
			m: {
				sizes: {
					display: {
						units: 2,
						color: 1
					},
					roofAngles: {
						defined: roofAngleDefined ? 1 : 0
					},
					roofSheets: {
						length: roofSheetLength
					},
					beams: {
						type: beamsTypes
					},
					common: getSelectedRoofSizes()
				}
			},
			i18n: { caption: 'https://kalk-pro.ru — Строительные калькуляторы' },
			u: 335,
			tk: { s: 'guest' },
			sr: { disableBlur: false, enableCustomLogo: false },
			pkey: '6n;w:;ly=mF;i4m%,#5C+Ncn=07?HofG'	// Ключ доступа к полным чертежам
		};


		// console.log('---- Request ----');
		// console.log(reqData);
		// console.log('^^^^^^^^^^^^^^^^^');


		const socket = socketIOClient(ENDPOINT, {
			forceJSONP: true,
			transports: ['websocket'],
			timeout: 10000,
			port: 443,
			secure: true
		});


		setCalcInProgress(true);
		socket.emit('calculate', reqData);

		// appLock(true);
		
		socket.on('calculated', resData => {
			setCalcInProgress(false);

			// console.log('---- Response ----');
			// console.log(resData);	
			// console.log('^^^^^^^^^^^^^^^^^');

			
			/** Покажем результаты расчета */
			// Установим глобально свершившийся результат расчета
			calcData = resData;

			// Результаты расчета
			if(showCalcResults  === false){
				// Отобразим результаты расчета в интерфейсе (подгрузим просмотрщик 3D, 2D, Results)
				setCalcResults(true);

				// Теперь ждем, когда просмотрищик загрузится и передадим в него данные для рендеринга
			}
			else {
				scene3DRefreshFunc(calcData.s3D, getSelectedCalcId());
				scene2DRefreshFunc(calcData.s2D, getSelectedCalcId());
				sceneRSRefreshFunc(calcData.res, getSelectedCalcId());
			}
						

			// Плавная перемотка к результатам
			document.getElementById('js-calc-results').scrollIntoView({
				behavior: 'smooth'
			});


			// Закроем сокет
			setTimeout(() => {
				socket.disconnect();
				
				// appLock(false);
			},  1000);
		});
	}


	// Задает доступ к контексту любого из результатов сцены: 3D, 2D, RS
	function initAPI(contextName, context){
		api[contextName] = context;
		setAPI(api);
	}

	// Получить доступ к контексту любой сцены
	function getAPI(){
		return api;
	}


	// Функция инициирует кастомное событие и передает в него данные для формирования корзины.
	// Также актуальные данные будут доступны через глобальный объект window.KalkPro.API
	function clickGetPrice(){
		// Заблокируем интерфейс на пару секунд
		setCalcInProgress(true);
		setTimeout(() => {
			setCalcInProgress(false);
		}, 2000);


		// Доступ к результатам расчета
		const api = getAPI();
		const viewerRS = api['viewerRS'];
		const data = viewerRS.getResultState();

		const viewer3D = api['viewer3D'];

		if(viewer3D){
			let RAL = null;
			let roofMaterialTitle = viewer3D.apiGetSelectedTexture('d3RoofTitle');

			if(roofMaterialTitle){
				let ralMatch = roofMaterialTitle.match(/ral\s?\d{3,4}/gi);

				if(ralMatch.length){
					RAL = ralMatch[0].replace(/\s/g, '').toUpperCase();
				}
			}

			data.roofColor = {
				title: roofMaterialTitle,
				val: RAL
			};
		}
		


		window.KalkPro = {};
		window.KalkPro.API = {};
		window.KalkPro.API.resData = data;
		
		document.dispatchEvent(new CustomEvent('xr-kalkpro-getprice-request', { 
			detail: { 
				elem: 'result',
				data: data
			}
		}));
	}


	// Сохраняет в PDF весь расчет
	// 1. Выбранное представление сцены в 3D
	// 2. Полный набор чертежей
	// 3. Результаты расчета по материалам
	function clickSave(){
		// Проверка наличия подписки у пользователя
		if(!user.subscribed){
			// this.modal.subscribe();
			return false;
		}

		// Для работы метода организуем API для работы с представлениями 3D + 2D + RS
		const api = getAPI();

		const viewer3D = api['viewer3D'];
		const viewer2D = api['viewer2D'];
		const viewerRS = api['viewerRS'];

		// Имя файла
		const date = new Date(); // Or the date you'd like converted.
		const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
		const fileName = 'project_' + isoDateTime.slice(0,19).replace(/(-|T|:)/g,"");


		// Параметры PDF документа
		const pageWidth = 297, pageHeight = 210;
		const pdfFormat = [pageWidth, pageHeight];
		let pdfOrientation = 'landscape'; // portrait || landscape

		const pdfFrame = new FramePdf({
			orientation: pdfOrientation,
			units: 'mm',
			format: pdfFormat,

			pageWidth: pageWidth,
			pageHeight: pageHeight,

			srcLink: window.location.href,  // Ссылка на страницу источник данных
			showTitlePage: true              // Показывать титульную страницу
		});

		// Установить подписи к полям для блока Основных надписей
		pdfFrame.setLabelsData({
			logo: i18n.tr('2d-viewer.pdf-label-drw-logo'),
			title: i18n.tr('2d-viewer.pdf-label-drw-title'),
			author: i18n.tr('2d-viewer.pdf-label-drw-author'),
			date: i18n.tr('2d-viewer.pdf-label-drw-date'),
			pages: i18n.tr('2d-viewer.pdf-label-drw-pages')
		});

		// Установить значения полей для Главной страницы
		pdfFrame.setOrientation('portrait');
		pdfFrame.setTitlePageData({
			header: i18n.tr('calc.' + getSelectedCalcId()),
			logo: {
				b64: user.logo.b64,
				ext: user.logo.ext,
				width: user.logo.width,
				height: user.logo.height
			},
			author: user.name,
			date: isoDateTime.replace(/T.*/, ''),

			qrData: window.location.href
		});
		pdfFrame.setOrientation(pdfOrientation);


		/** Наличие 3D сцены */
		if(viewer3D){
			// TODO: Получить состояние меню, чтобы узнать набор выбранных материалов
			// console.log(viewer3D.apiGetSelectetRoofMaterial());

			// Сцена
			let screenData = viewer3D.apiGetScreenData();

			// Рассчитаем оптимальную ориентацию для текущего чертежа
			let scale = {
				landscape: pdfFrame.getScaleFactor(screenData.width, screenData.height, 'landscape', 'fullpage'),
				portrait: pdfFrame.getScaleFactor(screenData.width, screenData.height, 'portrait', 'fullpage')
			};
			
			pdfOrientation = (scale['landscape'] >= scale['portrait']) ? 'landscape' : 'portrait';
			pdfFrame.setOrientation(pdfOrientation);
			let effBounding = pdfFrame.getEffectiveBounding(pdfOrientation, 'fullpage') ;


			// Добавляем страницу
			pdfFrame.addPage(pdfFormat, pdfOrientation);

			// Размеры скриншота в документе                                
			let scrActualSizes = {
				width: screenData.width * scale[pdfOrientation],
				height: screenData.height * scale[pdfOrientation]
			};

			// Добавим изобрежение 3D сцены
			pdfFrame.addImage(
				screenData.b64,
				'png',
				
				effBounding.x + 0.5 * (effBounding.width - scrActualSizes.width),
				effBounding.y + 0.5 * (effBounding.height - scrActualSizes.height),
				
				scrActualSizes.width,
				scrActualSizes.height
			);

			/** Добавим разметку рамки */
			/** >>>>>>>>>>>>>>>>>>>>>> */
			pdfFrame.addFrame();
			
			// Добавить подписи в блок Основных надписей
			pdfFrame.setFieldsData({
				logo: {
					b64: user.logo.b64,
					ext: user.logo.ext,
					width: user.logo.width,
					height: user.logo.height
				},
				title: '3D',
				author: user.name,
				date: isoDateTime.replace(/T/, ' ').replace(/\.\d{3}Z$/, ''),
				pages: ''
			});
			/** <<<<<<<<<<<<<<<<<<<<<< */
		}


		// Результаты расчета Материалы и размеры
		let nextReseultsGenerate = function(){

			/** Пройдемся по всем страницам и установим постраничку */
			let pageNum = 1, pagesTotal = pdfFrame.getContextJsPdf().internal.getNumberOfPages();
			for(; pageNum <= pagesTotal; pageNum++){
				// Пропустим 1-ую страницу (мы ее будем удалять перед сохранением), и 2-ю т.к. это обложка
				if(pageNum <= 2){
					continue;
				}

				pdfFrame.setPage(pageNum);
				pdfFrame.setFieldData('pages', (pageNum - 2) + '');
				// pdfFrame.setFieldData('pages', (pageNum - 2) + '/' + pagesTotal);
			}
		
			
			if(viewerRS){
				// let RAL = null;
				// if(viewer3D){
				// 	let roofMaterialTitle = viewer3D.apiGetSelectedTexture('d3RoofTitle');

				// 	if(roofMaterialTitle){
				// 		let ralMatch = roofMaterialTitle.match(/ral\s?\d{3,4}/gi);

				// 		if(ralMatch.length){
				// 			RAL = ralMatch[0].replace(/\s/g, '').toUpperCase();
				// 		}
				// 	}
				// }
				

				let pdfOrientation = 'portrait';

				// Добавляем страницу
				pdfFrame.addPage(pdfFormat, pdfOrientation);

				pdfFrame.setOrientation(pdfOrientation);
				let effBounding = pdfFrame.getEffectiveBounding(pdfOrientation, 'effective') ;

				// Обработаем и выведем группы
				const data = viewerRS.getResultState();
				let bodyData = [];

				const groupsNames = Object.keys(data);
				const groupsTotalCount = groupsNames.length;
				for (let i = 0; i < groupsTotalCount; i++) {
					const groupName = groupsNames[i];

					// Строки (Значения)
					if(data[groupName].items){
						let groupItemsNames = Object.keys(data[groupName].items);
						
						if(i > 0){
							bodyData.push([{content: '', colSpan: 2, styles: { textColor: [255, 255, 255], fillColor: [255, 255, 255] }}]);
						}

						// bodyData.push([{content: data[groupName].title, colSpan: 2, styles: { textColor: [255, 255, 255], fillColor: [6, 76, 109] }}]);
						let code = '';
						// if(typeof data[groupName].items.code !== 'undefined'){
						// 	// code = ', ' + i18n.tr('glob.code') + ': ' + data[groupName].items.code.value
						// 	code = ' #' + data[groupName].items.code.value + (RAL ? ', ' + RAL : '');
						// }
						bodyData.push([{content: data[groupName].title + code, colSpan: 2, styles: { textColor: [255, 255, 255], fillColor: [6, 76, 109] }}]);

						// Если есть описание
						if(data[groupName].descr !== ''){
							// bodyData.push([{content: data[groupName].descr, colSpan: 2, styles: { textColor: [255, 255, 255], fillColor: [7, 100, 144] }}]);
							bodyData.push([data[groupName].descr, '']);
						}

						for (let j = 0; j < groupItemsNames.length; j++) {
							// Пропустим артикул, т.к. показывем его возле группы
							if(groupItemsNames[j] === 'code'){
								continue;
							}

							// Не показываем расчетное количество, т.к. будем отображать его рядом с total
							if(groupItemsNames[j] === 'quantity'){
								continue;
							}

							const itemData = data[groupName].items[groupItemsNames[j]];
			
							let itemTitle = itemData.title;
							let itemValue = itemData.value;
							let itemUnits = itemData.units;

							if(groupItemsNames[j] === 'total' && data[groupName].items['quantity']){
								itemValue = '(' + data[groupName].items['quantity'].value + ') ' + itemData.value;
							}
							
							bodyData.push([itemTitle, itemValue + (itemUnits ? (' ' + i18n.tr('glob.unit-' + itemUnits)) : '')]);
						}

					}
				}

				pdfFrame.autoTable({
					// head: [['Title', 'Value']],
					body: bodyData,

					// headStyles: { fillColor: [6, 76, 109] },

					margin: {
						top: effBounding.y + 1,
						left: effBounding.x + 1,
						bottom: effBounding.maxY - (effBounding.y + effBounding.height) + 1,
						right: effBounding.maxX - (effBounding.x + effBounding.width) + 1
					},

					// Событие, когда таблица добавлена и для нее сформирована страница
					didDrawPage(res) {
						/** Добавим разметку рамки */
						pdfFrame.addFrame();
						
						// Добавить подписи в блок Основных надписей
						pageNum++;
						pdfFrame.setFieldsData({
							logo: {
								b64: user.logo.b64,
								ext: user.logo.ext,
								width: user.logo.width,
								height: user.logo.height
							},
							title: 'Results',
							author: user.name,
							date: isoDateTime.replace(/T/, ' ').replace(/\.\d{3}Z$/, ''),
							
							// pages: `${(i + 1)}/${namesCount}`
							pages: (pageNum - 2) + ''
						});
					},

					// /** Определим когда будет добавлена последняя часть таблицы */
					// didParseCell: function (res) {
					// 	const rows = res.table.body;
					// 	const cols = Object.keys(rows[res.row.index].cells)

					// 	if (res.row.index === rows.length - 1 && res.column.index === cols.length - 1) {
					// 		console.log('LAST');
					// 	}
					// }
				});

			}

			// TODO: почему-то не работает добавление постранички вне контекста страниц с таблицами
			// 
			// /** Пройдемся по всем страницам и установим постраничку */
			// let pageNum = 1, pagesTotal = pdfFrame.getContextJsPdf().internal.getNumberOfPages();
			// for(; pageNum <= pagesTotal; pageNum++){
			// 	// Пропустим 1-ую страницу (мы ее будем удалять перед сохранением), и 2-ю т.к. это обложка
			// 	if(pageNum <= 2){
			// 		continue;
			// 	}

			// 	console.log({
			// 		pageNum: pageNum,
			// 		pagesTotal: pagesTotal
			// 	});

			// 	pdfFrame.setPage(pageNum);
			// 	pdfFrame.setFieldData('pages', (pageNum - 2) + '');
			// 	// pdfFrame.setFieldData('pages', (pageNum - 2) + '/' + pagesTotal);
			// }




			/** Сохраняем документ */
			pdfFrame.save(fileName + '.pdf');

			// window.open(pdfFrame.output('bloburl'), '_blank');
		};

		if(viewer2D){
			var drawings = viewer2D.apiGetDrawingsList();
			var names = Object.keys(drawings), namesCount = names.length;

			(async function loop(names) {
				for (let i = 0, li = namesCount; i < li; i++) {
					/** Разметка страницы */
					// Чертеж
					let drawing = drawings[names[i]];
					
					// Рассчитаем оптимальную ориентацию для текущего чертежа
					let scale = {
						landscape: pdfFrame.getScaleFactor(drawing.width, drawing.height, 'landscape'),
						portrait: pdfFrame.getScaleFactor(drawing.width, drawing.height, 'portrait')
					};
					
					pdfOrientation = (scale['landscape'] >= scale['portrait']) ? 'landscape' : 'portrait';

					pdfFrame.setOrientation(pdfOrientation);
					let effBounding = pdfFrame.getEffectiveBounding(pdfOrientation, 'effective') ;

					// Добавляем страницу
					pdfFrame.addPage(pdfFormat, pdfOrientation);

					// Размеры чертежа в документе                                
					let drwActualSizes = {
						width: drawing.width * scale[pdfOrientation],
						height: drawing.height * scale[pdfOrientation]
					};

					// Promise функциция (ожидаем асинхронное завершение)
					await pdfFrame.addSvg(drawing.b64, {
							x: effBounding.x + 0.5 * (effBounding.width - drwActualSizes.width),
							y: effBounding.y + 0.5 * (effBounding.height - drwActualSizes.height),
							width: drwActualSizes.width,
							height: drwActualSizes.height
						});
					
					
					/** Добавим разметку рамки */
					/** >>>>>>>>>>>>>>>>>>>>>> */
					pdfFrame.addFrame();
					
					// Добавить подписи в блок Основных надписей
					pdfFrame.setFieldsData({
						logo: {
							b64: user.logo.b64,
							ext: user.logo.ext,
							width: user.logo.width,
							height: user.logo.height
						},
						title: drawing.title,
						author: user.name,
						date: isoDateTime.replace(/T/, ' ').replace(/\.\d{3}Z$/, ''),
						
						// pages: `${(i + 1)}/${namesCount}`
						pages: ''
					});
					/** <<<<<<<<<<<<<<<<<<<<<< */

					if(i >= (li - 1)){
						nextReseultsGenerate();
					}
				}
			})(names);
		}


		/** Проставим нумерацию страниц */	

	}




	// Actual display window size
	const wSize = useWindowSize();
	return (
		<Context.Provider value={{
			lang: lang,
			
			setRoofParams: setRoofParams,
			setAngleIsDefined: setAngleIsDefined,
			roofTypeChange: roofTypeChange,
			setRoofSheetsParams: setRoofSheetsParams,
			setBeamTypesParams: setBeamTypesParams,

			setRoofSheetLength: setRoofSheetLength,
			setBeamsTypes: setBeamsTypes,

			scene3DMounted: scene3DMounted,
			scene2DMounted: scene2DMounted,
			sceneRSMounted: sceneRSMounted,

			api: initAPI,

			// calculated: calculated
			roofParams: roofParams,
			roofSheetsParams: roofSheetsParams,
			beamsTypesParams: beamsTypesParams
		}}>

			<div className={cls('main')} style={{minHeight: wSize.height}}>
				{/* <Cities lang={lang}/> */}
				<div className={cls('content')}>
					<div className={cls('container')}>
						<RoofType pos={1} roofTypes={roofTypes}/>
						<RoofParams pos={2} type={roofType}/>
						<div className={cls('btns-block')}>
							<button className={cls('btn btn-primary' + (calcInProgress ? ' btn-disabled btn-loading' : ''))} onClick={() => { calculate(); }} disabled={calcInProgress}>
								{calcInProgress ? i18n.tr('btn.waiting') : i18n.tr('btn.calculate')}
							</button>
						</div>
						<div id="js-calc-results">
							{showCalcResults && <Scene3D pos={false} wrapId={win3DWrapId}/>}
							{showCalcResults && <Scene2D pos={false} wrapId={win2DWrapId}/>}
							
							{showCalcResults && 
								<div className={cls('btns-block')}>
									<button className={cls('btn btn-price' + (calcInProgress ? ' btn-disabled btn-loading' : ''))} onClick={() => { clickGetPrice(); }} disabled={calcInProgress}>{i18n.tr('btn.get-price')}</button>
									<button className={cls('btn btn-primary' + (calcInProgress ? ' btn-disabled btn-loading' : ''))} onClick={() => { clickSave(); }} disabled={calcInProgress}>{i18n.tr('btn.download')}</button>
								</div>
							}

							{showCalcResults && <SceneRS pos={false} wrapId={winRSWrapId}/>}

							{showCalcResults && 
								<div className={cls('btns-block')}>
									<button className={cls('btn btn-price' + (calcInProgress ? ' btn-disabled btn-loading' : ''))} onClick={() => { clickGetPrice(); }} disabled={calcInProgress}>{i18n.tr('btn.get-price')}</button>
									<button className={cls('btn btn-primary' + (calcInProgress ? ' btn-disabled btn-loading' : ''))} onClick={() => { clickSave(); }} disabled={calcInProgress}>{i18n.tr('btn.download')}</button>
								</div>
							}
						</div>
					</div>
				</div>
			</div>

		</Context.Provider>
	);
}

export default App;