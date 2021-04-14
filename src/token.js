/**
 * Last update: 2016/06/26
 * https://translate.google.com/translate/releases/twsfe_w_20160620_RC00/r/js/desktop_module_main.js
 *
 * Everything between 'BEGIN' and 'END' was copied from the url above.
 * fork from https://github.com/vitalets/google-translate-token
 * for support brower
 */

var axios = require('axios-https-proxy-fix');

/* eslint-disable */
// BEGIN

function gq(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2);
        d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
        d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
}
function hq(a, b) {
    var c = b.split(".");
    b = Number(c[0]) || 0;
    for (var d = [], e = 0, f = 0; f < a.length; f++) {
        var h = a.charCodeAt(f);
        128 > h ? d[e++] = h : (2048 > h ? d[e++] = h >> 6 | 192 : (55296 == (h & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(f + 1) & 64512) ? (h = 65536 + ((h & 1023) << 10) + (a.charCodeAt(++f) & 1023),
            d[e++] = h >> 18 | 240,
            d[e++] = h >> 12 & 63 | 128) : d[e++] = h >> 12 | 224,
            d[e++] = h >> 6 & 63 | 128),
            d[e++] = h & 63 | 128)
    }
    a = b;
    for (e = 0; e < d.length; e++)
        a += d[e],
            a = gq(a, "+-a^+6");
    a = gq(a, "+-3^+b+-f");
    a ^= Number(c[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    c = a % 1E6;
    return c.toString() + "." + (c ^ b)
}

// END
/* eslint-enable */

var window = {
    TKK: '0'
};

function updateTKK(opts) {
    opts = opts || { tld: 'com' };
    return new Promise(function (resolve, reject) {
        var now = Math.floor(Date.now() / 3600000);

        if (Number(window.TKK.split('.')[0]) === now) {
            resolve();
        } else {
            axios({
                // url: 'https://translate.google.' + opts.tld,
                url: 'https://translate.google.' + opts.tld + '/translate_a/element.js?cb=gtElInit&client=wt',
                proxy: opts.proxy,
            }).then(function (res) {
                var matches = res.data.match(/tkk='(.+?)'/)

                if (matches) {
                    window.TKK = matches[1];
                }

                /**
                 * Note: If the regex or the eval fail, there is no need to worry. The server will accept
                 * relatively old seeds.
                 */

                resolve();
            }).catch(function (err) {
                var e = new Error();
                e.code = 'BAD_NETWORK';
                e.message = err.message;
                reject(e);
            });
        }
    });
}

function get(text, opts) {
    return updateTKK(opts).then(() => {
        var tk = hq(text, window.TKK);
        tk = tk.replace('&tk=', '');
        return { name: 'tk', value: tk };
    }).catch(function (err) {
        throw err;
    });
}

module.exports.get = get;