const path = require('path');
const log = require("console").log;


describe('https://news.ycombinator.com/news', () => {

  let newHomepage = null;

  beforeAll(async () => {
    const homepage = path.resolve(__dirname, 'resources/news.html');
    const tampermonkeyScript = path.resolve(__dirname, '../tampermonkey.js');
    newHomepage = await browser.newPage();
    await newHomepage.goto(`file://${homepage}`);
    await newHomepage.addScriptTag({ path: tampermonkeyScript });
    await newHomepage.evaluate(() => tampermonkeyScript());
    await page.goto(`file://${homepage}`);
  });

  function getCssProperty(page, query, propertyName) {
    return page.$eval(query, (el, pn) => {
      return getComputedStyle(el).getPropertyValue(pn)
    }, propertyName);
  }

  it('should make item titles more readable', async() => {
    const oldFontSize = await getCssProperty(page, '.titleline', 'font-size');
    expect(oldFontSize).toMatch('13.3333px');
    const newFontSize = await getCssProperty(newHomepage, '.titleline', 'font-size');
    expect(newFontSize).toMatch('16px');
  })

  it('should make the orange top menu full width', async() => {
    const windowWidth = await page.evaluate(() => window.outerWidth);
    const oldMenuWidth = await getCssProperty(page, '#hnmain', 'width');
    const newMenuWidth = await getCssProperty(newHomepage, '#hnmain', 'width');

    expect(oldMenuWidth).not.toMatch(newMenuWidth);
    expect(newMenuWidth).toMatch(`${windowWidth}px`);
  })

  it('should hide numbers from item titles', async() => {
    const oldNumberVisibility = await getCssProperty(page, '.rank', 'display');
    const newNumberVisibility = await getCssProperty(newHomepage, '.rank', 'display');

    expect(oldNumberVisibility).toMatch('inline');
    expect(newNumberVisibility).toMatch('none');
  })

  it('should make item subheading more readable', async() => {
    const oldSubheadingFontSize = await getCssProperty(page, '.subline', 'font-size');
    const newSubheadingFontSize = await getCssProperty(newHomepage, '.subline', 'font-size');

    expect(oldSubheadingFontSize).toMatch('9.33333px');
    expect(newSubheadingFontSize).toMatch('12px');
  })
});