export interface HeaderProps {
  date: string;
  result: string;
  duration: string;
  mode: string;
}

export interface MatchResultProps {
  result: string;
}

export interface GameModeProps {
  mode: string;
}

export interface MatchDateProps {
  date: string;
}

export interface MatchDurationProps {
  duration: string;
}

export interface MatchResultHook {
  isWin: boolean;
  displayResult: string;
  resultClass: string;
}
