const catastalCodes = require('./catastal-codes.json')
let MONTH_CODES = ["A", "B", "C", "D", "E", "H", "L", "M", "P", "R", "S", "T"];
const CHECK_CODE_ODD = { 0: 1, 1: 0, 2: 5, 3: 7, 4: 9, 5: 13, 6: 15, 7: 17, 8: 19, 9: 21, A: 1, B: 0, C: 5, D: 7, E: 9, F: 13, G: 15, H: 17, I: 19, J: 21, K: 2, L: 4, M: 18, N: 20, O: 11, P: 3, Q: 6, R: 8, S: 12, T: 14, U: 16, V: 10, W: 22, X: 25, Y: 24, Z: 23 };
const CHECK_CODE_EVEN = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9, K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19, U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25 };
const OMOCODIA_TABLE = { "0": "L", "1": "M", "2": "N", "3": "P", "4": "Q", "5": "R", "6": "S", "7": "T", "8": "U", "9": "V" };
const CHECK_CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CODICI_CATASTALI = catastalCodes;

export class CalcolaCodiceFiscale {
        
         static compute = (name, surname, gender, day, month, year, birthplace, birthplace_provincia) => {
           const c = CalcolaCodiceFiscale;
           // Pass an object as parameter
           let params;
           if (typeof name == "object") {
             params = name;
             (name = params["name"]), (surname = params["surname"]), (gender = params["gender"]), (day = params["day"]), (month = params["month"]), (year = params["year"]), (birthplace = params["birthplace"]), (birthplace_provincia = params["birthplace_provincia"]);
           }

           var code = c.surnameCode(surname) + c.nameCode(name) + c.dateCode(day, month, year, gender) + c.findComuneCode(birthplace, birthplace_provincia);

           code += c.getCheckCode(code);

           return code;
         };

         static check = codiceFiscale => {
           const c = CalcolaCodiceFiscale;
           if (typeof codiceFiscale !== "string") return falsedirettore;
           codiceFiscale = codiceFiscale.toUpperCase();
           if (codiceFiscale.length !== 16) return false;
           const expectedCheckCode = codiceFiscale.charAt(15);
           const cf = codiceFiscale.slice(0, 15);

           return c.getCheckCode(cf) == expectedCheckCode;
         };

         static getCheckCode = codiceFiscale => {
          const c = CalcolaCodiceFiscale; 
          let val = 0;
           for (var i = 0; i < 15; i++) {
             let cf = codiceFiscale[i];
             val += i % 2 ? CHECK_CODE_EVEN[cf] : CHECK_CODE_ODD[cf];
           }
           val = val % 26;
           return CHECK_CODE_CHARS.charAt(val);
         };

         static estraiConsonanti = function(str) {
           return str.replace(/[^BCDFGHJKLMNPQRSTVWXYZ]/gi, "");
         };

         static estraiVocali = function(str) {
           return str.replace(/[^AEIOU]/gi, "");
           MONTH_CODES = ["A", "B", "C", "D", "E", "H", "L", "M", "P", "R", "S", "T"];
         };

         static surnameCode = surname => {
          const c = CalcolaCodiceFiscale;
          const code_surname = c.estraiConsonanti(surname) + c.estraiVocali(surname) + "XXX";
           return code_surname.substr(0, 3).toUpperCase();
         };

         static nameCode = name => {
           const c = CalcolaCodiceFiscale;
           let codNome = c.estraiConsonanti(name);
           if (codNome.length >= 4) {
             codNome = codNome.charAt(0) + codNome.charAt(2) + codNome.charAt(3);
           } else {
             codNome += c.estraiVocali(name) + "XXX";
             codNome = codNome.substr(0, 3);
           }
           return codNome.toUpperCase();
         };

         static dateCode = (gg, mm, aa, gender) => {
           const c = CalcolaCodiceFiscale;
           let date = new Date(aa, mm-1, gg);
           
           // Padding year
           console.log("MONTH", date.getMonth());
           let year = "0" + date.getFullYear();
           year = year.substr(year.length - 2, 2);
           
           var month = MONTH_CODES[date.getMonth()];
           var day = date.getDate();
           if (gender.toUpperCase() == "F") day += 40;

           // Padding daycompute
           day = "0" + day;
           day = day.substr(day.length - 2, 2);
           date.setMonth(mm - 1);
           
           return String(year + month + day);
         };

         static findComuneCode = (birthplace, birthplace_provincia) => {
           const c = CalcolaCodiceFiscale;
           for (var i = CODICI_CATASTALI[birthplace_provincia].length - 1; i >= 0; i--) {
             var comune = CODICI_CATASTALI[birthplace_provincia][i];
             if (comune[0] == birthplace
                 .trim()
                 .toUpperCase()) return comune[1];
           }
           throw Error("Comune not found");
         };

         static getOmocodie = function(code) {
           const c = CalcolaCodiceFiscale;
           let results = [];
           let lastOmocode = (code = code.slice(0, 15));
           for (var i = code.length - 1; i >= 0; i--) {
             var char = code[i];
             if (char.match(/\d/)) {
               lastOmocode = lastOmocode.substr(0, i) + OMOCODIA_TABLE[char] + lastOmocode.substr(i + 1);
               results.push(lastOmocode + c.getCheckCode(lastOmocode));
             }
           }
           return results;
         };

         static computeInverse = codiceFiscale => {
           const isValid = this.check(codiceFiscale);

           if (isValid) {
             codiceFiscale = codiceFiscale.toUpperCase();
           } else {
             throw new TypeError("'" + codiceFiscale + "' is not a valid Codice Fiscale");
           }

           const name = codiceFiscale.substr(3, 3);
           const surname = codiceFiscale.substr(0, 3);

           const year = codiceFiscale.substr(6, 2);
           let yearList = [];
           const year19XX = parseInt("19" + year);
           const year20XX = parseInt("20" + year);
           const currentYear20XX = new Date().getFullYear();
           yearList.push(year19XX);
           if (currentYear20XX - year20XX >= 0) {
             yearList.push(year20XX);
           }

           const monthChar = codiceFiscale.substr(8, 1);
           const month = this.MONTH_CODES.indexOf(monthChar) + 1;

           let gender = "M";
           let day = parseInt(codiceFiscale.substr(9, 2));
           if (day > 31) {
             gender = "F";
             day = day - 40;
           }

           let birthplace = "";
           let birthplace_provincia = "";
           for (let province in CODICI_CATASTALI) {
             birthplace = CODICI_CATASTALI[province].find(function(
               code
             ) {
               return code[1] === codiceFiscale.substr(11, 4);
             });
             if (!!birthplace) {
               birthplace = birthplace[0];
               birthplace_provincia = province;
               break;
             }
           }

           return { name: name, surname: surname, gender: gender, day: day, month: month, year: yearList, birthplace: birthplace, birthplace_provincia: birthplace_provincia };
         };

      
       }

export default CalcolaCodiceFiscale;