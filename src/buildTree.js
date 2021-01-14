import _ from 'lodash';

const buildTree = (dataBefore, dataAfter) => {
  const keys = _.union(Object.keys(dataBefore), Object.keys(dataAfter));
  const diffTree = _.sortBy(keys).map((key) => {
    if (!_.has(dataAfter, key)) {
      return {
        name: key,
        status: 'removed',
        oldValue: dataBefore[key],
      };
    }
    if (!_.has(dataBefore, key)) {
      return {
        name: key,
        status: 'added',
        newValue: dataAfter[key],
      };
    }
    if (_.isPlainObject(dataBefore[key]) && _.isPlainObject(dataAfter[key])) {
      return {
        name: key,
        status: 'hasChildren',
        currentChildren: buildTree(dataBefore[key], dataAfter[key]),
      };
    }
    if (!_.isEqual(dataBefore[key], dataAfter[key])) {
      return {
        name: key,
        status: 'changed',
        newValue: dataAfter[key],
        oldValue: dataBefore[key],
      };
    }
    return {
      name: key,
      status: 'unchanged',
      value: dataBefore[key],
    };
  });
  return diffTree;
};

export default buildTree;
