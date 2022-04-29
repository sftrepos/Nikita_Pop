export interface reaction {
  key: string;
  unicode: string;
}

const reactions: Array<reaction> = [
  {
    key: 'fire',
    unicode: '\u{1F525}',
  },
  {
    key: 'heart',
    unicode: '\u{2764}',
  },
  {
    key: 'face with open mouth',
    unicode: '\u{1F62E}',
  },
  {
    key: 'smiling face with tightly-closed eyes and open mouth',
    unicode: '\u{1F606}',
  },
  {
    key: 'thumbs up',
    unicode: '\u{1F44D}',
  },
  {
    key: 'thumbs down',
    unicode: '\u{1F44E}',
  },
];

export default reactions;
