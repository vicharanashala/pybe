import { SceneManager } from './SceneManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  new SceneManager(app);
});
