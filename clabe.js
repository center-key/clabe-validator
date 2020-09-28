// CLABE Validator -- MIT License

const clabe = {

  version: '[VERSION]',

  computeChecksum: (clabeNum17) => {
    // Returns the checksum calculated from the first 17 characters of CLABE number.
    // Example:
    //    const checksum = clabe.computeChecksum('00201007777777777');  //value: 1
    const add = (sum, digit, i) => sum + (parseInt(digit, 10) * [ 3, 7, 1 ][i % 3]) % 10;
    const compute = () => (10 - (clabeNum17.split('').slice(0, 17).reduce(add, 0) % 10)) % 10;
    return /^[0-9]{17,18}$/.test(clabeNum17) ? compute() : null;
  },

  validate: (clabeNum) => {
    // Returns information in a map (object literal) about the CLABE number.
    // Example:
    //    const city = clabe.validate('002010077777777771').city;  //value: "Banco Nacional de México"
    const errorMap = {
      length: 'Must be exactly 18 digits long',
      characters: 'Must be only numeric digits (no letters)',
      checksum: 'Invalid checksum, last digit should be: ',
      bank: 'Invalid bank code: ',
      city: 'Invalid city code: ',
    };
    if (typeof clabeNum !== 'string')
      throw 'clabe.validator.check(clabeNum) -- Expected string, got: ' + typeof clabeNum;
    const bankCode = clabeNum.substring(0, 3);
    const cityCode = clabeNum.substring(3, 6);
    const account = clabeNum.substring(6, 17);
    const checksum = parseInt(clabeNum.substring(17, 18), 10);
    const makeCitiesMap = () => {
      clabe.citiesMap = {};
      const prefix = (code) => clabe.citiesMap[code] ? clabe.citiesMap[code] + ', ' : '';
      const addCity = (city) => clabe.citiesMap[city[0]] = prefix(city[0]) + city[1];  //0: code, 1: name
      clabe.cities.forEach(addCity);
    };
    if (!clabe.citiesMap)
      makeCitiesMap();
    const bank = clabe.banksMap[parseInt(bankCode, 10)] || {};
    const city = clabe.citiesMap[parseInt(cityCode, 10)];
    const realChecksum = clabe.computeChecksum(clabeNum);
    const getValidationInfo = () => {
      const validationInfo =
        clabeNum.length !== 18 ? { invalid: 'length', data: '' } :
          /[^0-9]/.test(clabeNum) ? { invalid: 'characters', data: '' } :
            checksum !== realChecksum ? { invalid: 'checksum', data: realChecksum } :
              !bank.tag ? { invalid: 'bank', data: bankCode } :
                !city ? { invalid: 'city', data: cityCode } :
                  { invalid: null };
      return validationInfo;
    };
    const validation = getValidationInfo();
    const valid = !validation.invalid;
    return {
      ok: valid,
      error: valid ? null : 'invalid-' + validation.invalid,
      formatOk: valid || [ 'bank', 'city' ].includes(validation.invalid),
      message: valid ? 'Valid' : errorMap[validation.invalid] + validation.data,
      tag: bank.tag || null,
      bank: bank.name || null,
      city: city || null,
      account: account,
      code: { bank: bankCode, city: cityCode },
      checksum: realChecksum,
    };
  },

  calculate: (bankCode, cityCode, accountNumber) => {
    // Returns an 18-character CLABE number.
    // Example:
    //    const clabeNum = clabe.calculate(2, 10, 7777777777);  //value: "002010077777777771"
    const pad = (num, len) => num.length < len ? pad('0' + num, len) : num;
    const fit = (num, len) => pad('' + num, len).slice(-len);
    const clabeNum = fit(bankCode, 3) + fit(cityCode, 3) + fit(accountNumber, 11);
    return clabeNum + clabe.computeChecksum(clabeNum);
  },

  banksMap: {  //source: https://es.wikipedia.org/wiki/CLABE#C.C3.B3digo_de_banco (Jan 9, 2017)
    "1": {
      "tag": "BANXICO",
      "name": "BANXICO"
    },
    "2": {
      "tag": "BANAMEX",
      "name": "Banco Nacional de México, S.A."
    },
    "6": {
      "tag": "BANCOMEXT",
      "name": "Banco Nacional de Comercio Exterior"
    },
    "9": {
      "tag": "BANOBRAS",
      "name": "Banco Nacional de Obras y Servicios Públicos"
    },
    "12": {
      "tag": "BBVA BANCOMER",
      "name": "BBVA Bancomer, S.A."
    },
    "14": {
      "tag": "SANTANDER",
      "name": "Banco Santander, S.A."
    },
    "19": {
      "tag": "BANJERCITO",
      "name": "Banco Nacional del Ejército, Fuerza Aérea y Armada"
    },
    "21": {
      "tag": "HSBC",
      "name": "HSBC México, S.A."
    },
    "22": {
      "tag": "GE MONEY",
      "name": "GE Money Bank, S.A."
    },
    "30": {
      "tag": "BAJÍO",
      "name": "Banco del Bajío, S.A."
    },
    "32": {
      "tag": "IXE",
      "name": "IXE Banco, S.A."
    },
    "36": {
      "tag": "INBURSA",
      "name": "Banco Inbursa, S.A."
    },
    "37": {
      "tag": "INTERACCIONES",
      "name": "Banco Interacciones, S.A."
    },
    "42": {
      "tag": "MIFEL",
      "name": "Banca Mifel, S.A."
    },
    "44": {
      "tag": "SCOTIABANK",
      "name": "Scotiabank Inverlat, S.A."
    },
    "58": {
      "tag": "BANREGIO",
      "name": "Banco Regional de Monterrey, S.A."
    },
    "59": {
      "tag": "INVEX",
      "name": "Banco Invex, S.A."
    },
    "60": {
      "tag": "BANSI",
      "name": "Bansi, S.A."
    },
    "62": {
      "tag": "AFIRME",
      "name": "Banca Afirme, S.A."
    },
    "72": {
      "tag": "BANORTE",
      "name": "Banco Mercantil del Norte, S.A."
    },
    "102": {
      "tag": "ABNAMRO",
      "name": "ABN AMRO Bank México, S.A."
    },
    "103": {
      "tag": "AMERICAN EXPRESS",
      "name": "American Express Bank (México), S.A."
    },
    "106": {
      "tag": "BAMSA",
      "name": "Bank of America México, S.A."
    },
    "108": {
      "tag": "TOKYO",
      "name": "Bank of Tokyo-Mitsubishi UFJ (México), S.A."
    },
    "110": {
      "tag": "JP MORGAN",
      "name": "Banco J.P. Morgan, S.A."
    },
    "112": {
      "tag": "BMONEX",
      "name": "Banco Monex, S.A."
    },
    "113": {
      "tag": "VE POR MAS",
      "name": "Banco Ve por Mas, S.A."
    },
    "116": {
      "tag": "ING",
      "name": "ING Bank (México), S.A."
    },
    "124": {
      "tag": "DEUTSCHE",
      "name": "Deutsche Bank México, S.A."
    },
    "126": {
      "tag": "CREDIT SUISSE",
      "name": "Banco Credit Suisse (México), S.A."
    },
    "127": {
      "tag": "AZTECA",
      "name": "Banco Azteca, S.A."
    },
    "128": {
      "tag": "AUTOFIN",
      "name": "Banco Autofin México, S.A."
    },
    "129": {
      "tag": "BARCLAYS",
      "name": "Barclays Bank México, S.A."
    },
    "130": {
      "tag": "COMPARTAMOS",
      "name": "Banco Compartamos, S.A."
    },
    "131": {
      "tag": "FAMSA",
      "name": "Banco Ahorro Famsa, S.A."
    },
    "132": {
      "tag": "BMULTIVA",
      "name": "Banco Multiva, S.A."
    },
    "133": {
      "tag": "PRUDENTIAL",
      "name": "Prudencial Bank, S.A."
    },
    "134": {
      "tag": "WAL-MART",
      "name": "Banco Wal Mart de México Adelante, S.A."
    },
    "135": {
      "tag": "NAFIN",
      "name": "Nacional Financiera, S.N.C."
    },
    "136": {
      "tag": "REGIONAL",
      "name": "Banco Regional, S.A."
    },
    "137": {
      "tag": "BANCOPPEL",
      "name": "BanCoppel, S.A."
    },
    "138": {
      "tag": "ABC CAPITAL",
      "name": "ABC Capital, S.A. I.B.M."
    },
    "139": {
      "tag": "UBS BANK",
      "name": "UBS Banco, S.A."
    },
    "140": {
      "tag": "FÁCIL",
      "name": "Banco Fácil, S.A."
    },
    "141": {
      "tag": "VOLKSWAGEN",
      "name": "Volkswagen Bank S.A. Institución de Banca Múltiple"
    },
    "143": {
      "tag": "CIBANCO",
      "name": "Consultoría Internacional Banco, S.A."
    },
    "145": {
      "tag": "BBASE",
      "name": "Banco BASE, S.A. de I.B.M."
    },
    "147": {
      "tag": "BANKAOOL",
      "name": "Bankaool, S.A., Institución de Banca Múltiple"
    },
    "148": {
      "tag": "PAGATODO",
      "name": "Banco PagaTodo S.A., Institución de Banca Múltiple"
    },
    "150": {
      "tag": "BIM",
      "name": "Banco Inmobiliario Mexicano, S.A., Institución de Banca Múltiple"
    },
    "151": {
      "tag": "DONDE",
      "name": "DONDE"
    },
    "152": {
      "tag": "BANCREA",
      "name": "Banco Bancrea, S.A., Institución de Banca Múltiple"
    },
    "154": {
      "tag": "BANCO FINTERRA",
      "name": "BANCO FINTERRA"
    },
    "155": {
      "tag": "ICBC",
      "name": "ICBC"
    },
    "156": {
      "tag": "SABADELL",
      "name": "Banco Sabadell, S.A. I.B.M."
    },
    "157": {
      "tag": "SHINHAN",
      "name": "SHINHAN"
    },
    "158": {
      "tag": "MIZUHO BANK",
      "name": "MIZUHO BANK"
    },
    "160": {
      "tag": "BANCO S3",
      "name": "BANCO S3"
    },
    "166": {
      "tag": "BANSEFI",
      "name": "Banco del Ahorro Nacional y Servicios Financieros, S.N.C."
    },
    "168": {
      "tag": "HIPOTECARIA FEDERAL",
      "name": "Sociedad Hipotecaria Federal, S.N.C."
    },
    "600": {
      "tag": "MONEXCB",
      "name": "Monex Casa de Bolsa, S.A. de C.V."
    },
    "601": {
      "tag": "GBM",
      "name": "GBM Grupo Bursátil Mexicano, S.A. de C.V."
    },
    "602": {
      "tag": "MASARI CC.",
      "name": "Masari Casa de Cambio, S.A. de C.V."
    },
    "604": {
      "tag": "C.B. INBURSA",
      "name": "Inversora Bursátil, S.A. de C.V."
    },
    "605": {
      "tag": "VALUÉ",
      "name": "Valué, S.A. de C.V., Casa de Bolsa"
    },
    "606": {
      "tag": "CB BASE",
      "name": "Base Internacional Casa de Bolsa, S.A. de C.V."
    },
    "607": {
      "tag": "TIBER",
      "name": "Casa de Cambio Tiber, S.A. de C.V."
    },
    "608": {
      "tag": "VECTOR",
      "name": "Vector Casa de Bolsa, S.A. de C.V."
    },
    "610": {
      "tag": "B&B",
      "name": "B y B Casa de Cambio, S.A. de C.V."
    },
    "611": {
      "tag": "INTERCAM",
      "name": "Intercam Casa de Cambio, S.A. de C.V."
    },
    "613": {
      "tag": "MULTIVA",
      "name": "Multivalores Casa de Bolsa, S.A. de C.V. Multiva Gpo. Fin."
    },
    "614": {
      "tag": "ACCIVAL",
      "name": "Acciones y Valores Banamex, S.A. de C.V., Casa de Bolsa"
    },
    "615": {
      "tag": "MERRILL LYNCH",
      "name": "Merrill Lynch México, S.A. de C.V., Casa de Bolsa"
    },
    "616": {
      "tag": "FINAMEX",
      "name": "Casa de Bolsa Finamex, S.A. de C.V."
    },
    "617": {
      "tag": "VALMEX",
      "name": "Valores Mexicanos Casa de Bolsa, S.A. de C.V."
    },
    "618": {
      "tag": "ÚNICA",
      "name": "Única Casa de Cambio, S.A. de C.V."
    },
    "619": {
      "tag": "ASEGURADORA MAPFRE",
      "name": "MAPFRE Tepeyac S.A."
    },
    "620": {
      "tag": "AFORE PROFUTURO",
      "name": "Profuturo G.N.P., S.A. de C.V."
    },
    "621": {
      "tag": "CB ACTINBER",
      "name": "Actinver Casa de Bolsa, S.A. de C.V."
    },
    "622": {
      "tag": "ACTINVE SI",
      "name": "Actinver S.A. de C.V."
    },
    "623": {
      "tag": "SKANDIA",
      "name": "Skandia Vida S.A. de C.V."
    },
    "624": {
      "tag": "CONSULTORÍA",
      "name": "Consultoría Internacional Casa de Cambio, S.A. de C.V."
    },
    "626": {
      "tag": "CBDEUTSCHE",
      "name": "Deutsche Securities, S.A. de C.V."
    },
    "627": {
      "tag": "ZURICH",
      "name": "Zurich Compañía de Seguros, S.A."
    },
    "628": {
      "tag": "ZURICHVI",
      "name": "Zurich Vida, Compañía de Seguros, S.A."
    },
    "629": {
      "tag": "HIPOTECARIA SU CASITA",
      "name": "Hipotecaria su Casita, S.A. de C.V."
    },
    "630": {
      "tag": "C.B. INTERCAM",
      "name": "Intercam Casa de Bolsa, S.A. de C.V."
    },
    "631": {
      "tag": "C.B. VANGUARDIA",
      "name": "Vanguardia Casa de Bolsa, S.A. de C.V."
    },
    "632": {
      "tag": "BULLTICK C.B.",
      "name": "Bulltick Casa de Bolsa, S.A. de C.V."
    },
    "633": {
      "tag": "STERLING",
      "name": "Sterling Casa de Cambio, S.A. de C.V."
    },
    "634": {
      "tag": "FINCOMUN",
      "name": "Fincomún, Servicios Financieros Comunitarios, S.A. de C.V."
    },
    "636": {
      "tag": "HDI SEGUROS",
      "name": "HDI Seguros, S.A. de C.V."
    },
    "637": {
      "tag": "ORDER",
      "name": "OrderExpress Casa de Cambio , S.A. de C.V. AAC"
    },
    "638": {
      "tag": "AKALA",
      "name": "Akala, S.A. de C.V., Sociedad Financiera Popular"
    },
    "640": {
      "tag": "JP MORGAN C.B.",
      "name": "J.P. Morgan Casa de Bolsa, S.A. de C.V."
    },
    "642": {
      "tag": "REFORMA",
      "name": "Operadora de Recursos Reforma, S.A. de C.V."
    },
    "646": {
      "tag": "STP",
      "name": "Sistema de Transferencias y Pagos STP, S.A. de C.V., SOFOM E.N.R."
    },
    "647": {
      "tag": "TELECOMM",
      "name": "Telecomunicaciones de México"
    },
    "648": {
      "tag": "EVERCORE",
      "name": "Evercore Casa de Bolsa, S.A. de C.V."
    },
    "649": {
      "tag": "SKANDIA",
      "name": "Skandia Operadora S.A. de C.V."
    },
    "651": {
      "tag": "SEGMTY",
      "name": "Seguros Monterrey New York Life, S.A de C.V."
    },
    "652": {
      "tag": "ASEA",
      "name": "Solución Asea, S.A. de C.V., Sociedad Financiera Popular"
    },
    "653": {
      "tag": "KUSPIT",
      "name": "Kuspit Casa de Bolsa, S.A. de C.V."
    },
    "655": {
      "tag": "SOFIEXPRESS",
      "name": "J.P. SOFIEXPRESS, S.A. de C.V., S.F.P."
    },
    "656": {
      "tag": "UNAGRA",
      "name": "UNAGRA, S.A. de C.V., S.F.P."
    },
    "659": {
      "tag": "OPCIONES EMPRESARIALES DEL NOROESTE",
      "name": "Opciones Empresariales Del Noreste, S.A. DE C.V."
    },
    "670": {
      "tag": "LIBERTAD",
      "name": "Libertad Servicios Financieros, S.A. De C.V."
    },
    "677": {
      "tag": "CAJA POP MEXICA",
      "name": "CAJA POP MEXICA"
    },
    "680": {
      "tag": "CRISTOBAL COLON",
      "name": "CRISTOBAL COLON"
    },
    "683": {
      "tag": "CAJA TELEFONIST",
      "name": "CAJA TELEFONIST"
    },
    "684": {
      "tag": "TRANSFER",
      "name": "TRANSFER"
    },
    "685": {
      "tag": "FONDO (FIRA)",
      "name": "FONDO (FIRA)"
    },
    "686": {
      "tag": "INVERCAP",
      "name": "INVERCAP"
    },
    "689": {
      "tag": "FOMPED",
      "name": "FOMPED"
    },
    "812": {
      "tag": "BBVA BANCOMER2",
      "name": "BBVA BANCOMER2"
    },
    "814": {
      "tag": "SANTANDER2",
      "name": "SANTANDER2"
    },
    "821": {
      "tag": "HSBC2",
      "name": "HSBC2"
    },
    "846": {
      "tag": "STP",
      "name": "Sistema de Transferencias y Pagos STP"
    },
    "901": {
      "tag": "CLS",
      "name": "CLS Bank International"
    },
    "902": {
      "tag": "INDEVAL",
      "name": "SD. INDEVAL, S.A. de C.V."
    },
    "903": {
      "tag": "CoDi Valida",
      "name": "CoDi Valida"
    },
    "999": {
      "tag": "N/A",
      "name": "N/A"
    },
  },

  cities: [  //source: https://es.wikipedia.org/wiki/CLABE#C.C3.B3digo_de_plaza (Jan 9, 2017)
    [
      "10",
      "AGUASCALIENTES AGS"
    ],
    [
      "11",
      "ASIENTOS AGS"
    ],
    [
      "12",
      "CALVILLO AGS"
    ],
    [
      "13",
      "COSIO AGS"
    ],
    [
      "14",
      "JESUS MARIA AGS"
    ],
    [
      "15",
      "PABELLON DE ARTEAGA AGS"
    ],
    [
      "16",
      "RINCON DE ROMOS AGS"
    ],
    [
      "17",
      "SAN FCO ROMO AGS"
    ],
    [
      "20",
      "MEXICALI BCN"
    ],
    [
      "21",
      "CIUDAD MORELOS BCN"
    ],
    [
      "22",
      "ENSENADA BCN"
    ],
    [
      "23",
      "GUADALUPE VICTORIA BCN"
    ],
    [
      "24",
      "RODOLFO SANCHEZ T. BCN"
    ],
    [
      "25",
      "SAN FELIPE BCN"
    ],
    [
      "26",
      "SAN QUINTIN BCN"
    ],
    [
      "27",
      "TECATE BCN"
    ],
    [
      "28",
      "PLAYAS DE ROSARITO BCN"
    ],
    [
      "40",
      "LA PAZ BCS"
    ],
    [
      "41",
      "CABO SAN LUCAS BCS"
    ],
    [
      "42",
      "CIUDAD CONSTITUCION BCS"
    ],
    [
      "43",
      "GUERRERO NEGRO BCS"
    ],
    [
      "44",
      "LORETO BCS"
    ],
    [
      "45",
      "SAN JOSE DEL CABO BCS"
    ],
    [
      "46",
      "SANTA ROSALIA BCS"
    ],
    [
      "47",
      "TODOS SANTOS BCS"
    ],
    [
      "50",
      "CAMPECHE CAM"
    ],
    [
      "51",
      "CALKINI CAM"
    ],
    [
      "52",
      "CIUDAD DEL CARMEN CAM"
    ],
    [
      "53",
      "CHAMPOTON CAM"
    ],
    [
      "54",
      "ESCARCEGA CAM"
    ],
    [
      "55",
      "HOPELCHEN CAM"
    ],
    [
      "56",
      "PALIZADA CAM"
    ],
    [
      "57",
      "SEYBAPLAYA CAM"
    ],
    [
      "60",
      "TORREON COA"
    ],
    [
      "61",
      "ABASOLO COA"
    ],
    [
      "62",
      "ACUÑA COA"
    ],
    [
      "63",
      "ALLENDE COA"
    ],
    [
      "64",
      "FRANCISCO I. MADERO COA"
    ],
    [
      "65",
      "FRONTERA COA"
    ],
    [
      "66",
      "LAGUNA DEL REY COA"
    ],
    [
      "67",
      "MATAMOROS COA"
    ],
    [
      "68",
      "MONCLOVA COA"
    ],
    [
      "69",
      "MORELOS COA"
    ],
    [
      "70",
      "MUZQUIZ COA"
    ],
    [
      "71",
      "NAVA COA"
    ],
    [
      "72",
      "NVA ROSITA COA"
    ],
    [
      "73",
      "PALAU COA"
    ],
    [
      "74",
      "PARRAS COA"
    ],
    [
      "75",
      "PIEDRAS NEGRAS COA"
    ],
    [
      "76",
      "RAMOS ARIZPE COA"
    ],
    [
      "77",
      "SABINAS COA"
    ],
    [
      "78",
      "SALTILLO COA"
    ],
    [
      "79",
      "SAN BUENAVENTURA COA"
    ],
    [
      "80",
      "SAN PEDRO COA"
    ],
    [
      "81",
      "ZARAGOZA COA"
    ],
    [
      "90",
      "COLIMA COL"
    ],
    [
      "91",
      "ARMERIA COL"
    ],
    [
      "92",
      "COMALA COL"
    ],
    [
      "93",
      "COQUIMATLAN COL"
    ],
    [
      "94",
      "CUAUHTEMOC COL"
    ],
    [
      "95",
      "MANZANILLO COL"
    ],
    [
      "96",
      "QUESERIA COL"
    ],
    [
      "97",
      "TECOMAN COL"
    ],
    [
      "98",
      "VILLA DE ALVAREZ COL"
    ],
    [
      "100",
      "TUXTLA GUTIERREZ CHIS"
    ],
    [
      "101",
      "ACAPETAHUA CHIS"
    ],
    [
      "102",
      "ANGEL ALBINO CORZO CHIS"
    ],
    [
      "103",
      "ARRIAGA CHIS"
    ],
    [
      "104",
      "BOCHIL CHIS"
    ],
    [
      "105",
      "CACAHOATAN CHIS"
    ],
    [
      "106",
      "CATAZAJA CHIS"
    ],
    [
      "107",
      "CINTALAPA CHIS"
    ],
    [
      "108",
      "CIUDAD HIDALGO CHIS"
    ],
    [
      "109",
      "COMITAN DE DOMINGUEZ CHIS"
    ],
    [
      "110",
      "COPAINALA CHIS"
    ],
    [
      "111",
      "CHIAPA DE CORZO CHIS"
    ],
    [
      "112",
      "CHICOMUSELO CHIS"
    ],
    [
      "113",
      "FRONTERA COMALAPA CHIS"
    ],
    [
      "114",
      "HUIXTLA CHIS"
    ],
    [
      "115",
      "JIQUIPILAS CHIS"
    ],
    [
      "116",
      "JUAREZ CHIS"
    ],
    [
      "117",
      "LA CONCORDIA CHIS"
    ],
    [
      "118",
      "LA TRINITARIA CHIS"
    ],
    [
      "119",
      "LAS MARGARITAS CHIS"
    ],
    [
      "120",
      "LAS ROSAS CHIS"
    ],
    [
      "121",
      "MAPASTEPEC CHIS"
    ],
    [
      "122",
      "MOTOZINTLA CHIS"
    ],
    [
      "123",
      "OCOSINGO CHIS"
    ],
    [
      "124",
      "OCOZOCOAUTLA DE E. CHIS"
    ],
    [
      "125",
      "PALENQUE CHIS"
    ],
    [
      "126",
      "PICHUCALCO CHIS"
    ],
    [
      "127",
      "PIJIJIAPAN CHIS"
    ],
    [
      "128",
      "REFORMA CHIS"
    ],
    [
      "129",
      "SALTO DE AGUA CHIS"
    ],
    [
      "130",
      "SN CRISTOBAL DE LAS C. CHIS"
    ],
    [
      "131",
      "SIMOJOVEL CHIS"
    ],
    [
      "132",
      "SOCOLTENANGO CHIS"
    ],
    [
      "133",
      "TAPACHULA CHIS"
    ],
    [
      "134",
      "TEOPISCA CHIS"
    ],
    [
      "135",
      "TONALA CHIS"
    ],
    [
      "136",
      "TUXTLA CHICO CHIS"
    ],
    [
      "137",
      "VENUSTIANO CARRANZA CHIS"
    ],
    [
      "138",
      "VILLA CORZO CHIS"
    ],
    [
      "140",
      "YAJALON CHIS"
    ],
    [
      "150",
      "CHIHUAHUA CHIH"
    ],
    [
      "151",
      "AHUMADA CHIH"
    ],
    [
      "152",
      "ANAHUAC CHIH"
    ],
    [
      "153",
      "ASCENSION CHIH"
    ],
    [
      "154",
      "BUENAVENTURA CHIH"
    ],
    [
      "155",
      "CAMARGO CHIH"
    ],
    [
      "156",
      "CASAS GRANDES CHIH"
    ],
    [
      "157",
      "CREEL CHIH"
    ],
    [
      "158",
      "CUAUHTEMOC CHIH"
    ],
    [
      "159",
      "GOMEZ FARIAS CHIH"
    ],
    [
      "160",
      "GUACHOCHI CHIH"
    ],
    [
      "161",
      "GUERRERO CHIH"
    ],
    [
      "162",
      "HIDALGO DEL PARRAL CHIH"
    ],
    [
      "163",
      "JIMENEZ CHIH"
    ],
    [
      "164",
      "JUAREZ CHIH"
    ],
    [
      "165",
      "MADERA CHIH"
    ],
    [
      "166",
      "MEOQUI CHIH"
    ],
    [
      "167",
      "NAMIQUIPA CHIH"
    ],
    [
      "168",
      "NVO CASAS GRANDES CHIH"
    ],
    [
      "169",
      "OJINAGA CHIH"
    ],
    [
      "170",
      "PRAXEDIS G. GUERRERO CHIH"
    ],
    [
      "171",
      "PUERTO PALOMAS CHIH"
    ],
    [
      "172",
      "SANTA BARBARA CHIH"
    ],
    [
      "173",
      "SAUCILLO CHIH"
    ],
    [
      "180",
      "DISTRITO FEDERAL DF"
    ],
    [
      "190",
      "DURANGO DGO"
    ],
    [
      "191",
      "CANATLAN DGO"
    ],
    [
      "192",
      "CUENCAME DGO"
    ],
    [
      "193",
      "EL SALTO DGO"
    ],
    [
      "194",
      "GUADALUPE VICTORIA DGO"
    ],
    [
      "195",
      "NAZAS DGO"
    ],
    [
      "196",
      "NVO IDEAL DGO"
    ],
    [
      "197",
      "SAN JUAN DEL RIO DGO"
    ],
    [
      "198",
      "SANTA MARIA DEL ORO DGO"
    ],
    [
      "199",
      "SANTIAGO PAPASQUIARO DGO"
    ],
    [
      "200",
      "TAYOLTITA DGO"
    ],
    [
      "201",
      "TEPEHUANES DGO"
    ],
    [
      "202",
      "VICENTE GUERRERO DGO"
    ],
    [
      "210",
      "GUANAJUATO GTO"
    ],
    [
      "211",
      "ABASOLO GTO"
    ],
    [
      "212",
      "ACAMBARO GTO"
    ],
    [
      "213",
      "APASEO EL ALTO GTO"
    ],
    [
      "214",
      "APASEO EL GRANDE GTO"
    ],
    [
      "215",
      "CELAYA GTO"
    ],
    [
      "216",
      "COMONFORT GTO"
    ],
    [
      "217",
      "CORONEO GTO"
    ],
    [
      "218",
      "CORTAZAR GTO"
    ],
    [
      "219",
      "CUERAMARO GTO"
    ],
    [
      "220",
      "DOLORES HIDALGO GTO"
    ],
    [
      "221",
      "HUANIMARO GTO"
    ],
    [
      "222",
      "IRAPUATO GTO"
    ],
    [
      "223",
      "JARAL DEL PROGRESO GTO"
    ],
    [
      "224",
      "JERECUARO GTO"
    ],
    [
      "225",
      "LEON GTO"
    ],
    [
      "226",
      "MANUEL DOBLADO GTO"
    ],
    [
      "227",
      "MOROLEON GTO"
    ],
    [
      "228",
      "OCAMPO GTO"
    ],
    [
      "229",
      "PENJAMO GTO"
    ],
    [
      "230",
      "PUEBLO NUEVO GTO"
    ],
    [
      "231",
      "PURISIMA DEL RINCON GTO"
    ],
    [
      "232",
      "ROMITA GTO"
    ],
    [
      "233",
      "SALAMANCA GTO"
    ],
    [
      "234",
      "SALVATIERRA GTO"
    ],
    [
      "235",
      "SAN DIEGO DE LA UNION GTO"
    ],
    [
      "236",
      "SAN FELIPE PROGRESO GTO"
    ],
    [
      "237",
      "SAN FCO. DEL RINCON GTO"
    ],
    [
      "238",
      "SAN JOSE ITURBIDE GTO"
    ],
    [
      "239",
      "SAN LUIS DE LA PAZ GTO"
    ],
    [
      "240",
      "SAN MIGUEL DE ALLENDE GTO"
    ],
    [
      "241",
      "SANTA ANA PACUECO GTO"
    ],
    [
      "242",
      "SANTA CRUZ DE JUVENTINO GTO"
    ],
    [
      "243",
      "SANTIAGO MARAVATIO GTO"
    ],
    [
      "244",
      "SILAO GTO"
    ],
    [
      "245",
      "TARANDACUAO GTO"
    ],
    [
      "246",
      "TARIMORO GTO"
    ],
    [
      "247",
      "URIANGATO GTO"
    ],
    [
      "248",
      "VALLE DE SANTIAGO GTO"
    ],
    [
      "249",
      "YURIRIA GTO"
    ],
    [
      "260",
      "CHILPANCINGO DE LOS B. GRO"
    ],
    [
      "261",
      "ACAPULCO DE JUAREZ GRO"
    ],
    [
      "262",
      "APAXTLA DE CASTREJON GRO"
    ],
    [
      "263",
      "ARCELIA GRO"
    ],
    [
      "264",
      "ATOYAC DE ALVAREZ GRO"
    ],
    [
      "265",
      "BUENAVISTA DE CUELLAR GRO"
    ],
    [
      "266",
      "CIUDAD ALTAMIRANO GRO"
    ],
    [
      "267",
      "COYUCA DE BENITEZ GRO"
    ],
    [
      "268",
      "CRUZ GRANDE GRO"
    ],
    [
      "269",
      "CHICHIHUALCO GRO"
    ],
    [
      "270",
      "CHILAPA DE ALVAREZ GRO"
    ],
    [
      "271",
      "HUITZUCO GRO"
    ],
    [
      "272",
      "IGUALA DE LA INDEPEN. GRO"
    ],
    [
      "273",
      "OLINALA GRO"
    ],
    [
      "274",
      "OMETEPEC GRO"
    ],
    [
      "275",
      "SAN MARCOS GRO"
    ],
    [
      "276",
      "TAXCO DE ALARCON GRO"
    ],
    [
      "277",
      "PETATLAN GRO"
    ],
    [
      "278",
      "TELOLOAPAN GRO"
    ],
    [
      "279",
      "TIERRA COLORADA GRO"
    ],
    [
      "280",
      "TIXTLA DE GUERRERO GRO"
    ],
    [
      "281",
      "TLAPA DE COMONFORT GRO"
    ],
    [
      "282",
      "ZIHUATANEJO GRO"
    ],
    [
      "290",
      "PACHUCA DE SOTO HGO"
    ],
    [
      "291",
      "ACTOPAN HGO"
    ],
    [
      "292",
      "APAN HGO"
    ],
    [
      "293",
      "ATOTONILCO EL GRANDE HGO"
    ],
    [
      "294",
      "CIUDAD SAHAGUN HGO"
    ],
    [
      "295",
      "CUAUTEPEC DE HINOJOSA HGO"
    ],
    [
      "296",
      "HUEJUTLA DE REYES HGO"
    ],
    [
      "297",
      "HUICHAPAN HGO"
    ],
    [
      "298",
      "IXMIQUILPAN HGO"
    ],
    [
      "299",
      "JACALA HGO"
    ],
    [
      "300",
      "METZTITLAN HGO"
    ],
    [
      "301",
      "MIXQUIAHUALA HGO"
    ],
    [
      "302",
      "MOLANGO HGO"
    ],
    [
      "303",
      "PROGRESO DE OBREGON HGO"
    ],
    [
      "304",
      "TASQUILLO HGO"
    ],
    [
      "305",
      "TEPEAPULCO HGO"
    ],
    [
      "306",
      "TEPEJI DEL RIO HGO"
    ],
    [
      "307",
      "TEZONTEPEC HGO"
    ],
    [
      "308",
      "TIZAYUCA HGO"
    ],
    [
      "309",
      "TLAHUELILPAN HGO"
    ],
    [
      "310",
      "TLAXCOAPAN HGO"
    ],
    [
      "311",
      "TULA DE ALLENDE HGO"
    ],
    [
      "312",
      "TULANCINGO HGO"
    ],
    [
      "313",
      "ZACUALTIPAN HGO"
    ],
    [
      "314",
      "ZIMAPAN HGO"
    ],
    [
      "320",
      "EL SALTO JAL"
    ],
    [
      "321",
      "ACATIC JAL"
    ],
    [
      "322",
      "ACATLAN DE JUAREZ JAL"
    ],
    [
      "323",
      "AHUALULCO DE MERCADO JAL"
    ],
    [
      "324",
      "AJIJIC JAL"
    ],
    [
      "325",
      "AMATITAN JAL"
    ],
    [
      "326",
      "AMECA JAL"
    ],
    [
      "327",
      "ARANDAS JAL"
    ],
    [
      "328",
      "ARENAL JAL"
    ],
    [
      "329",
      "ATENGUILLO JAL"
    ],
    [
      "330",
      "ATOTONILCO EL ALTO JAL"
    ],
    [
      "331",
      "ATOTONILQUILLO JAL"
    ],
    [
      "332",
      "ATOYAC JAL"
    ],
    [
      "333",
      "AUTLAN DE NAVARRO JAL"
    ],
    [
      "334",
      "AYOTLAN JAL"
    ],
    [
      "335",
      "AYUTLA JAL"
    ],
    [
      "336",
      "BAJIO DE SAN JOSE JAL"
    ],
    [
      "337",
      "BELEN DEL REFUGIO JAL"
    ],
    [
      "338",
      "CAÑADAS DE OBREGON JAL"
    ],
    [
      "339",
      "CAPILLA DE GUADALUPE JAL"
    ],
    [
      "340",
      "CASIMIRO CASTILLO JAL"
    ],
    [
      "341",
      "CIHUATLAN JAL"
    ],
    [
      "342",
      "CIUDAD GUZMAN JAL"
    ],
    [
      "343",
      "COCULA JAL"
    ],
    [
      "344",
      "Ixtlixochitl EDOMEX"
    ],
    [
      "345",
      "CUQUIO JAL"
    ],
    [
      "346",
      "CHAPALA JAL"
    ],
    [
      "347",
      "DEGOLLADO JAL"
    ],
    [
      "348",
      "EL GRULLO JAL"
    ],
    [
      "349",
      "ENCARNACION DE DIAZ JAL"
    ],
    [
      "350",
      "ESTIPAC JAL"
    ],
    [
      "351",
      "GUACHINANGO JAL"
    ],
    [
      "352",
      "HUEJUCAR JAL"
    ],
    [
      "353",
      "HUEJUQUILLA EL ALTO JAL"
    ],
    [
      "354",
      "IXTLAHUACAN DE LOS M. JAL"
    ],
    [
      "355",
      "IXTLAHUACAN DEL RIO JAL"
    ],
    [
      "356",
      "JALOSTOTITLAN JAL"
    ],
    [
      "357",
      "JAMAY JAL"
    ],
    [
      "358",
      "JESUS MARIA JAL"
    ],
    [
      "359",
      "JOCOTEPEC JAL"
    ],
    [
      "360",
      "JUCHITLAN JAL"
    ],
    [
      "361",
      "LA BARCA JAL"
    ],
    [
      "362",
      "LAGOS DE MORENO JAL"
    ],
    [
      "363",
      "MAGDALENA JAL"
    ],
    [
      "364",
      "MANZANILLA DE LA PAZ JAL"
    ],
    [
      "365",
      "MASCOTA JAL"
    ],
    [
      "366",
      "MAZAMITLA JAL"
    ],
    [
      "367",
      "MEXTICACAN JAL"
    ],
    [
      "368",
      "MEZQUITIC JAL"
    ],
    [
      "369",
      "MIXTLAN JAL"
    ],
    [
      "370",
      "OCOTLAN JAL"
    ],
    [
      "371",
      "OJUELOS DE JALISCO JAL"
    ],
    [
      "372",
      "PEGUEROS JAL"
    ],
    [
      "373",
      "PIHUAMO JAL"
    ],
    [
      "374",
      "PONCITLAN JAL"
    ],
    [
      "375",
      "PUERTO VALLARTA JAL"
    ],
    [
      "376",
      "PURIFICACION JAL"
    ],
    [
      "377",
      "QUITUPAN JAL"
    ],
    [
      "378",
      "SAN IGNACIO CERRO G. JAL"
    ],
    [
      "379",
      "SAN JOSE CASAS CAIDAS JAL"
    ],
    [
      "380",
      "SAN JOSE DE GRACIA JAL"
    ],
    [
      "381",
      "SAN JUAN DE LOS LAGOS JAL"
    ],
    [
      "382",
      "SAN JULIAN JAL"
    ],
    [
      "383",
      "SAN MARTIN HIDALGO JAL"
    ],
    [
      "384",
      "SAN MIGUEL EL ALTO JAL"
    ],
    [
      "385",
      "SAN PATRICIO MELAQUE JAL"
    ],
    [
      "386",
      "SAYULA JAL"
    ],
    [
      "387",
      "TALA JAL"
    ],
    [
      "388",
      "TALPA DE ALLENDE JAL"
    ],
    [
      "389",
      "TAMAZULA DE GORDIANO JAL"
    ],
    [
      "390",
      "TAPALPA JAL"
    ],
    [
      "391",
      "TECALITLAN JAL"
    ],
    [
      "392",
      "TECOLOTLAN JAL"
    ],
    [
      "393",
      "TENAMAXTLAN JAL"
    ],
    [
      "394",
      "TEOCALTICHE JAL"
    ],
    [
      "395",
      "TEOCUITATLAN DE CORONA JAL"
    ],
    [
      "396",
      "TEPATITLAN DE MORELOS JAL"
    ],
    [
      "397",
      "TEQUILA JAL"
    ],
    [
      "398",
      "TIZAPAN EL ALTO JAL"
    ],
    [
      "399",
      "TOLIMAN JAL"
    ],
    [
      "400",
      "TOMATLAN JAL"
    ],
    [
      "401",
      "TONAYA JAL"
    ],
    [
      "402",
      "TOTATICHE JAL"
    ],
    [
      "403",
      "TOTOTLAN JAL"
    ],
    [
      "404",
      "TUXPAN JAL"
    ],
    [
      "405",
      "UNION DE SAN ANTONIO JAL"
    ],
    [
      "406",
      "UNION DE TULA JAL"
    ],
    [
      "407",
      "VALLE DE GUADALUPE JAL"
    ],
    [
      "408",
      "VALLE DE JUAREZ JAL"
    ],
    [
      "409",
      "VILLA CORONA JAL"
    ],
    [
      "410",
      "VILLA GUERRERO JAL"
    ],
    [
      "411",
      "VILLA HIDALGO JAL"
    ],
    [
      "412",
      "VISTA HERMOSA JAL"
    ],
    [
      "413",
      "ZACOALCO DE TORRES JAL"
    ],
    [
      "414",
      "ZAPOTILTIC JAL"
    ],
    [
      "415",
      "ZAPOTLAN DEL REY JAL"
    ],
    [
      "416",
      "ZAPOTLANEJO JAL"
    ],
    [
      "420",
      "TOLUCA EDOMEX"
    ],
    [
      "421",
      "ACAMBAY EDOMEX"
    ],
    [
      "422",
      "ALMOLOYA DE JUAREZ EDOMEX"
    ],
    [
      "423",
      "AMATEPEC EDOMEX"
    ],
    [
      "424",
      "AMECAMECA EDOMEX"
    ],
    [
      "425",
      "APAXCO EDOMEX"
    ],
    [
      "426",
      "ATLACOMULCO EDOMEX"
    ],
    [
      "427",
      "CAPULHUAC EDOMEX"
    ],
    [
      "428",
      "COATEPEC HARINAS EDOMEX"
    ],
    [
      "429",
      "COLORINES EDOMEX"
    ],
    [
      "430",
      "CHICOLOAPAN EDOMEX"
    ],
    [
      "431",
      "CHICONCUAC EDOMEX"
    ],
    [
      "432",
      "EL ORO EDOMEX"
    ],
    [
      "433",
      "IXTAPAN DE LA SAL EDOMEX"
    ],
    [
      "434",
      "IXTLAHUACA EDOMEX"
    ],
    [
      "435",
      "JILOTEPEC EDOMEX"
    ],
    [
      "436",
      "JOCOTITLAN EDOMEX"
    ],
    [
      "437",
      "LA PAZ (REYES ACAQ.) EDOMEX"
    ],
    [
      "438",
      "LERMA EDOMEX"
    ],
    [
      "439",
      "LUVIANOS EDOMEX"
    ],
    [
      "440",
      "MALINALCO EDOMEX"
    ],
    [
      "441",
      "METEPEC EDOMEX"
    ],
    [
      "442",
      "OCOYOACAC EDOMEX"
    ],
    [
      "443",
      "OTUMBA EDOMEX"
    ],
    [
      "444",
      "SAN FELIPE PROGRESO EDOMEX"
    ],
    [
      "445",
      "SAN MATEO ATENCO EDOMEX"
    ],
    [
      "446",
      "TEJUPILCO EDOMEX"
    ],
    [
      "447",
      "TEMASCALCINGO EDOMEX"
    ],
    [
      "448",
      "TEMASCALTEPEC EDOMEX"
    ],
    [
      "449",
      "TEMOAYA EDOMEX"
    ],
    [
      "450",
      "TENANCINGO EDOMEX"
    ],
    [
      "451",
      "TENANGO DE ARISTA EDOMEX"
    ],
    [
      "452",
      "TEXCALTITLAN EDOMEX"
    ],
    [
      "453",
      "TIANGUISTENCO EDOMEX"
    ],
    [
      "454",
      "TONATICO EDOMEX"
    ],
    [
      "455",
      "TULTEPEC EDOMEX"
    ],
    [
      "456",
      "TULTITLAN EDOMEX"
    ],
    [
      "457",
      "VALLE DE BRAVO EDOMEX"
    ],
    [
      "458",
      "VILLA DEL CARBON EDOMEX"
    ],
    [
      "459",
      "VILLA GUERRERO EDOMEX"
    ],
    [
      "460",
      "VILLA NICOLAS ROMERO EDOMEX"
    ],
    [
      "461",
      "VILLA VICTORIA EDOMEX"
    ],
    [
      "462",
      "XONACATLAN EDOMEX"
    ],
    [
      "463",
      "ZUMPANGO EDOMEX"
    ],
    [
      "470",
      "MORELIA MICH"
    ],
    [
      "471",
      "ACUITZIO DEL CANJE MICH"
    ],
    [
      "472",
      "AGUILILLA MICH"
    ],
    [
      "473",
      "ALVARO OBREGON MICH"
    ],
    [
      "474",
      "ANGAMACUTIRO MICH"
    ],
    [
      "475",
      "ANGANGUEO MICH"
    ],
    [
      "476",
      "APATZINGAN MICH"
    ],
    [
      "477",
      "ARIO DE ROSALES MICH"
    ],
    [
      "478",
      "ARTEAGA MICH"
    ],
    [
      "479",
      "BUENAVISTA TOMATLAN MICH"
    ],
    [
      "480",
      "CIUDAD HIDALGO MICH"
    ],
    [
      "481",
      "COALCOMAN DE VAZQUEZ MICH"
    ],
    [
      "482",
      "CONTEPEC MICH"
    ],
    [
      "483",
      "COTIJA DE LA PAZ MICH"
    ],
    [
      "484",
      "CUITZEO MICH"
    ],
    [
      "485",
      "CHAVINDA MICH"
    ],
    [
      "486",
      "CHERAN MICH"
    ],
    [
      "487",
      "CHILCHOTA MICH"
    ],
    [
      "488",
      "CHURINTZIO MICH"
    ],
    [
      "489",
      "EPITACIO HUERTA MICH"
    ],
    [
      "490",
      "GABRIEL ZAMORA MICH"
    ],
    [
      "491",
      "HUANDACAREO MICH"
    ],
    [
      "492",
      "HUETAMO MICH"
    ],
    [
      "493",
      "JACONA DE PLANCARTE MICH"
    ],
    [
      "494",
      "JIQUILPAN DE JUAREZ MICH"
    ],
    [
      "495",
      "LA HUACANA MICH"
    ],
    [
      "496",
      "LA PIEDAD DE CABADAS MICH"
    ],
    [
      "497",
      "LAZARO CARDENAS MICH"
    ],
    [
      "498",
      "LOS REYES DE SALGADO MICH"
    ],
    [
      "499",
      "MARAVATIO MICH"
    ],
    [
      "500",
      "SAN JOSE DE GRACIA MICH"
    ],
    [
      "501",
      "NVA ITALIA DE RUIZ MICH"
    ],
    [
      "502",
      "PAJACUARAN MICH"
    ],
    [
      "503",
      "PANINDICUARO MICH"
    ],
    [
      "504",
      "PARACHO MICH"
    ],
    [
      "505",
      "PASTOR ORTIZ MICH"
    ],
    [
      "506",
      "PATZCUARO MICH"
    ],
    [
      "507",
      "PERIBAN MICH"
    ],
    [
      "508",
      "PUREPERO DE ECHAIZ MICH"
    ],
    [
      "509",
      "PURUANDIRO MICH"
    ],
    [
      "510",
      "QUERENDARO MICH"
    ],
    [
      "511",
      "QUIROGA MICH"
    ],
    [
      "512",
      "SAHUAYO DE MORELOS MICH"
    ],
    [
      "513",
      "SANTA ANA MAYA MICH"
    ],
    [
      "514",
      "SANTIAGO TANGAMANDAPIO MICH"
    ],
    [
      "515",
      "TACAMBARO CODALLOS MICH"
    ],
    [
      "516",
      "TANCITARO MICH"
    ],
    [
      "517",
      "TANGANCICUARO ARISTA MICH"
    ],
    [
      "518",
      "TANHUATO DE GUERRERO MICH"
    ],
    [
      "519",
      "TAPALCATEPEC MICH"
    ],
    [
      "520",
      "TARETAN MICH"
    ],
    [
      "521",
      "TINGUINDIN MICH"
    ],
    [
      "522",
      "TLALPUJAHUA MICH"
    ],
    [
      "523",
      "TLAZAZALCA MICH"
    ],
    [
      "524",
      "TOCUMBO MICH"
    ],
    [
      "525",
      "TUXPAN MICH"
    ],
    [
      "526",
      "TUZANTLA MICH"
    ],
    [
      "527",
      "UCAREO MICH"
    ],
    [
      "528",
      "URUAPAN MICH"
    ],
    [
      "529",
      "VILLA JIMENEZ MICH"
    ],
    [
      "530",
      "VILLAMAR MICH"
    ],
    [
      "531",
      "VILLA MORELOS MICH"
    ],
    [
      "532",
      "VISTA HERMOSA NEGRETE MICH"
    ],
    [
      "533",
      "YURECUARO MICH"
    ],
    [
      "534",
      "ZACAPU MICH"
    ],
    [
      "535",
      "ZAMORA MICH"
    ],
    [
      "536",
      "ZINAPECUARO MICH"
    ],
    [
      "537",
      "ZITACUARO MICH"
    ],
    [
      "540",
      "CUERNAVACA MOR"
    ],
    [
      "541",
      "AXOCHIAPAN MOR"
    ],
    [
      "542",
      "CUAUTLA MOR"
    ],
    [
      "543",
      "JIUTEPEC MOR"
    ],
    [
      "544",
      "JOJUTLA MOR"
    ],
    [
      "545",
      "PUENTE DE IXTLA MOR"
    ],
    [
      "546",
      "TEMIXCO MOR"
    ],
    [
      "547",
      "TEPOZTLAN MOR"
    ],
    [
      "548",
      "TETECALA MOR"
    ],
    [
      "549",
      "YAUTEPEC MOR"
    ],
    [
      "550",
      "YAUTEPEC MOR"
    ],
    [
      "551",
      "YECAPIXTLA MOR"
    ],
    [
      "552",
      "ZACATEPEC MOR"
    ],
    [
      "560",
      "TEPIC NAY"
    ],
    [
      "561",
      "ACAPONETA NAY"
    ],
    [
      "562",
      "AHUACATLAN NAY"
    ],
    [
      "563",
      "AMATLAN DE CAÑAS NAY"
    ],
    [
      "564",
      "COMPOSTELA NAY"
    ],
    [
      "565",
      "HUAJICORI NAY"
    ],
    [
      "566",
      "IXTLAN DEL RIO NAY"
    ],
    [
      "567",
      "LA PENITA DE JALTEMBA NAY"
    ],
    [
      "568",
      "LAS VARAS NAY"
    ],
    [
      "569",
      "ROSAMORADA NAY"
    ],
    [
      "570",
      "RUIZ NAY"
    ],
    [
      "571",
      "SAN BLAS NAY"
    ],
    [
      "572",
      "SANTA MARIA DEL ORO NAY"
    ],
    [
      "573",
      "SANTIAGO IXCUINTLA NAY"
    ],
    [
      "574",
      "TECUALA NAY"
    ],
    [
      "575",
      "TUXPAN NAY"
    ],
    [
      "576",
      "VILLA HIDALGO NAY"
    ],
    [
      "577",
      "XALISCO NAY"
    ],
    [
      "580",
      "APODACA NL"
    ],
    [
      "581",
      "ABASOLO NL"
    ],
    [
      "582",
      "AGUALEGUAS NL"
    ],
    [
      "583",
      "ALLENDE NL"
    ],
    [
      "584",
      "ANAHUAC NL"
    ],
    [
      "585",
      "BUSTAMANTE NL"
    ],
    [
      "586",
      "CERRALVO NL"
    ],
    [
      "587",
      "CIENEGA DE FLORES NL"
    ],
    [
      "588",
      "CHINA NL"
    ],
    [
      "589",
      "GALEANA NL"
    ],
    [
      "590",
      "GENERAL BRAVO NL"
    ],
    [
      "591",
      "GENERAL TERAN NL"
    ],
    [
      "592",
      "GENERAL ZUAZUA NL"
    ],
    [
      "593",
      "HIDALGO NL"
    ],
    [
      "594",
      "LAMPAZOS DE NARANJO NL"
    ],
    [
      "595",
      "LINARES NL"
    ],
    [
      "596",
      "LOS RAMONES NL"
    ],
    [
      "597",
      "MONTEMORELOS NL"
    ],
    [
      "598",
      "PESQUERIA NL"
    ],
    [
      "599",
      "SABINAS HIDALGO NL"
    ],
    [
      "600",
      "SALINAS VICTORIA NL"
    ],
    [
      "601",
      "SANTIAGO NL"
    ],
    [
      "610",
      "OAXACA OAX"
    ],
    [
      "611",
      "ASUNCION NOCHIXTLAN OAX"
    ],
    [
      "612",
      "GUELATAO OAX"
    ],
    [
      "613",
      "HEROICA CD DE TLAXIACO OAX"
    ],
    [
      "614",
      "HUAJUAPAM DE LEON OAX"
    ],
    [
      "615",
      "HUAUTLA OAX"
    ],
    [
      "616",
      "IXTEPEC OAX"
    ],
    [
      "617",
      "JUCHITAN DE ZARAGOZA OAX"
    ],
    [
      "618",
      "LA REFORMA OAX"
    ],
    [
      "619",
      "LOMA BONITA OAX"
    ],
    [
      "620",
      "MATIAS ROMERO OAX"
    ],
    [
      "621",
      "MIAHUATLAN OAX"
    ],
    [
      "622",
      "OCOTLAN OAX"
    ],
    [
      "623",
      "PINOTEPA OAX"
    ],
    [
      "624",
      "PUERTO ESCONDIDO OAX"
    ],
    [
      "625",
      "PUTLA OAX"
    ],
    [
      "626",
      "SALINA CRUZ OAX"
    ],
    [
      "627",
      "SAN ANDRES LAGUNAS OAX"
    ],
    [
      "628",
      "SAN JUAN BAUTISTA T. OAX"
    ],
    [
      "629",
      "SAN PEDRO MIXTEPEC OAX"
    ],
    [
      "630",
      "SAN PEDRO POCHUTLA OAX"
    ],
    [
      "631",
      "SAN PEDRO TAPANATEPEC OAX"
    ],
    [
      "632",
      "SANTA LUCIA DEL CAMINO OAX"
    ],
    [
      "633",
      "SANTA MARIA DEL TULE OAX"
    ],
    [
      "634",
      "SANTA MARIA HUATULCO OAX"
    ],
    [
      "635",
      "SANTIAGO JUXTLAHUACA OAX"
    ],
    [
      "636",
      "SANTIAGO PINOTEPA NAL OAX"
    ],
    [
      "637",
      "STO DOMINGO TEHUANTEPEC OAX"
    ],
    [
      "638",
      "TLACOLULA D MATAMOROS OAX"
    ],
    [
      "639",
      "VILLA DE TAMAZULAPAM OAX"
    ],
    [
      "640",
      "ZIMATLAN OAX"
    ],
    [
      "650",
      "CUAUTLANCINGO PUE"
    ],
    [
      "651",
      "ACATLAN PUE"
    ],
    [
      "652",
      "ACATZINGO PUE"
    ],
    [
      "653",
      "AMOZOC PUE"
    ],
    [
      "654",
      "ATLIXCO PUE"
    ],
    [
      "655",
      "CIUDAD SERDAN PUE"
    ],
    [
      "656",
      "CUETZALAN PUE"
    ],
    [
      "657",
      "CHIAUTLA PUE"
    ],
    [
      "658",
      "CHIGNAHUAPAN PUE"
    ],
    [
      "659",
      "HUAUCHINANGO PUE"
    ],
    [
      "660",
      "HUEJOTZINGO PUE"
    ],
    [
      "661",
      "HUEYTAMALCO PUE"
    ],
    [
      "662",
      "IZUCAR DE MATAMOROS PUE"
    ],
    [
      "663",
      "LIBRES PUE"
    ],
    [
      "664",
      "NEALTICAN PUE"
    ],
    [
      "665",
      "NVO NECAXA PUE"
    ],
    [
      "666",
      "RAFAEL LARA GRAJALES PUE"
    ],
    [
      "667",
      "SAN MARTIN TEXMELUCAN PUE"
    ],
    [
      "668",
      "STO TOMAS HUEYOTLIPAN PUE"
    ],
    [
      "669",
      "TECAMACHALCO PUE"
    ],
    [
      "670",
      "TEHUACAN PUE"
    ],
    [
      "671",
      "TEPEACA PUE"
    ],
    [
      "672",
      "TEZIUTLAN PUE"
    ],
    [
      "673",
      "TLATLAUQUITEPEC PUE"
    ],
    [
      "674",
      "XICOTEPEC PUE"
    ],
    [
      "675",
      "ZACAP0AXTLA PUE"
    ],
    [
      "676",
      "ZACATLAN PUE"
    ],
    [
      "680",
      "EL PUEBLITO CORREG. QRO"
    ],
    [
      "681",
      "AMEALCO QRO"
    ],
    [
      "682",
      "CADEREYTA QRO"
    ],
    [
      "683",
      "EZEQUIEL MONTES QRO"
    ],
    [
      "684",
      "JALPAN QRO"
    ],
    [
      "685",
      "SAN JUAN DEL RIO QRO"
    ],
    [
      "686",
      "TEQUISQUIAPAN QRO"
    ],
    [
      "690",
      "CHETUMAL QROO"
    ],
    [
      "691",
      "CANCUN QROO"
    ],
    [
      "692",
      "COZUMEL QROO"
    ],
    [
      "693",
      "ISLA MUJERES QROO"
    ],
    [
      "694",
      "PLAYA DEL CARMEN QROO"
    ],
    [
      "700",
      "SAN LUIS POTOSI SLP"
    ],
    [
      "701",
      "AXTLA DE TERRAZAS SLP"
    ],
    [
      "702",
      "CARDENAS SLP"
    ],
    [
      "703",
      "CERRITOS SLP"
    ],
    [
      "704",
      "CIUDAD DEL MAIZ SLP"
    ],
    [
      "705",
      "CIUDAD VALLES SLP"
    ],
    [
      "706",
      "CHARCAS SLP"
    ],
    [
      "707",
      "EBANO SLP"
    ],
    [
      "708",
      "GUADALCAZAR SLP"
    ],
    [
      "709",
      "MATEHUALA SLP"
    ],
    [
      "710",
      "RAYON SLP"
    ],
    [
      "711",
      "RIO VERDE SLP"
    ],
    [
      "712",
      "SALINAS DE HIDALGO SLP"
    ],
    [
      "713",
      "SANTA MARIA DEL RIO SLP"
    ],
    [
      "714",
      "TAMASOPO SLP"
    ],
    [
      "715",
      "TAMAZUNCHALE SLP"
    ],
    [
      "716",
      "TAMUIN SLP"
    ],
    [
      "717",
      "TANCANHUITZ DE SANTOS SLP"
    ],
    [
      "718",
      "TANQUIAN SLP"
    ],
    [
      "719",
      "TIERRA NUEVA SLP"
    ],
    [
      "720",
      "VENADO SLP"
    ],
    [
      "721",
      "XILITLA SLP"
    ],
    [
      "722",
      "VILLA DE ARISTA SLP"
    ],
    [
      "730",
      "CULIACAN SIN"
    ],
    [
      "731",
      "AHOME SIN"
    ],
    [
      "732",
      "ANGOSTURA SIN"
    ],
    [
      "733",
      "BADIRAGUATO SIN"
    ],
    [
      "734",
      "BAMOA SIN"
    ],
    [
      "735",
      "CONCORDIA SIN"
    ],
    [
      "736",
      "COSALA SIN"
    ],
    [
      "737",
      "CHOIX SIN"
    ],
    [
      "738",
      "EL FUERTE SIN"
    ],
    [
      "739",
      "ESCUINAPA DE HIDALGO SIN"
    ],
    [
      "740",
      "GUAMUCHIL SIN"
    ],
    [
      "741",
      "GUASAVE SIN"
    ],
    [
      "742",
      "LA CRUZ DE ELOTA SIN"
    ],
    [
      "743",
      "LOS MOCHIS SIN"
    ],
    [
      "744",
      "MAZATLAN SIN"
    ],
    [
      "745",
      "MOCORITO SIN"
    ],
    [
      "746",
      "NAVOLATO SIN"
    ],
    [
      "747",
      "QUILA SIN"
    ],
    [
      "748",
      "ROSARIO SIN"
    ],
    [
      "749",
      "SAN BLAS SIN"
    ],
    [
      "750",
      "SAN IGNACIO SIN"
    ],
    [
      "760",
      "HERMOSILLO SON"
    ],
    [
      "761",
      "AGUA PRIETA SON"
    ],
    [
      "762",
      "ALAMOS SON"
    ],
    [
      "763",
      "ALTAR SON"
    ],
    [
      "764",
      "BAVIACORA SON"
    ],
    [
      "765",
      "CABORCA SON"
    ],
    [
      "766",
      "CANANEA SON"
    ],
    [
      "767",
      "CIUDAD OBREGON SON"
    ],
    [
      "768",
      "CUMPAS SON"
    ],
    [
      "769",
      "EMPALME SON"
    ],
    [
      "770",
      "GUAYMAS SON"
    ],
    [
      "771",
      "HUATABAMPO SON"
    ],
    [
      "772",
      "LUIS B. SANCHEZ SON"
    ],
    [
      "773",
      "MAGDALENA DE KINO SON"
    ],
    [
      "774",
      "MIGUEL ALEMAN SON"
    ],
    [
      "775",
      "MOCTEZUMA SON"
    ],
    [
      "776",
      "NACOZARI DE GARCIA SON"
    ],
    [
      "777",
      "NAVOJOA SON"
    ],
    [
      "778",
      "NOGALES SON"
    ],
    [
      "779",
      "PUERTO PEÑASCO SON"
    ],
    [
      "780",
      "SAN LUIS RIO COLORADO SON"
    ],
    [
      "781",
      "SANTA ANA SON"
    ],
    [
      "782",
      "URES SON"
    ],
    [
      "783",
      "VILLA JUAREZ (IRRIGACION) SON"
    ],
    [
      "790",
      "VILLAHERMOSA TAB"
    ],
    [
      "791",
      "BALANCAN TAB"
    ],
    [
      "792",
      "CARDENAS TAB"
    ],
    [
      "793",
      "CIUDAD PEMEX TAB"
    ],
    [
      "794",
      "COMALCALCO TAB"
    ],
    [
      "795",
      "CUNDUACAN TAB"
    ],
    [
      "796",
      "EMILIANO ZAPATA TAB"
    ],
    [
      "797",
      "FRONTERA TAB"
    ],
    [
      "798",
      "HUIMANGUILLO TAB"
    ],
    [
      "799",
      "JALAPA TAB"
    ],
    [
      "800",
      "JALPA DE MENDEZ TAB"
    ],
    [
      "801",
      "JONUTA TAB"
    ],
    [
      "802",
      "MACUSPANA TAB"
    ],
    [
      "803",
      "NACAJUCA TAB"
    ],
    [
      "804",
      "PARAISO TAB"
    ],
    [
      "805",
      "TACOTALPA TAB"
    ],
    [
      "806",
      "TEAPA TAB"
    ],
    [
      "807",
      "TENOSIQUE TAB"
    ],
    [
      "810",
      "CIUDAD VICTORIA TAMPS"
    ],
    [
      "811",
      "ALTAMIRA TAMPS"
    ],
    [
      "812",
      "CAMARGO TAMPS"
    ],
    [
      "813",
      "CIUDAD MADERO TAMPS"
    ],
    [
      "814",
      "CIUDAD MANTE TAMPS"
    ],
    [
      "815",
      "CIUDAD MIGUEL ALEMAN TAMPS"
    ],
    [
      "816",
      "GONZALEZ TAMPS"
    ],
    [
      "817",
      "GUSTAVO DIAZ ORDAZ TAMPS"
    ],
    [
      "818",
      "MATAMOROS TAMPS"
    ],
    [
      "819",
      "MIER TAMPS"
    ],
    [
      "820",
      "NVA CIUDAD GUERRERO TAMPS"
    ],
    [
      "821",
      "NVO LAREDO TAMPS"
    ],
    [
      "822",
      "HIDALGO TAMPS"
    ],
    [
      "823",
      "RIO BRAVO TAMPS"
    ],
    [
      "824",
      "SAN FERNANDO TAMPS"
    ],
    [
      "825",
      "SOTO LA MARINA TAMPS"
    ],
    [
      "826",
      "VALLE HERMOSO TAMPS"
    ],
    [
      "827",
      "XICOTENCATL TAMPS"
    ],
    [
      "830",
      "TLAXCALA TLAX"
    ],
    [
      "831",
      "AMAXAC DE GUERRERO TLAX"
    ],
    [
      "832",
      "APIZACO TLAX"
    ],
    [
      "833",
      "CALPULALPAN TLAX"
    ],
    [
      "834",
      "CHIAUTEMPAN TLAX"
    ],
    [
      "835",
      "HUAMANTLA TLAX"
    ],
    [
      "836",
      "PAPALOTLA TLAX"
    ],
    [
      "837",
      "SANTA MARIA NATIVITAS TLAX"
    ],
    [
      "838",
      "TLAXCO TLAX"
    ],
    [
      "839",
      "ZACATELCO TLAX"
    ],
    [
      "840",
      "XALAPA VER"
    ],
    [
      "841",
      "ACAYUCAN VER"
    ],
    [
      "842",
      "ADALBERTO TEJEDA VER"
    ],
    [
      "843",
      "AGUA DULCE VER"
    ],
    [
      "844",
      "AGUA DULCE (PAPANTLA) VER"
    ],
    [
      "845",
      "ALAMOS VER"
    ],
    [
      "846",
      "ALTOTONGA VER"
    ],
    [
      "847",
      "ALVARADO VER"
    ],
    [
      "848",
      "BANDERILLAS VER"
    ],
    [
      "849",
      "BOCA DEL RIO VER"
    ],
    [
      "850",
      "CATEMACO VER"
    ],
    [
      "851",
      "CERRO AZUL VER"
    ],
    [
      "852",
      "CIUDAD MENDOZA VER"
    ],
    [
      "853",
      "COATEPEC VER"
    ],
    [
      "854",
      "COATZACOALCOS VER"
    ],
    [
      "855",
      "CORDOBA VER"
    ],
    [
      "856",
      "COSAMALOAPAN VER"
    ],
    [
      "858",
      "COSCOMATEPEC VER"
    ],
    [
      "859",
      "COSOLEACAQUE VER"
    ],
    [
      "860",
      "CUITLAHUAC VER"
    ],
    [
      "861",
      "CHICONTEPEC VER"
    ],
    [
      "862",
      "EL NARANJAL VER"
    ],
    [
      "863",
      "FORTIN DE LAS FLORES VER"
    ],
    [
      "864",
      "GUTIERREZ ZAMORA VER"
    ],
    [
      "865",
      "HUATUSCO VER"
    ],
    [
      "866",
      "HUEYAPAN DE OCAMPO VER"
    ],
    [
      "867",
      "ISLA VER"
    ],
    [
      "868",
      "IXTACZOQUITLAN VER"
    ],
    [
      "869",
      "JALTIPAN DE MORELOS VER"
    ],
    [
      "870",
      "JESUS CARRANZA VER"
    ],
    [
      "871",
      "JUAN RODRIGUEZ CLARA VER"
    ],
    [
      "872",
      "LA ANTIGUA VER"
    ],
    [
      "873",
      "LAS CHOAPAS VER"
    ],
    [
      "874",
      "LERDO DE TEJADA VER"
    ],
    [
      "875",
      "LOS NARANJOS VER"
    ],
    [
      "876",
      "MARTINEZ DE LA TORRE VER"
    ],
    [
      "877",
      "MINATITLAN VER"
    ],
    [
      "878",
      "MISANTLA VER"
    ],
    [
      "879",
      "NANCHITA VER"
    ],
    [
      "880",
      "NAOLINCO VER"
    ],
    [
      "881",
      "NARANJOS VER"
    ],
    [
      "882",
      "ORIZABA VER"
    ],
    [
      "883",
      "OZULUAMA VER"
    ],
    [
      "884",
      "PANUCO VER"
    ],
    [
      "885",
      "PAPANTLA VER"
    ],
    [
      "886",
      "PEROTE VER"
    ],
    [
      "887",
      "PLAYA VICENTE VER"
    ],
    [
      "888",
      "POZA RICA VER"
    ],
    [
      "889",
      "RIO BLANCO (TENANGO) VER"
    ],
    [
      "890",
      "SAN ANDRES TUXTLA VER"
    ],
    [
      "891",
      "SAN RAFAEL VER"
    ],
    [
      "892",
      "SOLEDAD DE DOBLADO VER"
    ],
    [
      "893",
      "TAMIAHUA VER"
    ],
    [
      "894",
      "TANTOYUCA VER"
    ],
    [
      "895",
      "TEMPOAL DE SANCHEZ VER"
    ],
    [
      "896",
      "TEOCELO VER"
    ],
    [
      "897",
      "TEZONAPA VER"
    ],
    [
      "898",
      "TIERRA BLANCA VER"
    ],
    [
      "899",
      "TIHUATLAN VER"
    ],
    [
      "900",
      "TLACOTALPAN VER"
    ],
    [
      "901",
      "TLAPACOYAN VER"
    ],
    [
      "902",
      "TRES VALLES VER"
    ],
    [
      "903",
      "TUXPAN VER"
    ],
    [
      "904",
      "VEGA DE ALATORRE VER"
    ],
    [
      "905",
      "VERACRUZ VER"
    ],
    [
      "906",
      "XICO VER"
    ],
    [
      "910",
      "MERIDA YUC"
    ],
    [
      "911",
      "IZAMAL YUC"
    ],
    [
      "912",
      "MAXCANU YUC"
    ],
    [
      "913",
      "MOTUL YUC"
    ],
    [
      "914",
      "OXKUTZCAB YUC"
    ],
    [
      "915",
      "PUERTO PROGRESO YUC"
    ],
    [
      "916",
      "TEKAX YUC"
    ],
    [
      "917",
      "TICUL YUC"
    ],
    [
      "918",
      "TIZIMIN YUC"
    ],
    [
      "919",
      "UMAN YUC"
    ],
    [
      "920",
      "VALLADOLID YUC"
    ],
    [
      "930",
      "ZACATECAS ZAC"
    ],
    [
      "931",
      "APOZOL ZAC"
    ],
    [
      "932",
      "CONCEPCION DEL ORO ZAC"
    ],
    [
      "933",
      "FRESNILLO ZAC"
    ],
    [
      "934",
      "GUADALUPE ZAC"
    ],
    [
      "935",
      "JALPA ZAC"
    ],
    [
      "936",
      "JEREZ DE GARCIA SALINAS ZAC"
    ],
    [
      "937",
      "JUAN ALDAMA ZAC"
    ],
    [
      "938",
      "JUCHIPILA ZAC"
    ],
    [
      "939",
      "LORETO ZAC"
    ],
    [
      "940",
      "LUIS MOYA ZAC"
    ],
    [
      "941",
      "MIGUEL AUZA ZAC"
    ],
    [
      "942",
      "MONTE ESCOBEDO ZAC"
    ],
    [
      "943",
      "MORELOS ZAC"
    ],
    [
      "944",
      "MOYAHUA DE ESTRADA ZAC"
    ],
    [
      "945",
      "NIEVES ZAC"
    ],
    [
      "946",
      "NOCHISTLAN DE MEJIA ZAC"
    ],
    [
      "947",
      "OJOCALIENTE ZAC"
    ],
    [
      "948",
      "PINOS ZAC"
    ],
    [
      "949",
      "RIO GRANDE ZAC"
    ],
    [
      "950",
      "SAIN ALTO ZAC"
    ],
    [
      "951",
      "SAN PEDRO APULCO ZAC"
    ],
    [
      "952",
      "SOMBRERETE ZAC"
    ],
    [
      "953",
      "TABASCO ZAC"
    ],
    [
      "954",
      "TEPECHITLAN ZAC"
    ],
    [
      "955",
      "TEPETONGO ZAC"
    ],
    [
      "956",
      "TEUL DE GLEZ. ORTEGA ZAC"
    ],
    [
      "957",
      "COSAUTLAN VER"
    ],
    [
      "958",
      "VALPARAISO ZAC"
    ],
    [
      "959",
      "VALLA DE COS ZAC"
    ],
    [
      "960",
      "VICTOR ROSALES ZAC"
    ],
    [
      "961",
      "VILLA GONZALEZ ORTEGA ZAC"
    ],
    [
      "962",
      "VILLANUEVA ZAC"
    ]
  ],

};

if (typeof module === 'object')
  module.exports = clabe;  //node module loading system (CommonJS)
if (typeof window === 'object')
  window.clabe = clabe;  //support both global and window property
