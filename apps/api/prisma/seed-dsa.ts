import { PrismaClient, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding GTU Coding & DSA Practice Problems...");

  const problemsData = [
    {
      title: "Two Sum — Target Pair Index",
      slug: "two-sum",
      topic: "arrays",
      difficulty: Difficulty.EASY,
      order: 1,
      timeLimit: 1.0,
      memoryLimit: 128,
      description: `### Problem Description
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

### Example 1:
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2:
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

### Constraints:
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
`,
      solutionTemplate: {
        python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        seen = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in seen:
                return [seen[diff], i]
            seen[num] = i
        return []
`,
        cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};
`,
        javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
`,
      },
      testCases: [
        { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", isHidden: false },
        { input: "[3,2,4], 6", expectedOutput: "[1,2]", isHidden: false },
        { input: "[3,3], 6", expectedOutput: "[0,1]", isHidden: true },
        { input: "[-1,-2,-3,-4,-5], -8", expectedOutput: "[2,4]", isHidden: true },
      ],
    },
    {
      title: "Valid Parentheses Syntax Checker",
      slug: "valid-parentheses",
      topic: "stacks",
      difficulty: Difficulty.EASY,
      order: 2,
      timeLimit: 1.0,
      memoryLimit: 128,
      description: `### Problem Description
Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Example 1:
\`\`\`
Input: s = "()"
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\`

### Example 3:
\`\`\`
Input: s = "(]"
Output: false
\`\`\`
`,
      solutionTemplate: {
        python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {")": "(", "}": "{", "]": "["}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack
`,
        cpp: `#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> map = {{')', '('}, {'}', '{'}, {']', '['}};
        for (char c : s) {
            if (map.count(c)) {
                if (st.empty() || st.top() != map[c]) return false;
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};
`,
        javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}
`,
      },
      testCases: [
        { input: '"()"', expectedOutput: "true", isHidden: false },
        { input: '"()[]{}"', expectedOutput: "true", isHidden: false },
        { input: '"(]"', expectedOutput: "false", isHidden: false },
        { input: '"([)]"', expectedOutput: "false", isHidden: true },
        { input: '"{[]}"', expectedOutput: "true", isHidden: true },
      ],
    },
    {
      title: "Binary Tree Level Order Traversal (BFS)",
      slug: "binary-tree-level-order",
      topic: "trees",
      difficulty: Difficulty.MEDIUM,
      order: 3,
      timeLimit: 1.5,
      memoryLimit: 256,
      description: `### Problem Description
Given the \`root\` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

### Example 1:
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
\`\`\`

### Example 2:
\`\`\`
Input: root = [1]
Output: [[1]]
\`\`\`
`,
      solutionTemplate: {
        python: `class Solution:
    def levelOrder(self, root) -> list[list[int]]:
        if not root:
            return []
        result, queue = [], [root]
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.pop(0)
                level.append(node.val)
                if node.left: queue.append(node.left)
                if node.right: queue.append(node.right)
            result.append(level)
        return result
`,
        cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        if (!root) return {};
        vector<vector<int>> result;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int sz = q.size();
            vector<int> level;
            for (int i = 0; i < sz; ++i) {
                TreeNode* node = q.front(); q.pop();
                level.push_back(node->val);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            result.push_back(level);
        }
        return result;
    }
};
`,
        javascript: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}
`,
      },
      testCases: [
        { input: "[3,9,20,null,null,15,7]", expectedOutput: "[[3],[9,20],[15,7]]", isHidden: false },
        { input: "[1]", expectedOutput: "[[1]]", isHidden: false },
        { input: "[]", expectedOutput: "[]", isHidden: true },
      ],
    },
    {
      title: "0/1 Knapsack Problem (Dynamic Programming)",
      slug: "01-knapsack-problem",
      topic: "dynamic-programming",
      difficulty: Difficulty.MEDIUM,
      order: 4,
      timeLimit: 2.0,
      memoryLimit: 256,
      description: `### Problem Description
Given \`W\` representing the knapsack capacity, and two arrays \`val[]\` and \`wt[]\` representing values and weights of \`N\` items respectively, find the maximum value that can be put in a knapsack of capacity \`W\`.

Note that you cannot break items; you can either pick the complete item or don't pick it (0-1 property).

### Example 1:
\`\`\`
Input: W = 4, val = [1,2,3], wt = [4,5,1]
Output: 3
Explanation: Choose the 3rd item with weight 1 and value 3.
\`\`\`
`,
      solutionTemplate: {
        python: `class Solution:
    def knapSack(self, W: int, wt: list[int], val: list[int], n: int) -> int:
        dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
        for i in range(1, n + 1):
            for w in range(1, W + 1):
                if wt[i-1] <= w:
                    dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w])
                else:
                    dp[i][w] = dp[i-1][w]
        return dp[n][W]
`,
        cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int knapSack(int W, vector<int>& wt, vector<int>& val, int n) {
        vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= W; w++) {
                if (wt[i - 1] <= w)
                    dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
                else
                    dp[i][w] = dp[i - 1][w];
            }
        }
        return dp[n][W];
    }
};
`,
        javascript: `function knapSack(W, wt, val, n) {
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (wt[i - 1] <= w) {
        dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][W];
}
`,
      },
      testCases: [
        { input: "W = 4, val = [1,2,3], wt = [4,5,1]", expectedOutput: "3", isHidden: false },
        { input: "W = 50, val = [60,100,120], wt = [10,20,30]", expectedOutput: "220", isHidden: false },
        { input: "W = 10, val = [10,40,30,50], wt = [5,4,6,3]", expectedOutput: "90", isHidden: true },
      ],
    },
  ];

  for (const p of problemsData) {
    const { testCases, ...problemData } = p;
    const problem = await prisma.problem.upsert({
      where: { slug: p.slug },
      update: problemData,
      create: problemData,
    });

    // Delete existing test cases and re-create
    await prisma.testCase.deleteMany({ where: { problemId: problem.id } });
    for (const tc of testCases) {
      await prisma.testCase.create({
        data: {
          problemId: problem.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
        },
      });
    }
  }

  console.log("DSA Problems & Test Cases seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
