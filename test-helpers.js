// Test script to check helper function outputs
const {
  getSummonerSpellImage,
  getRuneIcon,
} = require('./src/shared/lib/utils/helpers.ts');

console.log('Testing getSummonerSpellImage function:');
console.log('getSummonerSpellImage(4):', getSummonerSpellImage(4));
