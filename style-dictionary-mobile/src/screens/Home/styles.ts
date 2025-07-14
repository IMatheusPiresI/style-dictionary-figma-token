import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.primary};
`;

export const RNSafeAreaView = styled.SafeAreaView`
  flex: 1;
`;
