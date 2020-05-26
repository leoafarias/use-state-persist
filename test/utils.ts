import faker from 'faker';

type KeyValue = {
  key: string;
  data: any;
};

export const arrayOfRandomStorageItems = (): KeyValue[] => {
  const dataArray = arrayOfRandomData();

  return dataArray.map(data => {
    return { key: faker.random.word(), data };
  });
};

export const arrayOfRandomData = (iterations: number = 100): any[] => {
  let data: any[] = [];
  let counter = iterations;

  while (counter > 0) {
    counter--;
    data = data.concat(arrayOfRandomDataTypes());
  }

  return data;
};

const arrayOfRandomDataTypes = (): any[] => {
  const values = [];
  values.push(faker.helpers.createCard());
  values.push(faker.helpers.createTransaction());
  values.push(faker.helpers.contextualCard());
  values.push(faker.random.number());
  values.push(faker.random.alphaNumeric());
  values.push(faker.random.boolean());
  values.push(faker.random.words());
  return values;
};
