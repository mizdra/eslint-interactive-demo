import { promisify } from 'util';
import { exec } from 'child_process';
import { Core, takeRuleStatistics } from 'eslint-interactive';

const execPromise = promisify(exec);

const core = new Core({
  patterns: ['src'],
});
const results = await core.lint();

console.log(core.formatResultSummary(results));

const statistics = takeRuleStatistics(results);

const sortedStatistics = statistics
  // Exclude non-fixable statistic
  .filter((statistic) => statistic.isFixableCount > 0)
  // Sort by descending order of fixable count
  .sort((a, b) => b.isFixableCount - a.isFixableCount);

const ruleIds = sortedStatistics.map((statistic) => statistic.ruleId);

const top3RuleIds = ruleIds.slice(0, 3);

// Fix the top three fixable errors in order.
for (const ruleId of top3RuleIds) {
  console.log(`Fixing ${ruleId}...`);
  await core.applyAutoFixes(results, [ruleId]);
  // git commit
  await execPromise(`git commit -am "fix ${ruleId}"`);
}

console.log('complete!');