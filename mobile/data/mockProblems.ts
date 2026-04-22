import { Problem } from '@/types/problem';

//This is the list of all the problems rendered on the /problems/{id} page
export const MOCK_PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: ['Array', 'Hash Map'],
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] == 9',
      },
    ],
    hints: [
      'Try storing values you have already seen.',
      'A hash map can help you find the complement quickly.',
    ],
    starterCode: `function twoSum(nums, target) {
  // Write your solution here
}`,
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: ['Stack', 'String'],
    description:
      'Given a string s containing just the characters ()[]{} determine if the input string is valid.',
    examples: [
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
    ],
    hints: ['Think about the most recent opening bracket first.'],
    starterCode: `function isValid(s) {
  // Write your solution here
}`,
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: ['Array', 'Binary Search'],
    description:
      'Given a sorted array of integers and a target value, return the index if the target is found. Otherwise return -1.',
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
      },
    ],
    hints: ['Use left, right, and middle pointers.'],
    starterCode: `function search(nums, target) {
  // Write your solution here
}`,
  },
];