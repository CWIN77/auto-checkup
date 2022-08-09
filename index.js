import { Builder, By, until } from "selenium-webdriver";
import dotenv from "dotenv";
import isOnline from 'is-online';
dotenv.config();

const userData = {
  name: process.env.name,
  school: process.env.school,
  birth: process.env.birth,
  psw: process.env.psw
};

const autoCheck = async ({ name, school, birth, psw }) => {
  const driver = await new Builder('./chromedriver').forBrowser('chrome').build();
  await driver.get('https://hcs.eduro.go.kr/#/relogin');
  await driver.wait(until.elementLocated(By.css('#btnConfirm2'))).click();
  await driver.wait(until.elementLocated(By.css('#schul_name_input'))).click();
  await driver.findElement(By.xpath(`//*[@id="sidolabel"]/option[2]`)).click();
  await driver.findElement(By.xpath(`//*[@id="crseScCode"]/option[5]`)).click();
  setTimeout(async () => {
    const schoolBtn = await driver.wait(until.elementLocated(By.css('.layerSchoolSelectWrap .layerSchoolTable tbody tr td .searchArea')));
    await schoolBtn.click();
    await driver.actions().sendKeys(school).perform();
    await driver.wait(until.elementLocated(By.css('.searchBtn'))).click();
    await driver.wait(until.elementLocated(By.css('.layerSchoolSelectWrap .layerSchoolArea li a'))).click();
    const selectBtn = await driver.wait(until.elementLocated(By.css('.layerFullBtn')));
    await selectBtn.click();
    await driver.wait(until.elementLocated(By.css('#user_name_input'))).click();
    await driver.actions().sendKeys(name).perform();
    await driver.wait(until.elementLocated(By.css('#birthday_input'))).click();
    await driver.actions().sendKeys(birth).perform();
    const pswBtn = await driver.wait(until.elementLocated(By.css('.keyboard-icon')));
    await pswBtn.click();

    const psw1 = await driver.wait(until.elementLocated(By.css(`[class*="transkey"] [aria-label="${psw[0]}"]`)));
    const psw2 = await driver.wait(until.elementLocated(By.css(`[class*="transkey"] [aria-label="${psw[1]}"]`)));
    const psw3 = await driver.wait(until.elementLocated(By.css(`[class*="transkey"] [aria-label="${psw[2]}"]`)));
    const psw4 = await driver.wait(until.elementLocated(By.css(`[class*="transkey"] [aria-label="${psw[3]}"]`)));
    await psw1.click();
    await psw2.click();
    await psw3.click();
    await psw4.click();

    const doneBtn = await driver.wait(until.elementLocated(By.css('#btnConfirm')));
    await doneBtn.click();

    setTimeout(async () => {
      try {
        const checkStartBtn = await driver.wait(until.elementLocated(By.css('.survey-button')));
        await checkStartBtn.click();

        await driver.wait(until.elementLocated(By.css('#survey_q1a1'))).click();
        await driver.wait(until.elementLocated(By.css('#survey_q2a1'))).click();
        await driver.wait(until.elementLocated(By.css('#survey_q3a1'))).click();

        const confirmBtn = await driver.wait(until.elementLocated(By.css('#btnConfirm')));
        await confirmBtn.click();
        setTimeout(async () => {
          await driver.quit();
        }, 1000);
      } catch {
        await driver.quit();
      }
    }, 1000);
  }, 500);
};

let isDone = false;
setInterval(async () => {
  const online = await isOnline();
  const date = new Date();
  if (online) {
    if (!isDone && 2 <= date.getHours() && date.getHours() <= 11) {
      isDone = true;
      await autoCheck(userData);
    } else if (!(2 <= date.getHours() && date.getHours() <= 11)) {
      isDone = false;
    }
  }
}, 600000); // 10분