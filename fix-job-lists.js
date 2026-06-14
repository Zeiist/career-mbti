// 这个脚本用于生成修正后的jobLists
// 运行方法：在浏览器控制台粘贴并运行

// 1. 首先，提取jobLists中所有不匹配的岗位
const mismatchedJobs = [];
Object.values(jobLists).forEach(jobs => {
    jobs.forEach(job => {
        if (!jobDetails[job]) {
            mismatchedJobs.push(job);
        }
    });
});

console.log('不匹配的岗位总数:', mismatchedJobs.length);
console.log('不匹配的岗位列表:', mismatchedJobs);

// 2. 尝试自动匹配
const autoMatched = [];
mismatchedJobs.forEach(job => {
    const keys = Object.keys(jobDetails);
    // 查找最长共同子串
    let matchedKey = null;
    let maxMatchLength = 0;
    
    keys.forEach(k => {
        if (job.includes(k) && k.length > maxMatchLength) {
            maxMatchLength = k.length;
            matchedKey = k;
        }
        if (k.includes(job) && job.length > maxMatchLength) {
            maxMatchLength = job.length;
            matchedKey = k;
        }
    });
    
    if (matchedKey) {
        autoMatched.push({ original: job, matched: matchedKey });
    }
});

console.log('自动匹配的岗位:', autoMatched);
console.log('自动匹配数量:', autoMatched.length);

// 3. 生成修正后的jobLists代码
let newJobLists = "const jobLists = {";
Object.keys(jobLists).forEach(code => {
    newJobLists += `\n            "${code}": [`;
    const jobs = jobLists[code];
    const newJobs = jobs.map(job => {
        // 检查是否需要替换
        const matched = autoMatched.find(m => m.original === job);
        return matched ? `"${matched.matched}"` : `"${job}"`;
    });
    newJobLists += newJobs.join(', ');
    newJobLists += `],`;
});
newJobLists += "\n        };";

console.log('修正后的jobLists代码:');
console.log(newJobLists);
