// @ts-check
//Library-k
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = 80
// @ts-ignore
const Kodolo = require('caesar-ciphers').defaultCipher

//Express beállítása
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

//Osztálydefiníciók
/**
 * Egy adott kulcshoz tartozó eltolást tartalmazó osztály
 */
class Kulcs {
	/**
	 * A Kulcs osztály konstruktora
	 * @param {String} kulcs 
	 * @param {Number} eltolas 
	 */
	constructor(kulcs, eltolas) {
		this.kulcs = kulcs
		this.eltolas = eltolas
	}
}

//Változók kezdeti értékeinek beállítása
var currEltolas = 3
var kulcsok = [
	new Kulcs('asd', 1),
	new Kulcs('asdER', 2)
]

//Metódusok
/**
 * Lépteti az eltolást a következő értékre, vissyaadja az új értéket
 */
function kovetkezoEltolas() {
	currEltolas++
	if (currEltolas > 20) {
		currEltolas = 3
	}
	return currEltolas
}

/**
 * Ellenőrzi, hogy a bemenet megfelel-e az elvárásoknak (angol ábécé betűi és space)
 * @param {String} input Bemeneti karakterlánc
 */
function onlyEnglishChars(input) {
	return input.match(/^[a-zA-Z\ ]+$/gi)
}

/**
 * Middleware, mely engedélyezi a CORS kéréseket
 */
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/**
 * Api végpont definíció
 */
app.post('/api', (req, res) => {
	/**
	 * A kódolás típusa, lehet encode, vagy decode
	 * @type {String} 
	 */
	var tipus = req.body.tipus
	/**
	 * A kódoláshoz tartozó jelszó, azaz kulcs
	 * @type {String}
	 */
	var kulcs = req.body.kulcs
	/**
	 * A kódolni való szöveg
	 * @type {String}
	 */
	var szoveg = req.body.szoveg.trim()

	//Üres szöveget küldött-e be
	if (szoveg.length == 0) {
		res.status(400).json({
			status: 'Empty text'
		})
		return
	}

	//Csak megengedett karakter van-e a szövegben
	if (onlyEnglishChars(szoveg) == null) {
		res.status(400).json({
			status: 'Illegal characters in text (allowed: Letters of the english alphabet, whitespace)'
		})
		
		return
	}

	//Jó-e a request
	var helyesE = tipus && kulcs && szoveg &&
		(tipus == 'encode' || tipus == 'decode') &&
		tipus.trim().length > 0 && kulcs.trim().length > 0 && szoveg.trim().length > 0 &&
		onlyEnglishChars(szoveg) != null

	//Helyes request esetén
	if (helyesE) {
		var jelenlegiKulcs = kulcsok.find(x => x.kulcs == kulcs)
		if (tipus == 'encode') {
			//Kódolás
			if (jelenlegiKulcs) {
				//Létező jelszóval
				var kodolo = new Kodolo(jelenlegiKulcs.eltolas)
				var kodoltSzoveg = kodolo.encrypt(szoveg)
				res.status(200).json({
					kodoltSzoveg
				})
				return
				//Új jelszóval
			} else {
				var eltolas = kovetkezoEltolas()
				kulcsok.push({
					kulcs: kulcs,
					eltolas: eltolas
				})
				var kodolo = new Kodolo(eltolas)
				var kodoltSzoveg = kodolo.encrypt(szoveg)
				res.status(200).json({
					kodoltSzoveg
				})
				return
			}
		} else if (tipus == 'decode') {
			//Dekódolás
			if (jelenlegiKulcs) {
				//Létező jelszóval
				var kodolo = new Kodolo(jelenlegiKulcs.eltolas)
				var dekodoltSzoveg = kodolo.decrypt(szoveg)
				res.status(200).json({
					dekodoltSzoveg
				})
				return
			} else {
				//Nem létező jelszóval nem lehet
				res.status(403).json({
					status: 'Unknown password'
				})
				return
			}
		}
		//Hibás a request
	} else {
		res.status(400).json({
			status: 'Bad Request'
		})
		return
	}
})

//App indítása
app.listen(PORT)