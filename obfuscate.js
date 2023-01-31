var JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');


const srcDir = './build/static/js';
const destDir = './build/static/js/obf';
const tmpDir = './build/static/js/tmp';


// Получим список файлов из директории
fs.readdir(srcDir, (err, files) => {

  // Выберем только JS-файлы
  let jsFiles = files.filter(file => {
    if(file.search(/\.js$/) > -1) return file;
  });
  
  // Проходим по каждому файлу: 1) создаем копию; 2) обфусцируем копию в исходный файл; 3) удаляем копию.
  jsFiles.forEach(jsFileName => {
    let jsFilePath = `${srcDir}/${jsFileName}`;
    let jsTmpFilePath = `${tmpDir}/${jsFileName}`;
    
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // 1) создаем копию
    fs.copyFileSync(jsFilePath, jsTmpFilePath);

    // 2) обфусцируем копию в исходный файл
    let srcData = fs.readFileSync(jsTmpFilePath, 'utf8');

    console.log(jsFileName);
    try {
      let obfuscationResult = JavaScriptObfuscator.obfuscate(
        srcData,
  
        // Options https://obfuscator.io/
        {
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: true,
          debugProtectionInterval: false,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: false,
          renameGlobals: false,
          rotateStringArray: true,
          selfDefending: true,
          shuffleStringArray: true,
          simplify: true,
          splitStrings: false,
          stringArray: true,
          stringArrayEncoding: [],
          stringArrayIndexShift: true,
          stringArrayWrappersCount: 1,
          stringArrayWrappersChainedCalls: true,
          stringArrayWrappersParametersMaxCount: 2,
          stringArrayWrappersType: 'variable',
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false,

          debugProtection: true,
          debugProtectionInterval: true
        }
      );
  
      fs.writeFileSync(`${destDir}/${jsFileName}`, obfuscationResult.getObfuscatedCode());
    }
    catch(e){
      console.log('Error!');
      console.log(e);
    }
    
  });

  console.log('Complete!');
});
