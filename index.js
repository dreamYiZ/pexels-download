const fs = require('fs');
const request = require('request');
const path = require('path');

const PEXEL_API_KEY = process.env.PEXEL_API_KEY;
console.log('[PEXEL_API_KEY] --> ', PEXEL_API_KEY);

const DOWNLOAD_PATH = 'pexels-download/';

const PER_PAGE = 5;



if (!fs.existsSync(DOWNLOAD_PATH)) {
    fs.mkdirSync(DOWNLOAD_PATH);
}

const BASE_API_PATH = 'https://api.pexels.com/v1/';
const API_SEARCH = BASE_API_PATH + 'search'


const baseRequest = ({ url, method = "GET" }) => {
    return fetch(url, {
        method: method,
        headers: {
            'Authorization': PEXEL_API_KEY,
        },
    })
}


const searchPhoto = (
    options
) => {
    let queryString = '';
    Object.keys(options).forEach(key => {
        if (queryString) {
            queryString = `${queryString}&`
        } else {
            queryString = '?'
        }

        queryString = `${queryString}${key}=${options[key]}`

    })
    return baseRequest({ url: API_SEARCH + queryString })
}





const download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(DOWNLOAD_PATH + filename)).on('close', callback);
    });
};


const getFileNameByUrl = (url) => {
    return url.split('/').pop()
}

const emptyDownloadFolder = () => {
    fs.readdir(DOWNLOAD_PATH, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(DOWNLOAD_PATH, file), (err) => {
                if (err) throw err;
            });
        }
    });
}

const startSearchAndDownload = () => {
    let keyword = process.argv[2] || 'cat';

    searchPhoto({
        query: keyword,
        per_page: PER_PAGE,
    }).then(res => {
        return res.json();
    }).then((response) => {
        // console.log('response', response)
        response.photos.forEach(photo => {
            console.log(photo.src.original)

            download(photo.src.original, getFileNameByUrl(photo.src.original), () => {

            })
        })
    });
}


const main = () => {


    emptyDownloadFolder();

    startSearchAndDownload();

}

main();