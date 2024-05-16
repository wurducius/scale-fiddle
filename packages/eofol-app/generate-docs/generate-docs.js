#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs");

const showdown = require("showdown");

const DOCS_DIR = "docs";
const SECTIONS_DIR = "sections";
const BUILD_DIR = "build";

const TEMPLATE_FILENAME = "template.html";

const MARKER_TITLE = "@@TITLE";
const MARKER_TABLE_OF_CONTENTS = "@@TABLE_OF_CONTENTS";
const MARKER_ARTICLE = "@@ARTICLE";

const SECTION_PREFIX_LENGTH = 3;

const TABLE_OF_CONTENTS_TITLE = "Table of contents";
const TABLE_OF_CONTENTS_TITLE_TAG = "h2";

const copyString = (originalString) => (" " + originalString).slice(1);

const capitalize = (str) =>
  str
    .split("")
    .map((letter, i) => (i === 0 ? letter.toUpperCase() : letter))
    .join("");

const createLink = (title, href) => `<a href="${href}">${title}</a>`;

const createTableOfContentsWrapper = (links) =>
  `<div><${TABLE_OF_CONTENTS_TITLE_TAG}>${TABLE_OF_CONTENTS_TITLE}</${TABLE_OF_CONTENTS_TITLE_TAG}><ul>${links}</ul></div>`;

const createTableItem = (item) =>
  `<li class="table-of-contents-item">${item}</li>`;

// ----------------------------------------------
// --------------  GENERATE DOCS  ---------------
// ----------------------------------------------

console.log("Scale fiddle - generate docs - START");

const docsPath = path.resolve(process.cwd(), DOCS_DIR);
const sectionsPath = path.resolve(docsPath, SECTIONS_DIR);
const templatePath = path.resolve(docsPath, TEMPLATE_FILENAME);
const buildPath = path.resolve(process.cwd(), BUILD_DIR);

const sectionFilenames = fs.readdirSync(sectionsPath);

const sectionPageNames = sectionFilenames.map((sectionFilename) =>
  sectionFilename.substring(SECTION_PREFIX_LENGTH, sectionFilename.length - 3)
);

const sectionTitles = sectionPageNames
  .map((sectionName) => sectionName.replaceAll("-", " "))
  .map(capitalize);

const linkElements = sectionTitles.map((title, i) =>
  createLink(title, "/docs/" + sectionPageNames[i] + ".html")
);

const tableOfContentsHTML = createTableOfContentsWrapper(
  linkElements.map(createTableItem).join("")
);

const templateHTML = fs.readFileSync(templatePath);

const buildDocsPath = path.resolve(buildPath, DOCS_DIR);
console.log("Scale fiddle - generate docs - CLEAN");
if (fs.existsSync(buildDocsPath)) {
  fs.rmSync(buildDocsPath, { recursive: true, force: true });
}
fs.mkdirSync(buildDocsPath);

const converter = new showdown.Converter();

sectionFilenames.forEach((sectionFilename, i) => {
  console.log(
    `Scale fiddle - generate docs - Generating page: ${sectionPageNames[i]} [${
      i + 1
    }/${sectionFilenames.length}]`
  );
  const sectionMd = fs.readFileSync(
    path.resolve(sectionsPath, sectionFilename)
  );
  const articleHTML = converter.makeHtml(sectionMd.toString());
  const resultHTML = copyString(templateHTML)
    .replace(MARKER_TITLE, capitalize(sectionPageNames[i]))
    .replace(MARKER_TABLE_OF_CONTENTS, tableOfContentsHTML)
    .replace(MARKER_ARTICLE, articleHTML);
  fs.writeFileSync(
    path.resolve(buildDocsPath, sectionPageNames[i] + ".html"),
    resultHTML
  );
});

console.log("Scale fiddle - generate docs - COMPLETED");
