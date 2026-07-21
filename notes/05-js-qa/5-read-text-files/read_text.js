import fs from "fs";


// task  - read the content of dummy.txt file and replace all occurences of Vitamins with Minerals-Vitamins 
// and print the new content to console


try {
  const data = fs.readFileSync("./4-read-text-files/dummy.txt", "utf-8");

  console.log(typeof data);
  console.log(data);
  console.log();

  let new_data = data.replaceAll("Vitamins", "Minerals-Vitamins");
  console.log(new_data);
} catch (error) {
  console.log("Error reading file");
  console.log(error);
}

/**
 * ./ will take your root folder (the folder from where you're running the script/command)
 * i.e. here root folder is 'naveen_js_course' and
 * then in that, look for folder 4-read-text-files
 * and inside that, look for dummy.txt file
 * 'utf-8' tells it to return the content as readable text
 * type of data will be string
 * type of data will be string
 */
