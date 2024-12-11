export function getStaticData() {
  // 生成23条数据
  const arr = [];
  for (let i = 0; i < 23; i++) {
    arr.push({
      id: 10001 + i,
      name: `Test${i + 1}`,
      role: i % 2 ? "Develop" : "PM",
      sex: i % 3 ? "Man" : "Woman",
      age: 28 + i,
      address: `test ${i}`,
    });
  }
  return Promise.resolve({
    data: {
      rows: arr,
      total: 23,
    },
  });
}

export function getDynamicData({ current, size }) {
  console.log({ current, size });
  current--;
  // 动态生成列表,如果超过23了就截断
  const arr = [];
  for (let i = current * size; i < (current + 1) * size && i < 23; i++) {
    arr.push({
      id: 10001 + i,
      name: `Test${i + 1}`,
      role: i % 2 ? "Develop" : "PM",
      sex: i % 3 ? "Man" : "Woman",
      age: 28 + i,
      address: `test ${i}`,
    });
  }

  return Promise.resolve({
    data: {
      rows: arr,
      total: 23,
    },
  });
}
