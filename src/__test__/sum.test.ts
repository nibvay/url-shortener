import mySum from '../sum';

test('add two number', () => {
  expect(mySum(1, 5)).toBe(6);
});
