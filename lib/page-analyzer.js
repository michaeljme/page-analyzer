'use strict';

/**
 * @see Cheerio - https://github.com/cheeriojs/cheerio - "jQuery for the server"
 */

var cheerio = require('cheerio');
var _ = require('lodash');
_.mixin(require('underscore.string'));

module.exports = function(body, callback) {

    if (!body) return callback('body is required');

    var result = {
        'page_title': null,
        'meta_description': null,
        'meta_keywords': [],
        'has_ga': false
    };

    var $ = cheerio.load(body);

    result.page_title = $('title').text();
    result.meta_description = $("meta[name='description']").first().attr('content');
    result.meta_keywords = $("meta[name='keywords']").first().attr('content');
    if (result.meta_keywords) {
        result.meta_keywords = result.meta_keywords.split(',');
        result.meta_keywords = _.map(result.meta_keywords, function(kw, idx) {
            return _.trim(kw);
        });
    }

    $('script').each(function(idx, script) {
        if (script.children.length !== 1) return;
        if (script.children[0].data.indexOf('google-analytics.com') >= 0) {
            result.has_ga = true;
		}
    });

    console.log(result);

    // console.log($);

    return callback(null, result);

};
