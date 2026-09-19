import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Currency } from '@/constants/currencies'
import { Colors } from '@/constants/colors'

export function CurrencyPicker({
  selected,
  onSelect,
  currencies,
}: {
  selected: Currency
  onSelect: (currency: Currency) => void
  currencies: Currency[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <View>
      <Pressable style={styles.trigger} onPress={() => setOpen((prev) => !prev)}>
        <Text style={styles.triggerText}>{selected.symbol}</Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </Pressable>
      {open ? (
        <View style={styles.dropdown}>
          {currencies.map((currency) => {
            const isSelected = currency.symbol === selected.symbol
            return (
              <Pressable
                key={currency.symbol}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => {
                  onSelect(currency)
                  setOpen(false)
                }}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{currency.symbol}</Text>
              </Pressable>
            )
          })}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  chevron: {
    color: Colors.purple,
    fontSize: 10,
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderColor: Colors.purple,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionSelected: {
    backgroundColor: Colors.green,
  },
  optionText: {
    color: Colors.purple,
    fontWeight: 'bold',
  },
  optionTextSelected: {
    color: Colors.purple,
  },
  trigger: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.cardTint,
    borderColor: Colors.purple,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  triggerText: {
    color: Colors.purple,
    fontWeight: 'bold',
  },
})
