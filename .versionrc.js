module.exports = {
  releaseCommitMessageFormat: "chore(release): :tada: Release v{{currentTag}} [ci skip]",
  types: [
    { type: 'feat', section: '🚀 Features' },
    { type: 'fix', section: '🐞 Bug Fixes' },
    { type: 'style', section: '✨ Improvement' },
    { type: 'refactor', section: '✨ Improvement' },
    { type: 'perf', section: '✨ Improvement' },
    { type: 'docs', section: '✨ Improvement', hidden: true },
    { type: 'test', section: '✅ Tests', hidden: true },
    { type: 'build', section: '⚙️ Internal', hidden: true },
    { type: 'ci', section: '⚙️ Internal', hidden: true },
    { type: 'chore', section: '⚙️ Internal', hidden: true },
  ],
};
