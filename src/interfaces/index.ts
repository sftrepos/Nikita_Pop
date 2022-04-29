export interface universityInterface {
  major?: string;
  gradDate?: number;
  name?: string;
}

export interface profileInterface {
  username?: string;
  name?: string;
  hometown?: string;
  gender?: string;
  card?: Object;
  university?: universityInterface;
}

export interface questionInterface {
  _id: string;
  question: string;
  category?: string;
  popularity?: number;
  response?: string;
  timestamp?: Date;
}
