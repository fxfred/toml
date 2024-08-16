'use strict'
module.exports = parseString

const TOMLParser = require('./lib/toml-parser.js')
const prettyError = require('./parse-pretty-error.js')

function parseString (str) {
  if (global.Buffer && global.Buffer.isBuffer(str)) {
    str = str.toString('utf8')
  }
  const parser = new TOMLParser()
  try {
    // let comments;
    // let outsideComments;
    // [comments,outsideComments] = extractComments(str);
    // console.log('----commentObj comments', comments);
    // console.log('----commentObj outsideComments', outsideComments);
    // parser.parse(removeCommentLines(str));
    parser.parse(str)
    return parser.finish()
  } catch (err) {
    throw prettyError(err, str)
  }
}


const removeCommentLines = (input) => {
  // Split the input string by new lines
  const lines = input.split('\n');

  // Filter out lines that start with '#'
  const filteredLines = lines.filter((line) => !line.trim().startsWith('#'));

  // Join the remaining lines back into a single string
  return filteredLines.join('\n');
};


// Function to parse a line and extract content and comments
const parseLine = (line) => {
  const trimmedLine = line.trim();
  
  if (trimmedLine.startsWith('#')) {
    return { line, content: '', comment: trimmedLine, isFullLineComment: true };
  }

  const match = trimmedLine.match(/(.*?)(?:\s*#\s*(.*))?$/) || [null, trimmedLine, null];
  return { line, content: match[1].trim(), comment: match[2] || '', isFullLineComment: false };
};

// Function to extract section name from content
const parseSection = (content) => {
  const match = content.match(/^\[([^\]]+)\]/);
  return match ? match[1] : null;
};

// Function to extract key from content
const parseKey = (content) => {
  const match = content.match(/^(\w+)\s*=/);
  return match ? match[1] : null;
};

// Function to extract comments from the input content
function extractComments(inputContent) {
  const lines = inputContent.split('\n');
  const comments = {};
  const outsideComments = [];
  let currentSection = null;
  let insideSection = false;

  lines.forEach((line) => {
    const { content, comment, isFullLineComment } = parseLine(line);

    const section = parseSection(content);
    if (section) {
      currentSection = section;
      insideSection = true;
      if (comment) {
        comments[currentSection] = { inlineComment: comment };
      }
      return;
    }

    if (isFullLineComment) {
      if (insideSection) {
        comments[currentSection] = comments[currentSection] || {};
        comments[currentSection].fullLineComments = comments[currentSection].fullLineComments || [];
        comments[currentSection].fullLineComments.push(comment);
      } else {
        outsideComments.push(comment);
      }
      return;
    }

    const key = parseKey(content);
    if (key && insideSection) {
      const fullKey = `${currentSection}.${key}`;
      if (comment) {
        comments[fullKey] = { inlineComment: comment };
      }
    }
  });

  return [comments, outsideComments];
};
