const fs = require('fs');
const request = require('request');
const path = require('path');
const config = require('./config.json'); // 读取 config.json

const PEXEL_API_KEY = process.env.PEXEL_API_KEY || config.PEXEL_API_KEY;
console.log('[PEXEL_API_KEY] --> ', PEXEL_API_KEY);

const DOWNLOAD_PATH = 'pexels-download/';
const PER_PAGE = process.env.PER_PAGE || config.PER_PAGE || 5; // 优先级: env > config > 默认值
let keyword = process.argv[2] || process.env.KEYWORD || config.keyword || 'cat'; // 优先级: 命令行参数 > env > config > 默认值

if (!fs.existsSync(DOWNLOAD_PATH)) {
  fs.mkdirSync(DOWNLOAD_PATH);
}

const BASE_API_PATH = 'https://api.pexels.com/v1/';
const API_SEARCH = BASE_API_PATH + 'search';

const baseRequest = ({ url, method = "GET" }) => {
  return fetch(url, {
    method: method,
    headers: {
      'Authorization': PEXEL_API_KEY,
    },
  });
}

const searchPhoto = (options) => {
  let queryString = '';
  Object.keys(options).forEach(key => {
    if (queryString) {
      queryString = `${queryString}&`;
    } else {
      queryString = '?';
    }
    queryString = `${queryString}${key}=${options[key]}`;
  });
  return baseRequest({ url: API_SEARCH + queryString });
}

const download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(DOWNLOAD_PATH + filename)).on('close', callback);
  });
};

const getFileNameByUrl = (url) => {
  return url.split('/').pop();
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
  searchPhoto({ query: keyword, per_page: PER_PAGE }).then(res => {
    return res.json();
  }).then((response) => {
    response.photos.forEach(photo => {
      console.log(photo.src.original);
      download(photo.src.original, getFileNameByUrl(photo.src.original), () => { });
    });
  });
}

const main = () => {
  emptyDownloadFolder();
  startSearchAndDownload();
}

main();
