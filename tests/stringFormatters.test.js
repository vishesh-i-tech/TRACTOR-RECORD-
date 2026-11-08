// Unit tests: stringFormatters
import { slugify, camelCase } from '../utils/stringFormatters.js';

console.log('Testing slugify:', slugify('Hello World!') === 'hello-world');
console.log('Testing camelCase:', camelCase('hello-world') === 'helloWorld');

// Revision 41 - 2026-11-09
