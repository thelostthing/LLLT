// currentPlateMaxLength: 7,
// currentPlate: '',
// currentPlateIndex: 0,
const validatePlate = value => {
  const rule = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/;
  return rule.test(value)
}

const onPlateInputShare = (value, {currentPlate, currentPlateIndex, currentPlateMaxLength}) => {
  let newIndex;
  let newPlate;
  let isEV = currentPlateMaxLength == 8;
  if(currentPlateIndex == (currentPlateMaxLength - 1)) {
    newIndex = currentPlateMaxLength - 1;
    if(currentPlate[newIndex]) {
      newPlate = currentPlate.slice(0, -1) + value;
    } else {
      newPlate = currentPlate + value;
    }
  } else {
    newIndex = currentPlateIndex + 1;
    newPlate = currentPlate + value;
  }
  if(newIndex == 6 && newPlate[6]) {
    newIndex = 7;
    isEV = true;
  }

  return {
    currentPlate: newPlate,
    currentPlateIndex: newIndex,
    currentPlateMaxLength: isEV ? 8 : 7
  }
}

const onPlateDeleteShare = ({currentPlate}) => {
  const newPlate = currentPlate.slice(0, -1);
  return {
    currentPlate: newPlate,
    currentPlateIndex: newPlate.length,
  }
}

const onPlateClearShare = () => {
  return {
    currentPlateMaxLength: 7,
    currentPlate: '',
    currentPlateIndex: 0,
  }
}

const onPlateEVShare = ({currentPlateIndex, currentPlate}) => {
  let result = {currentPlateMaxLength: 8};
  if(currentPlateIndex == 6 && currentPlate[6]) {
    result.currentPlateIndex = 7;
  }
  return result;
}

module.exports = {
  validatePlate,
  onPlateInputShare,
  onPlateDeleteShare,
  onPlateClearShare,
  onPlateEVShare
}
