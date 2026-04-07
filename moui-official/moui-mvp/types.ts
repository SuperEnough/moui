export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface HistoryItem {
  code: string;
  timestamp: number;
  prompt: string;
  registry?: Registry;
  main?: string;
}

export interface Registry {
  layout: string;
  components: { [name: string]: string };
  logic: string;
  meta: {
    title: string;
    themeColor: string;
  };
}

export interface ComponentRegistry {
  [name: string]: string;
}

export interface MaterializedState {
  [key: string]: any;
}

export interface GeneratedComponentState {
  code: string;
  version: number;
  description: string;
}

export interface CodeExecutionScope {
  React: any;
  ReactDOM: any;
  LucideReact: any;
  Recharts: any;
  FramerMotion: any;
}
