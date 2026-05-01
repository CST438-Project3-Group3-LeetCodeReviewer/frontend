import { Problem } from '@/types/problem';

// This is the list of all the problems rendered on the /problems/{id} page
export const MOCK_PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: ['Array', 'Hash Map'],
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] == 9',
      },
    ],
    hints: [
      'A brute force way is to check every pair, but that is too slow for larger inputs.',
      'Use a hash map to store numbers you have already seen and their indices.',
    ],
    starterCode: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    category: ['Array', 'Hash Map', 'String', 'Sorting'],
    description:
      'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation:
          'There is no string in strs that can be rearranged to form "bat". The strings "nat" and "tan" are anagrams as they can be rearranged to form each other. The strings "ate", "eat", and "tea" are anagrams as they can be rearranged to form each other.',
      },
    ],
    hints: [
      'Sort each string and use the sorted result as the hash map key.',
      'An alternative is to build a 26-letter frequency signature for each word instead of sorting.',
    ],
    starterCode: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'shortest-subarray-with-sum-at-least-k',
    title: 'Shortest Subarray with Sum at Least K',
    difficulty: 'Hard',
    category: ['Array', 'Hash Map', 'Binary Search', 'Queue', 'Sliding Window'],
    description:
      'Given an integer array nums and an integer k, return the length of the shortest non-empty subarray of nums with a sum of at least k. If there is no such subarray, return -1. A subarray is a contiguous part of an array.',
    examples: [
      {
        input: 'nums = [1], k = 1',
        output: '1',
        explanation: 'The subarray [1] has sum 1, so the answer is 1.',
      },
    ],
    hints: [
      'Build a prefix sum array so subarray sums can be computed quickly.',
      'Use a deque to keep candidate prefix indices in increasing prefix-sum order.',
    ],
    starterCode: `class Solution {
    public int shortestSubarray(int[] nums, int k) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: ['String', 'Two Pointers'],
    description:
      'Given a string s, determine if it is a palindrome after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters. An empty string is considered a valid palindrome.',
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: 'After filtering and lowercasing, the string becomes "amanaplanacanalpanama", which is a palindrome.',
      },
    ],
    hints: [
      'Use one pointer from the left and one from the right.',
      'Skip characters that are not letters or digits, and compare lowercase characters only.',
    ],
    starterCode: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your solution here

    }
}`,
  },
  {
    id: '3sum',
    title: '3Sum',
    difficulty: 'Medium',
    category: ['Array', 'Two Pointers', 'Sorting'],
    description:
      'Given an integer array nums, return all the unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.',
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'These are the only unique triplets whose sum is 0.',
      },
    ],
    hints: [
      'Sort the array first so you can use a two-pointer sweep for each fixed element.',
      'Skip duplicates for the fixed element and after finding a valid triplet.',
    ],
    starterCode: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: ['Array', 'Two Pointers', 'Stack', 'Dynamic Programming'],
    description:
      'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water can be trapped after raining.',
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water.',
      },
    ],
    hints: [
      'Water above an index depends on the highest bar to its left and right.',
      'A two-pointer solution works by always advancing the side with the smaller boundary.',
    ],
    starterCode: `class Solution {
    public int trap(int[] height) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'longest-harmonious-subsequence',
    title: 'Longest Harmonious Subsequence',
    difficulty: 'Easy',
    category: ['Array', 'Sliding Window', 'Hash Map', 'Sorting'],
    description:
      'We define a harmonious array as an array where the difference between its maximum value and its minimum value is exactly 1. Given an integer array nums, return the length of its longest harmonious subsequence among all possible subsequences.',
    examples: [
      {
        input: 'nums = [1,3,2,2,5,2,3,7]',
        output: '5',
        explanation: 'The longest harmonious subsequence is [3,2,2,2,3].',
      },
    ],
    hints: [
      'Count how often each number appears.',
      'If both x and x + 1 exist, they can form a harmonious subsequence of length count[x] + count[x + 1].',
    ],
    starterCode: `class Solution {
    public int findLHS(int[] nums) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: ['String', 'Sliding Window', 'Hash Map'],
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with length 3.',
      },
    ],
    hints: [
      'Use a sliding window and expand the right pointer one character at a time.',
      'Track the last seen index of each character so the left pointer can jump forward when needed.',
    ],
    starterCode: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'smallest-range-covering-elements-from-k-lists',
    title: 'Smallest Range Covering Elements from K Lists',
    difficulty: 'Hard',
    category: ['Array', 'Sliding Window', 'Heap', 'Hash Map', 'Sorting'],
    description:
      'You have k lists of sorted integers in non-decreasing order. Find the smallest range that includes at least one number from each of the k lists. If there is more than one such range, return the one with the smallest left endpoint.',
    examples: [
      {
        input: 'nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]',
        output: '[20,24]',
        explanation: 'The range [20,24] includes 24 from the first list, 20 from the second, and 22 from the third.',
      },
    ],
    hints: [
      'Use a min-heap to keep track of the current smallest element among the k lists.',
      'Also track the current maximum element so you can evaluate the current range at each step.',
    ],
    starterCode: `class Solution {
    public int[] smallestRange(List<List<Integer>> nums) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'binary-tree-inorder-traversal',
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    category: ['Tree', 'Tree/Graph Traversal', 'Stack', 'Depth-First Search'],
    description:
      'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
    examples: [
      {
        input: 'root = [1,null,2,3]',
        output: '[1,3,2]',
        explanation: 'Inorder traversal visits left subtree, then node, then right subtree.',
      },
    ],
    hints: [
      'Inorder traversal follows left -> root -> right.',
      'You can solve it recursively or iteratively with a stack.',
    ],
    starterCode: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: ['Matrix', 'Tree/Graph Traversal', 'Array', 'Depth-First Search', 'Breadth-First Search'],
    description:
      'Given an m x n 2D binary grid grid which represents a map of 1\'s (land) and 0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are surrounded by water.',
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: '1',
        explanation: 'All connected land cells form one island.',
      },
    ],
    hints: [
      'Traverse the grid, and when you find unvisited land, start a DFS or BFS.',
      'Mark visited land so you do not count the same island more than once.',
    ],
    starterCode: `class Solution {
    public int numIslands(char[][] grid) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'Hard',
    category: ['String', 'Tree/Graph Traversal', 'Breadth-First Search', 'Hash Map'],
    description:
      'A transformation sequence from beginWord to endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter, every intermediate word is in wordList, and sk == endWord. Return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.',
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: '5',
        explanation: 'One shortest sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog".',
      },
    ],
    hints: [
      'This is a shortest-path problem on an implicit graph, so BFS is a natural fit.',
      'Generate neighboring words by changing one letter at a time and checking whether the result exists in a set.',
    ],
    starterCode: `class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: ['Array', 'Binary Search'],
    description:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, return the index of target if it is in the array. Otherwise, return -1.',
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.',
      },
    ],
    hints: [
      'Use two pointers, left and right, to represent the current search interval.',
      'Compare the middle element with target and discard half the array each step.',
    ],
    starterCode: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    category: ['Array', 'Binary Search'],
    description:
      'There is an integer array nums sorted in ascending order with distinct values. Before being passed to your function, nums is possibly rotated at an unknown pivot index. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
        explanation: 'The target 0 is found at index 4.',
      },
    ],
    hints: [
      'At least one half of the current interval is always sorted.',
      'Decide whether the target lies in the sorted half, then discard the other half.',
    ],
    starterCode: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: ['Array', 'Binary Search', 'Divide and Conquer'],
    description:
      'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m + n)).',
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'The merged array is [1,2,3], and the median is 2.',
      },
    ],
    hints: [
      'Binary search on the smaller array to find a correct partition.',
      'A partition is valid when every value on the left side is less than or equal to every value on the right side.',
    ],
    starterCode: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'kth-largest-element-in-a-stream',
    title: 'Kth Largest Element in a Stream',
    difficulty: 'Easy',
    category: ['Heap', 'Priority Queue', 'Design', 'Data Stream', 'Binary Search', 'Tree'],
    description:
      'Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element. Implement the KthLargest class with a constructor and an add method.',
    examples: [
      {
        input: '[["KthLargest", "add", "add", "add", "add", "add"], [[3, [4,5,8,2]], [3], [5], [10], [9], [4]]]',
        output: '[null, 4, 5, 5, 8, 8]',
        explanation: 'The stream keeps track of the 3rd largest value after each add call.',
      },
    ],
    hints: [
      'Keep a min-heap of size k.',
      'The heap root is always the kth largest element after balancing the heap size.',
    ],
    starterCode: `class KthLargest {

    public KthLargest(int k, int[] nums) {
        // Write your solution here
    }

    public int add(int val) {
        // Write your solution here
        return 0;
    }
}`,
  },
  {
    id: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    category: ['Array', 'Heap', 'Sorting', 'Hash Map'],
    description:
      'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    examples: [
      {
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
        explanation: '1 appears three times and 2 appears twice, making them the top two most frequent elements.',
      },
    ],
    hints: [
      'First count frequencies with a hash map.',
      'Then use a heap or bucket-sort-style grouping to extract the k most frequent values efficiently.',
    ],
    starterCode: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Write your solution here

    }
}`,
  },
  {
    id: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    category: ['Linked List', 'Heap', 'Sorting', 'Divide and Conquer'],
    description:
      'You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'Merging all sorted linked lists produces one sorted linked list.',
      },
    ],
    hints: [
      'A min-heap can always give you the smallest current node among the k lists.',
      'Another approach is divide and conquer, repeatedly merging pairs of lists.',
    ],
    starterCode: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Write your solution here

    }
}`,
  },
];
