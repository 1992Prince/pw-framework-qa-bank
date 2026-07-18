import { test, expect } from "@playwright/test";

test("Fetch all HREF Attribute values from all links", async ({ page }) => {
  await page.goto("https://www.naukri.com/");

  // below will locate all elements that have a tag and href attribute
  let allLinks = page.locator("//a[@href]");

  await allLinks.first().waitFor();

  let linksCount = await allLinks.count();

  for (let i = 0; i < linksCount; i++) {
    let hrefAttributeVal = await allLinks.nth(i).getAttribute("href");
    console.log(hrefAttributeVal);
  }

  await page.pause();
});

test("Fetch all SRC Attribute values from all images", async ({ page }) => {
  await page.goto("https://www.naukri.com/");

  // //img will locate all images on webpage
  // //img[@src] will locate all images on webpage with src attribute
  let allImages = page.locator("//img[@src]");

  await allImages.first().waitFor();

  let imagesCount = await allImages.count();

  for (let i = 0; i < imagesCount; i++) {
    let srcAttributeVal = await allImages.nth(i).getAttribute("src");
    console.log(srcAttributeVal);
  }

  await page.pause();
});

test("Fetch FOOTER Links href and text", async ({ page }) => {
  await page.goto("https://www.google.com");

  let footerEle = page.locator("//div[@jscontroller='NzU6V']");

  let footerLinks = footerEle.locator("a[href]");
  let footerLinksCount = await footerLinks.count();

  for (let i = 0; i < footerLinksCount; i++) {
    let hrefAttributeVal = await footerLinks.nth(i).getAttribute("href");
    let textContent = await footerLinks.nth(i).innerText();
    console.log(hrefAttributeVal," -------- ", textContent);
  }

  await page.pause();
});

test("Find all BROKEN LINKS from webpage", async ({ page, request }) => {
  await page.goto("https://www.naukri.com/");

  let allLinks = page.locator("//a[@href]");

  await allLinks.first().waitFor();

  let linksCount = await allLinks.count();

  let brokenLinks = [];

  for (let i = 0; i < linksCount; i++) {
    let hrefAttribute = await allLinks.nth(i).getAttribute("href");

    if (hrefAttribute !== null && hrefAttribute.startsWith("http")) {
      try {
        let response = await request.get(hrefAttribute, { timeout: 10000 });

        if (!response.ok()) {
          brokenLinks.push(hrefAttribute);
        }
      } catch (error) {
        brokenLinks.push(hrefAttribute);
      }
    }
  }

  console.log(brokenLinks);
  await page.pause();
});
