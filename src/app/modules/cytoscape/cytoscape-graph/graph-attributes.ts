import { Danger, Neutral, Warning } from './clarity-colors';

export const HighlightClass = 'mousehighlight';
export const DimClass = 'mousedim';
export const HoveredClass = 'mousehover';

export const Node = {
  borderWidth: '1px',
  colorFill: Neutral['5'],
  colorFillHover: Neutral['7'],
  colorFillHoverDegraded: Warning['200'],
  colorFillHoverFailure: Danger['200'],
  colorBorder: Neutral['10'],
  colorBorderDegraded: Warning['800'],
  colorBorderFailure: Danger['800'],
  height: '45px',
  width: '45px',

  parentBackgroundColor: '#000',
  parentTextColor: '#fff',
};

export const NodeBox = {
  colorFill: Neutral['6'],
};

export const NodeText = {
  fontSizeHover: '8px',
  fontSize: '8px',
  color: 'black',
  backgroundColor: 'white',
};

export const Edge = {
  textFontSize: '10px',
  textFontSizeHover: '10px',
  textOutlineColor: Neutral['1'],
  textOutlineWidth: '1px',
  width: '2px',
  widthSelected: '4px',
};

export const Badge = {
  backgroundColor: 'purple',
};
