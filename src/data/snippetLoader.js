import javascriptSnippets from './javascript.json';
import cppSnippets from './cplusplus.json';
import pythonSnippets from './python.json';
import phpSnippets from './php.json';
import linuxSnippets from './linux.json';

const snippetsByLanguage = {
  javascript: javascriptSnippets.snippets,
  cpp: cppSnippets.snippets,
  python: pythonSnippets.snippets,
  php: phpSnippets.snippets,
  linux: linuxSnippets.snippets
};

export const getRandomSnippet = (language = 'javascript') => {
  const snippets = snippetsByLanguage[language] || snippetsByLanguage.javascript;
  const randomIndex = Math.floor(Math.random() * snippets.length);
  return snippets[randomIndex];
};

export const getAvailableLanguages = () => {
  return [
    { id: 'javascript', name: 'JavaScript', displayName: 'JavaScript' },
    { id: 'python', name: 'Python', displayName: 'Python' },
    { id: 'php', name: 'PHP', displayName: 'PHP' },
    { id: 'cpp', name: 'C++', displayName: 'C++' },
    { id: 'linux', name: 'Linux', displayName: 'Linux' }
  ];
};
