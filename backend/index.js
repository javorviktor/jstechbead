const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var Kodolo = require('caesar-ciphers').defaultCipher;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var currEltolas = 3
var kulcsok = [{
    kulcs: 'asd', eltolas: 1
}, {
    kulcs: 'asdER', eltolas: 2
}]

function ismertEAKulcs(input) {
    for (let kulcs of kulcsok) {
        if (kulcs.kulcs == input) {
            return kulcs.eltolas
        }
    }
    return -1
}

function kovetkezoEltolas() {
    currEltolas++
    if (currEltolas > 20) {
        currEltolas = 3
    }
    return currEltolas
}

function onlyEnglishChars(input) {
    // var regex = new RegExp('/^[a-zA-Z]+$/')
    return input.match(/^[a-zA-Z]+$/gi)
}

app.post('/api', (req, res) => {
    var tipus = req.body.tipus
    var kulcs = req.body.kulcs
    var szoveg = req.body.szoveg

    var helyesE = tipus && kulcs && szoveg &&
        (tipus == 'encode' || tipus == 'decode') &&
        tipus.trim().length > 0 && kulcs.trim().length > 0 && szoveg.trim().length > 0 &&
        onlyEnglishChars(szoveg) != null

    if (helyesE) {
        var eltolas = ismertEAKulcs(kulcs)
        if (tipus == 'encode') {
            if (eltolas != -1) {
                var kodolo = new Kodolo(eltolas)
                var kodoltSzoveg = kodolo.encrypt(szoveg)
                res.status(200).json({
                    kodoltSzoveg
                })
            } else {
                eltolas = kovetkezoEltolas()
                kulcsok.push({
                    kulcs: kulcs,
                    eltolas: eltolas
                })
                var kodolo = new Kodolo(eltolas)
                var kodoltSzoveg = kodolo.encrypt(szoveg)
                res.status(200).json({
                    kodoltSzoveg
                })
            }
        } else if (tipus == 'decode') {
            if (eltolas != -1) {
                //res.send("ISMERT!! (decode)")
                var kodolo = new Kodolo(eltolas)
                var dekodoltSzoveg = kodolo.decrypt(szoveg)
                res.status(200).json({
                    dekodoltSzoveg
                })
            } else {
                res.status(403).json({
                    status: 'Unknown password'
                })
            }
        }
    } else {
        res.status(400).json({
            status: 'Bad Request'
        })
    }
})

app.get('*', (req, res) => {
    res.status(404).json({
        status: 'Not Found'
    })
})

app.listen(3000)