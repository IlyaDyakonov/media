test("проверяем работу регулярного выражения", () => {
  
  const regex = /^\[?-?\d{1,2}.\d{5},\s?-?\d{1,2}.\d{5}\]?/;
  const exp = [
    "51.50851, -0.12572", true,
    "51.50851,-0.12572", true,
    "[51.50851, -0.12572]", true,
    "5121.50851,-0.12572", false,
    "51.50851,-012.12572", false,
    "51.5032851,-0.12572", false
  ];
  for (let i = 0; i < exp.length; i += 2) {
    const input = exp[i];
    const expected = exp[i + 1];
    const result = regex.test(input);
    expect(result).toBe(expected);
  }
});
