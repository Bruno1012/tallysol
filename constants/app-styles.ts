import { StyleSheet } from 'react-native'
import { Colors } from './colors'

export const appStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardTint,
    borderRadius: 12,
    padding: 12,
  },
  screen: {
    backgroundColor: Colors.white,
    flex: 1,
    gap: 16,
    paddingHorizontal: 16,
  },
  stack: {
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.purple,
  },
  cardText: {
    color: Colors.purple,
    fontWeight: 'bold',
  },
  walletHeadline: {
    color: Colors.purple,
    fontSize: 24,
    fontWeight: 'bold',
  },
  walletRow: {
    color: Colors.purple,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: Colors.purple,
    borderRadius: 8,
    borderWidth: 1,
    color: Colors.purple,
    fontWeight: 'bold',
    padding: 10,
  },
})
