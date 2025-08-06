export type InputPopoverInput = {
  name: string;
  placeholder: string;
  value: string | number;
};

export type InputPopoverButton = {
  text: string;
  type?: "submit" | "button";
  onClick?: (event: Event) => void;
};

export type InputPopoverChangeEvent = {
  originEvent: Event;
  inputs: InputPopoverInput[];
};
