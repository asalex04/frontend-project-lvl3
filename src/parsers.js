import yaml from 'js-yaml';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
};

const parse = (data, dataFormat) => parsers[dataFormat](data);

export default parse;
