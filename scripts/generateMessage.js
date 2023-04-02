import fs from 'node:fs/promises'
const benchmarkData = await fetch(`https://raw.githubusercontent.com/discordeno/discordeno/benchies/benchmarksResult/data.js`)
  .then(async (res) => await res.text())
  .then((text) => JSON.parse(text.slice(24)))
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const commitSha = await fs.readFile('./sha', 'utf-8')
const results = JSON.parse(await fs.readFile('./data.json', 'utf-8'))
const benchmarks = results.entries.Benchmark
benchmarks.reverse()
const compareWithHead = {}
const latestBaseBenchmarks = benchmarkData.entries.Benchmark.slice(-1)[0]
for (const benchmark of latestBaseBenchmarks.benches) {
  compareWithHead[benchmark.name] = {
    [latestBaseBenchmarks.commit.id]: benchmark,
  }
}
for (let i = 0; i < benchmarks.length; i++) {
  for (const bench of benchmarks[i].benches) {
    if (compareWithHead[bench.name]) {
      compareWithHead[bench.name][benchmarks[i].commit.id] = bench
    } else {
      compareWithHead[bench.name] = {
        [benchmarks[i].commit.id]: bench,
      }
    }
  }
}
let message = '<!-- benchmark comment by ci -->\n'
message += `## Benchmark\n\n`
message += '<details><summary>Detail results of benchmarks</summary>\n\n'
let header1 = `| Benchmark suite | Base (${latestBaseBenchmarks.commit.id}) |`
let header2 = `|-|-|`
for (const [index, commitId] of benchmarks.map((benchmark) => benchmark.commit.id).entries()) {
  header1 += index === 0 ? ` Latest Head (${commitId}) |` : ` ${commitId} |`
  header2 += '-|'
}
message += `${header1}\n`
message += `${header2}\n`
for (const benchName of Object.keys(compareWithHead)) {
  let benchData = `| ${benchName} |`
  benchData += compareWithHead[benchName][latestBaseBenchmarks.commit.id]
    ? ` ${`\`${compareWithHead[benchName][latestBaseBenchmarks.commit.id].value}\` ${
        compareWithHead[benchName][latestBaseBenchmarks.commit.id].unit
      } \`${compareWithHead[benchName][latestBaseBenchmarks.commit.id].range}\``} |`
    : '|'
  for (const commitId of benchmarks.map((benchmark) => benchmark.commit.id)) {
    benchData += compareWithHead[benchName][commitId]
      ? ` \`${compareWithHead[benchName][commitId].value}\` ${compareWithHead[benchName][commitId].unit} \`${compareWithHead[benchName][commitId].range}\`|`
      : '|'
  }
  message += `${benchData}\n`
}
message += '</details>\n\n'
console.log(message.replaceAll('`', '\\`'))