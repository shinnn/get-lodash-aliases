'use strict';

const ghGet = require('gh-get');
const isObj = require('is-obj');
const remarkParse = require('remark-parse');
const rehypeParse = require('rehype-parse');
const unified = require('unified');

const DEFAULT_USRR_AGENT = 'shinnn/get-lodash-aliases https://github.com/shinnn/get-lodash-aliases';

function extractMethodName(str) {
  return str.match(/_\.([\w.]*)/)[1];
}

const parseHtml = unified().use(rehypeParse).parse;
const parseMarkdown = unified().use(remarkParse).parse;

function extractAliases(result, current, index, children) {
  if (index === 0) {
    return result;
  }

  index -= 1;
  const prevSibling = children[index];

  if (prevSibling.depth !== 4 || prevSibling.children[0].value !== 'Aliases') {
    return result;
  }

  while (index--) {
    if (children[index].type === 'html' && /<h3/i.test(children[index].value)) {
      const [h3Ast] = parseHtml(children[index].value).children[0].children[1].children;
      const aliases = current.children[0].children[0].value.split(',').map(extractMethodName);

      result[extractMethodName(h3Ast.children[0].children[0].value)] = aliases;

      break;
    }
  }

  return result;
}

module.exports = function getLodashAliases(options) {
  options = Object.assign({}, options);
  options.headers = Object.assign({
    'user-agent': DEFAULT_USRR_AGENT
  }, options.headers, {
    accept: 'application/vnd.github.v3.raw'
  });

  if (isObj(options.qs)) {
    if (options.qs.ref && options.qs.path) {
      return Promise.reject(new TypeError(
        'get-lodash-aliases doesn\'t allow to change `ref` and `path` parameter. ' +
        'It is specifically designed to get doc/README.md in master branch.'
      ));
    }

    if (options.qs.ref) {
      return Promise.reject(new TypeError(
        'get-lodash-aliases doesn\'t allow to change `ref` parameter ' +
        'since other branches don\'t include doc/README.md.'
      ));
    }

    if (options.qs.path) {
      return Promise.reject(new TypeError(
        'get-lodash-aliases doesn\'t allow to change `path` parameter ' +
        'since it is specifically designed to get doc/README.md, not other files.'
      ));
    }
  }

  return ghGet('repos/lodash/lodash/contents/doc/README.md', options).then(({body}) => {
    return parseMarkdown(body, {pedantic: true}).children.reduce(extractAliases, {});
  });
};
