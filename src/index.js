import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import buildTree from './buildTree.js';
import format from './formaters/index.js';

const getFileData = (filepath) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  const data = fs.readFileSync(fullPath, 'utf-8');
  const dataFormat = path.extname(filepath).slice(1);
  return parse(data, dataFormat);
};

const genDiff = (filePathBefore, filePathAfter, formatName = 'stylish') => {
  const dataBefore = getFileData(filePathBefore);
  const dataAfter = getFileData(filePathAfter);
  const tree = buildTree(dataBefore, dataAfter);
  return format(tree, formatName);
};

export default genDiff;
