import { RESOURCE_ICONS } from './resource-icons';

/**
 * Built-in SVG icons dataset for tech stacks, social platforms, and badges
 */

export interface IconData {
  path?: string;
  svgContent?: string;
  viewBox?: string;
  defaultColor?: string;
}

export const ICONS: Record<string, IconData> = {
  github: {
    viewBox: '0 0 24 24',
    path: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
    defaultColor: '#ffffff'
  },
  npm: {
    viewBox: '0 0 24 24',
    path: 'M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.13l13.74 0v13.74H15.3V8.565h-3.435v10.305H5.13z',
    defaultColor: '#CB3837'
  },
  javascript: {
    viewBox: '0 0 24 24',
    path: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.5-1.065-2.64-1.065-1.785 0-3.03 1.11-3.03 2.805 0 .975.466 1.74 1.38 2.22.975.526 2.296.796 2.476 1.38.195.631-.075.945-.75.99-.99.12-1.725-.405-2.055-.99l-1.815 1.065c.345.72.766 1.246 1.396 1.636 1.155.675 2.82.63 3.735-.075.9-.66 1.185-1.68 1.02-2.671zm-9.332-6.526h-2.16v6.99c0 1.245-.045 2.145-.915 2.685-.645.39-1.545.345-2.145.09-.345-.165-.63-.39-.855-.66-.195-.24-.345-.48-.465-.72-.03-.045-.06-.105-.09-.15l-1.74 1.14c.48.9 1.17 1.56 2.055 1.95.96.42 2.16.48 3.225.135 1.17-.405 1.875-1.275 2.025-2.475.06-.39.06-.885.06-1.545V11.75z',
    defaultColor: '#F7DF1E'
  },
  vercel: {
    viewBox: '0 0 24 24',
    path: 'M24 22.525H0l12-21.05 12 21.05z',
    defaultColor: '#ffffff'
  },
  discord: {
    viewBox: '0 0 24 24',
    path: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
    defaultColor: '#5865F2'
  },
  x: {
    viewBox: '0 0 24 24',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    defaultColor: '#ffffff'
  },
  star: {
    viewBox: '0 0 24 24',
    path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    defaultColor: '#eab308'
  },
  gitfork: {
    viewBox: '0 0 24 24',
    path: 'M6 2a3 3 0 0 0-3 3c0 1.3.84 2.4 2 2.82v4.36A3 3 0 0 0 7 15h2a3 3 0 0 0 2-2.18V8.82c1.16-.42 2-1.52 2-2.82a3 3 0 0 0-3-3 3 3 0 0 0-2.82 2H7.82A3 3 0 0 0 6 2zm12 10a3 3 0 0 0-3 3c0 1.3.84 2.4 2 2.82V20a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1.18c1.16-.42 2-1.52 2-2.82a3 3 0 0 0-6 0c0 1.3.84 2.4 2 2.82V20a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.18c1.16-.42 2-1.52 2-2.82a3 3 0 0 0-3-3z',
    defaultColor: '#ffffff'
  },
  check: {
    viewBox: '0 0 24 24',
    path: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    defaultColor: '#22c55e'
  },
  heart: {
    viewBox: '0 0 24 24',
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    defaultColor: '#ef4444'
  },
  hyggshi: {
    viewBox: '0 0 24 24',
    path: 'M12 2L2 7l10 5 10-5-10-5zm0 8.5L4.5 7 12 3.5 19.5 7 12 10.5zm-10 6L12 21.5 22 16.5V14l-10 5-10-5v2.5z',
    defaultColor: '#a855f7'
  },

  ...RESOURCE_ICONS
};

/**
 * Get icon SVG path and viewBox by slug or raw string
 */
export function getIcon(iconName?: string): IconData | null {
  if (!iconName) return null;
  const clean = iconName.trim().toLowerCase().replace(/[\s_-]/g, '');

  // check common aliases
  const aliasMap: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    py: 'python',
    next: 'nextjs',
    nextdotjs: 'nextjs',
    tailwindcss: 'tailwind',
    node: 'nodejs',
    twitter: 'x',
    fork: 'gitfork',
    forks: 'gitfork',
    stars: 'star',
    success: 'check',
    sponsor: 'heart',
    love: 'heart',
    // New resource icons aliases
    'c++': 'cpp',
    cplusplus: 'cpp',
    cs: 'csharp',
    dotnet: 'csharp',
    c: 'clang',
    go: 'golang',
    r: 'rlang',
    rlanguage: 'rlang',
    hf: 'huggingface',
    huggingfaceicon: 'huggingface',
    win: 'windows',
    win10: 'windows',
    win11: 'windows',
    microsoft: 'windows',
    tw: 'tailwind',
    tailwind4: 'tailwind',
    vt: 'vite',
    vitejs: 'vite',
    vuejs: 'vue',
    vue3: 'vue',
    pnpmjs: 'pnpm',
    yarnpkg: 'yarn',
    gemini: 'aistudio',
    googleai: 'aistudio',
    electronjs: 'electron',
    tauri2: 'tauri',
    rb: 'ruby',
    rs: 'rust',
    sh: 'bash',
    shell: 'bash',
    ffmpegicon: 'ffmpeg',
    blender3d: 'blender',
    qtframework: 'qt',
    kotlinlang: 'kotlin',
    gulp4: 'gulp',
    nexcode: 'nexcode'
  };

  const resolved = aliasMap[clean] || clean;
  if (ICONS[resolved]) {
    return ICONS[resolved];
  }

  // If passed custom SVG path directly
  if (iconName.startsWith('M') || iconName.startsWith('m')) {
    return {
      path: iconName,
      viewBox: '0 0 24 24',
      defaultColor: '#ffffff'
    };
  }

  return null;
}
