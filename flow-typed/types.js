// @flow

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void
  }
};

export type Action = ActionT<'SET_USER_PROFILE_STORY', string>;
