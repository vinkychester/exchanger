function ISO(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num) {
      let norm = Math.floor(Math.abs(num));
      return (norm < 10 ? '0' : '') + norm;
    };
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    dif + pad(tzo / 60) +
    ':' + pad(tzo % 60);
}

function generateSitemap() {

  let builder = require('xmlbuilder');

  let date = new Date()
  date = ISO(date);
  let data = {
    'urlset': {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'url': [
        {
          'loc': 'https://coin24.com.ua',
          'changefreq': 'weekly',
          'priority': 1.0
        },
        {
          'loc': 'https://coin24.com.ua/rates/',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/about-us/',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/cities/',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-belaja-cerkov',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-vinnica',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-dnepr',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-doneck',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-krpitovaljut-zhitomir',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-zaporozhe',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-ivano-frankovsk',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-kiev',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-kolomyja',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-kramatorsk',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-kropivnickij',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-lugansk',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-luck',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-lvov',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-mariupol',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-mukachevo',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-nikolaev',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-odessa',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-poltava',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-rovno',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-svetlovodsk',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-krym',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-sumy',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-ternopol',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-uzhgorod',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-harkov',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-herson',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-hmelnickij',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-chervonograd',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-cherkassy',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-chernigov',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/city/obmen-kriptovaljut-chernovcy',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/reviews/',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/crypto-dictionary/',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/kurs-bitcoina/',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/obmenyat-kupit-kriptovalyutu/',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/obmen-kriptovalut/',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/bitcoin-koshelek/',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/partners/',
          'changefreq': 'weekly',
          'priority': 0.8
        },
        {
          'loc': 'https://coin24.com.ua/news/',
          'changefreq': 'weekly',
          'priority': 0.6
        },
        {
          'loc': 'https://coin24.com.ua/useterms/',
          'changefreq': 'weekly',
          'priority': 0.4
        },
        {
          'loc': 'https://coin24.com.ua/privacy/ru/',
          'changefreq': 'weekly',
          'priority': 0.4
        },
        {
          'loc': 'https://coin24.com.ua/exchange-regulations/',
          'changefreq': 'weekly',
          'priority': 0.4
        },
        {
          'loc': 'https://coin24.com.ua/card-verification-manual/',
          'changefreq': 'weekly',
          'priority': 0.4
        },
        {
          'loc': 'https://coin24.com.ua/faq/',
          'changefreq': 'weekly',
          'priority': 0.4
        },
        /*{
          'loc': 'https://coin24.com.ua/document-verification-manual/',
          'changefreq': 'weekly',
          'priority': 0.8
        },*/
        /*{
          'loc': 'https://coin24.com.ua/client-manual/',
          'changefreq': 'weekly',
          'priority': 0.8
        },*/
        /*{
          'loc': 'https://coin24.com.ua/kyc-and-aml-policy/',
          'changefreq': 'weekly',
          'priority': 0.8
        },*/
      ]
    }
  };

  let feed = builder.create(data, {encoding: 'utf-8'})
  feed.end({pretty: true});


  let fs = require('fs');

  fs.writeFile('public/sitemap.xml', feed.toString(), function (err) {
    if (err) throw err;
  });

}

generateSitemap();