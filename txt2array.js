const fs = require('fs');
const { banksMap } = require('./clabe');

let txt = fs.readFileSync('plazas.txt');
let a = txt.toString().split('\n').slice(1).filter(r => !!r).map(r => r.split('\t'));
fs.writeFileSync('plazas.json', JSON.stringify(a, null, 2))

txt = fs.readFileSync('participante.txt');
a = txt.toString().split('\n').slice(1).filter(r => !!r).map(r => r.split('\t'));
let b = banksMap;
a.forEach(([ id, nombre ]) => {
  const key = parseInt(id.slice(-3));
  const prevdata = banksMap[key];
  b[key] = { tag: nombre, name: nombre, ...prevdata };
})
fs.writeFileSync('participantes.json', JSON.stringify(a, null, 2));
// console.log(b)
// console.log(banksMap)
fs.writeFileSync('participantes-obj.json', JSON.stringify(b,null, 2));
// 2: { tag: 'BANAMEX', name: 'Banco Nacional de México, S.A.' },
