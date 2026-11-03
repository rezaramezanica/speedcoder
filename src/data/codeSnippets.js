export const codeSnippets = [
  {
    id: 1,
    language: 'javascript',
    code: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
  },
  {
    id: 2,
    language: 'javascript',
    code: `const quickSort = (arr) => {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = arr.filter((x, i) => x <= pivot && i < arr.length - 1);
    const right = arr.filter(x => x > pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
}`
  },
  {
    id: 3,
    language: 'javascript',
    code: `class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}`
  },
  {
    id: 4,
    language: 'javascript',
    code: `const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}`
  },
  {
    id: 5,
    language: 'javascript',
    code: `async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}`
  },
  {
    id: 6,
    language: 'javascript',
    code: `const isPalindrome = (str) => {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}`
  },
  {
    id: 7,
    language: 'javascript',
    code: `function* infiniteSequence() {
    let i = 0;
    while (true) {
        yield i++;
    }
}`
  },
  {
    id: 8,
    language: 'javascript',
    code: `const mergeArrays = (arr1, arr2) => {
    return [...new Set([...arr1, ...arr2])].sort((a, b) => a - b);
}`
  },
  {
    id: 9,
    language: 'python',
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
  },
  {
    id: 10,
    language: 'python',
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right`
  }
];

export const getRandomSnippet = () => {
  const randomIndex = Math.floor(Math.random() * codeSnippets.length);
  return codeSnippets[randomIndex];
};
