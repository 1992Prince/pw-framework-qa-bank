import { test, expect } from "@playwright/test";
import path from 'path';
// 'path' Node.js ka built-in module hai jo file/folder paths ko
// handle karne ke liye use hota hai — jaise paths ko jodna, normalize karna,
// extension nikalna, etc. Cross-platform safe hai (Windows/Mac/Linux sab pe
// sahi se kaam karta hai, slashes "\" vs "/" ka jhanjhat khud handle kar leta hai)


test("TC001 — Upload single File", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  // process.cwd() = the directory from which you run "npx playwright test"
  // which is normally your project root (PW-FUSION-MUKESH)

  // process.cwd() gives the current working directory the test command was run from. Since 
  // Playwright tests are run from the project root in virtually all standard setups 
  // (local machine and CI both), and your artifacts folder sits directly at root level,
  const filePath = path.join(process.cwd(), 'artifacts', 'PW_Cheatsheet.jpg');
   
  await page.getByTestId('single-file')
  .setInputFiles(filePath);
    

  await page.pause();
  

});

// path.join() — yeh multiple path segments (strings) ko aapas mein
  // sahi tareeke se jodta hai (proper "/" ya "\" lagake, OS ke hisaab se),
  // aur ek final clean path string return karta hai.
  //
  // process.cwd() — yeh PEHLA part hai jo hum path.join() ko de rahe hain.
  // Iska matlab hai "current working directory" — yani jis folder se
  // hum test command run kar rahe hain (npx playwright test), uska path.
  // Generally yeh tumhare project ka ROOT folder hota hai
  // (PW-FUSION-MUKESH), jab tak tum kisi aur folder se command na chalao.
  //
  // 'artifacts' — yeh SECOND parameter hai path.join() ka — yani root
  // ke andar ka woh folder jahan file rakhi hai.
  //
  // 'PW_Cheatsheet.jpg' — yeh THIRD parameter hai — actual file ka naam
  // jo us artifacts folder ke andar hai.
  //
  // Teeno ko jodke final result aata hai:
  // D:\git\PW-FUSION-MUKESH\artifacts\PW_Cheatsheet.jpg  (ya jo bhi tumhara root ho)


test("TC002 — Upload multiple Files", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

 
  const filePath1 = path.join(process.cwd(), 'artifacts', 'PW_Cheatsheet.jpg');
  const filePath2 = path.join(process.cwd(), 'artifacts', 'PW_Cheatsheet1.jpg');
   
  await page.getByTestId('multi-file')
  .setInputFiles([filePath1, filePath2]);
    

  await page.pause();
  

});

test("TC003 — Upload multiple Files and then remove them", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

 
  const filePath1 = path.join(process.cwd(), 'artifacts', 'PW_Cheatsheet.jpg');
  const filePath2 = path.join(process.cwd(), 'artifacts', 'PW_Cheatsheet1.jpg');
   
  await page.getByTestId('multi-file')
  .setInputFiles([filePath1, filePath2]);
    

  await page.pause();

  await page.getByTestId('multi-file')
  .setInputFiles([]);

  await page.pause();
  

});

test("TC004 — Handle File Upload with Custom Browse Button", async ({
  page,
}) => {
  // ============ CONCEPT ============
  // File upload in web applications can be handled in two ways:
  // 1. Standard HTML input[type="file"] — use setInputFiles() directly
  // 2. Custom file upload buttons (div/button with JavaScript) — use waitForEvent("filechooser")
  //
  // This test handles Case 2: Custom Browse button that triggers native file chooser
  // Strategy: Register event listener BEFORE clicking button, then set file when dialog opens

  // ============ STEP 1: Navigate to Application ============
  console.log("📍 Step 1: Navigating to Orange HRM login page...");
  await page.goto(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
  );
  console.log("✅ Login page loaded");

  // ============ STEP 2: Login to Application ============
  console.log("📍 Step 2: Logging in with credentials...");
  
  // Fill username field
  await page.getByPlaceholder("Username").fill("Admin");
  console.log("✅ Username entered");

  // Fill password field
  await page.getByPlaceholder("Password").fill("admin123");
  console.log("✅ Password entered");

  // Click login button
  await page.getByRole("button", { name: "Login" }).click();
  console.log("✅ Login button clicked");

  // Wait for dashboard to load after login
  await page.waitForLoadState("networkidle");
  console.log("✅ Dashboard loaded successfully");

  // ============ STEP 3: Navigate to Recruitment Module ============
  console.log("📍 Step 3: Navigating to Recruitment module...");
  
  // Click on Recruitment menu
  await page.getByText("Recruitment").click();
  console.log("✅ Recruitment menu clicked");

  // Click on Add button to create new recruitment entry
  await page.getByRole("button", { name: "Add" }).click();
  console.log("✅ Add button clicked");

  // ============ STEP 4: Understand File Upload Strategy ============
  // IMPORTANT CONCEPT:
  // - The "Browse" button is a CUSTOM <div> element, NOT a standard <input type="file">
  // - Custom buttons don't have file input associated directly
  // - When clicked, they trigger a native file chooser dialog via JavaScript
  // - Playwright intercepts this with waitForEvent("filechooser")
  //
  // Strategy:
  // 1. REGISTER the event listener BEFORE clicking the button
  //    → page.waitForEvent("filechooser") returns a Promise
  // 2. CLICK the Browse button
  //    → This triggers the native file chooser dialog
  // 3. CAPTURE the file chooser object from the Promise
  //    → fileChooser object appears when dialog opens
  // 4. SET the file path on the file chooser
  //    → fileChooser.setFiles() uploads the file
  //
  // Flow: Register Event → Click Button → Get Dialog → Upload File
  console.log("🔍 File upload strategy: Custom button with file chooser event");

  // ============ STEP 5: Register File Chooser Event BEFORE Clicking Browse ============
  // Purpose: Set up listener to intercept the file upload dialog
  // Why BEFORE click? Event must be registered before it's triggered
  console.log(
    "📍 Step 5: Registering file chooser event listener (before click)..."
  );

  let waitForFileUpload = page.waitForEvent("filechooser");
  console.log("✅ File chooser event listener registered");

  // ============ STEP 6: Click Browse Button to Trigger File Chooser Dialog ============
  // Purpose: Clicking the custom Browse button opens the native file dialog
  // Result: File chooser dialog appears (system dialog, not page element)
  console.log("📍 Step 6: Clicking Browse button to open file dialog...");

  await page.locator("//div[text()='Browse']").click();
  console.log("✅ Browse button clicked - file dialog should be open");

  // ============ STEP 7: Wait for File Chooser and Get Reference ============
  // Purpose: Capture the file chooser object from the waiting Promise
  // What is fileChooser? Object that represents the opened file dialog
  // We use it to programmatically set which file to upload
  console.log("📍 Step 7: Waiting for file chooser object...");

  const fileChooser = await waitForFileUpload;
  console.log("✅ File chooser object captured");

  // ============ STEP 8: Set File Path to Upload ============
  // Purpose: Tell the file chooser which file to upload
  // Method: fileChooser.setFiles(filepath)
  // Note: Path must be absolute or relative to project root
  console.log("📍 Step 8: Setting file path for upload...");

  const filePath = "D:\\git\\pw-fusion\\artifacts\\Locators-Questions.docx";
  await fileChooser.setFiles(filePath);
  console.log(`✅ File uploaded: ${filePath}`);

  // ============ STEP 9: Wait for File Upload to Complete ============
  // Purpose: Give the server time to process the file upload
  // Note: 10 seconds may be excessive; adjust based on actual upload time
  console.log("📍 Step 9: Waiting for file upload to complete on server...");

  await page.waitForTimeout(10000);
  console.log("✅ File upload processing time completed");

  

  // ============ STEP 11: Logout from Application ============
  console.log("📍 Step 11: Logging out from application...");

  // Click on user dropdown (profile icon)
  await page.locator("//li[@class='oxd-userdropdown']/span/i").click();
  console.log("✅ User dropdown clicked");

  // Click Logout option
  await page.getByText("Logout").click();
  console.log("✅ Logout clicked");

  // ============ STEP 12: Wait for Logout to Complete ============
  // Purpose: Ensure logout is processed and we're back to login page
  console.log("📍 Step 12: Waiting for logout to complete...");

  await page.waitForTimeout(5000);
  console.log("✅ Logout completed");

 /**
  * We can also write the code inside Promise.all()
  * await Promise.all([
  *   page.waitForEvent("filechooser"),
  *   page.locator("//div[text()='Browse']").click()
  * ]);
  * This way we ensure that the event listener is registered before the click happens 
  * 
  * also u can upload multiple files by passing an array of file paths to setFiles():
  * await fileChooser.setFiles([
  *   "D:\\git\\pw-fusion\\artifacts\\Locators-Questions.docx",
  *   "D:\\git\\pw-fusion\\artifacts\\AnotherFile.pdf"
  * ]);
  */
});

