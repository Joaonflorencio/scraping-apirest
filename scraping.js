const express = require('express')
const router = express.Router()

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const url = 'https://elpais.com/ultimas-noticias/'


router.use('/', async (req, res) => {
    try {
        const response = await axios.get(url)
        const html = response.data
        const $ = cheerio.load(html)
        let noticias = [];

        $('article').each((index, element) => {
            const noticia = {
                titulo: $(element).find('h2').text().trim(),
                img: $(element).find('img').attr('src') || '',
                descripcion: $(element).find('p').text().trim(),
                enlace: $(element).find('h2').find('a').attr('href'),
            };
            noticias.push(noticia)
        })
        guardarDatos(noticias)
    }
    catch (error) { console.log(error) }
})

function guardarDatos(noticias) {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}


module.exports = { router, guardarDatos }