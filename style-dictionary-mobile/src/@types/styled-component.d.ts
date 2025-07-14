import 'styled-components/native';
type ITheme = {
  primary: string;
};

// and extend them!
declare module 'styled-components/native' {
  export interface DefaultTheme extends ITheme {}
}
